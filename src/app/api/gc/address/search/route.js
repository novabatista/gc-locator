import {NextResponse} from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const addr = searchParams.get('address')
  const coords = {
    lat: searchParams.get('lat'),
    lng: searchParams.get('lng')
  }

  if(!addr && !coords.lat && !coords.lng){
    return NextResponse.json({message: "Nenhum parametro de busca foi informado"}, { status: 400 })
  }

  try {
    const geocode = await fetchGeocode(addr, coords)
    return NextResponse.json(geocode)
  }catch(ex){
    console.error(ex)
    return NextResponse.json({message: "Não foi possível realizar a busca pelo seu endereço"}, { status: 400 })
  }
}

/**
 * Fetches geographic coordinates (latitude and longitude) and formatted address from a given address using Google Maps API.
 *
 * @param {string} address A non-empty string representing the address to fetch geographic coordinates for.
 * @return {Promise<{lat: number, lng:number, address: string}>} A promise that resolves to an object containing latitude, longitude, and formatted address.
 * @throws {Error} Throws an error if the address is invalid, the fetch request fails, or the API returns an error.
 */
async function fetchGeocode(address, coords={}) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const {lat, lng} = coords
  let searchParams

  if(address) {
    searchParams = `address=${encodeURIComponent(address)}`
  }else if(lat && lng){
    searchParams = `latlng=${lat},${lng}`
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&${searchParams}`
  let error

  const response = await fetch(url)
  const data = await response.json()

  console.log(data)
  console.log(address, coords)
  if (data.status === 'OK' && data.results && data.results[0]) {
    const selectedAddr = data.results[0]
    const {lat, lng} = selectedAddr.geometry.location
    return {lat: lat, lng: lng, address: selectedAddr.formatted_address}
  }else{
    error = `[${data.status}] - ${data.error_message}`
  }

  if(error){
    throw new Error(error)
  }
}
