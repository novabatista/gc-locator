'use client'

import Image from 'next/image'
import {useState, useEffect, useCallback} from 'react'
import {useRouter} from 'next/navigation'

export default function GCFinder() {
  const router = useRouter()


  const [prevSearch, setPrevSearch] = useState()
  const [search, setSearch] = useState({loading: false, text: '', coordinates: undefined})
  const [searchResult, setSearchResult] = useState()
  const [loadConf, setLoadConf] = useState({loading: false})

  const loadStart = () => setSearch((s) => ({...s, loading: true}))
  const loadStop = () => setSearch((s) => ({...s, loading: false}))
  const redirectWithCoords = (coordinates) => {
    router.push(`/?lat=${coordinates.lat}&lng=${coordinates.lng}`, { scroll: false})
  }

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
      },
    )
  }, [])

  const handleOnInputChange = (e) => setSearch((s) => ({...s, text: e.target.value}))
  const handleFormSubmit = (e) => {
    e.preventDefault()
    fetchNearbyFromAddress(search.text)
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
      icon: '/icons/loading.svg',
      iconName: 'loading.svg',
      iconId: 'loading',
    })
  }, [search.loading])
  return (
    <section className="flex flex-col gap-4 items-center m-auto w-full md:w-1/2">
      <form className="flex flex-row gap-2 justify-center w-full" onSubmit={handleFormSubmit}>
        <input
          className="flex-grow px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-gray-800 placeholder-gray-400"
          type="text"
          placeholder="Digite o seu endereço"
          name="search.address"
          value={search.text}
          onChange={handleOnInputChange}
        />

        <button
          type="submit"
          disabled={!search.text || search.loading}
          className="flex flex-row gap-1 px-4 py-2 text-white bg-gray-800 border-gray-900 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          Buscar <Image alt="buscar" src={`/icons/${loadConf.loading ? loadConf.iconId : 'search'}.svg`} width={18} height={18} className={`invert ${loadConf.class}`} />
        </button>

      </form>
      {searchResult?.error && <small className="text-xs text-red-900">{searchResult?.data.message}</small>}
      {!searchResult?.error && <small className="text-xs">{searchResult?.data.address}</small>}

      <h3>OU</h3>

      <button
        onClick={getCurrentPosition}
        type="button"
        className="flex flex-row items-center gap-1 px-4 py-2 text-white bg-gray-800 border-gray-900 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 transition-colors cursor-pointer"
      >
        usar a minha localização atual

        {loadConf.loading && <Image alt="icone busca por localizacao" src={loadConf.icon} width={18} height={18} className={`invert ${loadConf.class}`} />}
      </button>
    </section>
  )
}