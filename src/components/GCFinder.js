'use client'

import Image from 'next/image'
import {useState, useEffect, useCallback, useMemo} from 'react'
import {useRouter} from 'next/navigation'
import Button from '@/components/ui/Button'

export default function GCFinder() {
  const router = useRouter()

  const [isLocatorVisible, setLocatorVisibility] = useState(false)
  const [prevSearch, setPrevSearch] = useState()
  const [search, setSearch] = useState({loading: false, text: '', coordinates: undefined})
  const [searchResult, setSearchResult] = useState()
  const [loadConf, setLoadConf] = useState({loading: false})

  const loadStart = () => setSearch((s) => ({...s, loading: true}))
  const loadStop = () => setSearch((s) => ({...s, loading: false}))
  const redirectWithCoords = (coordinates) => {
    router.push(`/?lat=${coordinates.lat}&lng=${coordinates.lng}&finder=true`, { scroll: false})
  }

  const redirectRoot = () => {
    router.push('/', { scroll: false})
  }

  const hasSearch = useMemo(()=>search.text || search.coordinates, [search.text, search.coordinates])

  const fetchNearbyFromAddress = useCallback(async (addr) => {
    const canSearch = prevSearch !== search.text && search.text && !search.loading
    if (!canSearch) {
      return
    }

    setPrevSearch(addr)
    loadStart()
    try {
      const response = await fetch(`/api/gc/address/search?address=${encodeURIComponent(addr)}`)
      const data = await response.json()

      setSearchResult({data, error: response.status !== 200})
      redirectWithCoords(data)
    } catch (error) {
      console.error('Error fetching address:', error)
    } finally {
      loadStop()
    }
  }, [prevSearch, search.text])

  const fetchNearbyFromCoordinates = useCallback(async () => {
    const isSameCoords = isSameLocation(prevSearch, search.coordinates)
    const canSearch = !isSameCoords && !search.loading
    if (!canSearch) {
      return
    }

    setPrevSearch(search.coordinates)
    loadStart()
    try {
      const {lat, lng} = search.coordinates
      const response = await fetch(`/api/gc/address/search?lat=${lat}&lng=${lng}`)
      const data = await response.json()

      setSearchResult({data, error: response.status !== 200})
      redirectWithCoords(data)
    } catch (error) {
      console.error('Error fetching address:', error)
    } finally {
      loadStop()
    }
  }, [prevSearch, search.coordinates])

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setSearch(s => ({...s, coordinates}))
      },
      (error) => {
        console.error('Error getting location:', error)
        const errorMessages = {
          1: 'Você precisa permitir o acesso à sua localização para usar este recurso.',
          2: 'Não foi possível obter sua localização. Por favor, tente novamente.',
          3: 'O tempo para obter sua localização expirou. Por favor, tente novamente.',
        }
        const message = errorMessages[error.code] || 'Ocorreu um erro ao tentar obter sua localização.'
        alert(message)
      },
    )
  }, [])

  const handleOnInputChange = (e) => setSearch((s) => ({...s, text: e.target.value}))

  const handleFormSubmit = (e) => {
    e.preventDefault()
    fetchNearbyFromAddress(search.text)
  }

  function handleSearchClear(){
    setSearch({loading: false, text: '', coordinates: undefined})
    setPrevSearch(undefined)
    setSearchResult(undefined)
    redirectRoot()
  }

  /**
   * Compares two sets of coordinates with a tolerance level to determine if they represent
   * approximately the same location.
   *
   * @param {Object} coords1 - First set of coordinates with lat and lng properties
   * @param {Object} coords2 - Second set of coordinates with lat and lng properties
   * @param {number} [tolerance=0.0001] - The maximum difference allowed (approx. 11 meters at the equator)
   * @returns {boolean} - True if coordinates are within tolerance of each other
   */
  function isSameLocation(coords1, coords2, tolerance = 0.001) {
    if (!coords1 || !coords2) return false;

    // Check if lat and lng exist in both objects
    if (!('lat' in coords1) || !('lng' in coords1) ||
      !('lat' in coords2) || !('lng' in coords2)) return false;

    // Convert to numbers to handle string values
    const lat1 = Number(coords1.lat);
    const lng1 = Number(coords1.lng);
    const lat2 = Number(coords2.lat);
    const lng2 = Number(coords2.lng);

    if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) return false;

    const latDiff = Math.abs(lat1 - lat2);
    const lngDiff = Math.abs(lng1 - lng2);

    return latDiff <= tolerance && lngDiff <= tolerance;
  }

  useEffect(() => {
    if (search.coordinates) {
      fetchNearbyFromCoordinates()
    }
  }, [search.coordinates])

  useEffect(() => {
    setLoadConf({
      loading: search.loading,
      class: search.loading ? 'animate-spin' : '',
      icon: search.loading ? 'uil-spinner-alt' : 'uil-search',
    })
  }, [search.loading])

  useEffect(() => {
    setLocatorVisibility(!!(new URL(window.location.href).searchParams.get('finder')))
  }, [])

  if(!isLocatorVisible) {
    return null
  }

  return (
    <section className="flex flex-col gap-4 items-center m-auto w-full md:w-1/2 my-8">
      <h2 className="text-4xl font-extrabold mb-4">Encontre o GC mais próximo</h2>
      <form className="flex flex-row gap-2 justify-center w-full" onSubmit={handleFormSubmit}>
        <input
          className="flex-grow px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-gray-800 placeholder-gray-400"
          type="text"
          placeholder="Digite o seu endereço"
          name="search.address"
          value={search.text}
          onChange={handleOnInputChange}
        />

        <Button type="submit" disabled={!search.text || search.loading}>
          Buscar <i className={`uil ${loadConf.icon} ${loadConf.class}`} />
        </Button>
      </form>
      {searchResult?.error && <small className="text-xs text-red-900 dark:text-red-500">{searchResult?.data.message}</small>}
      {!searchResult?.error && hasSearch && (
        <div className="flex flex-row items-center gap-2">
          <small className="text-xs">{searchResult?.data.address}</small>
          <i className="uil uil-times-circle text-2xl cursor-pointer" onClick={handleSearchClear} />
        </div>
      )}

      <h3>OU</h3>

      <Button onClick={getCurrentPosition} type="button">
        usar a minha localização atual
        {loadConf.loading && <i className={`uil ${loadConf.icon} ${loadConf.class}`} />}
      </Button>
    </section>
  )
}