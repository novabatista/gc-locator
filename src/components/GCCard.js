import ContactPhoneWA from '@/components/ContactPhoneWA'
import Image from 'next/image'
import { uniformFont } from '@/app/fonts'
import {generateCirclePoints, getMapStaticConfig} from '@/map/distance'

const MAP_STATIC_CONFIG = getMapStaticConfig({width: 640, height: 180})

export default function GCCard(props) {
  const {id, name, address, distance, contacts, schedules, config, sector} = props.gc
  const {lat, lng} = address
  const radiusInMeters = 200;
  const circlePoints = generateCirclePoints(lat, lng, radiusInMeters);

  const mapImageAlt = `Mapa GC ${name}`
  const mapNavigationUrl = `https://www.google.com/maps/dir//${lat},${lng}`

  const mapImageUrl = [
    'https://maps.googleapis.com/maps/api/staticmap',
    `?center=${lat},${lng}`,
    `&zoom=${MAP_STATIC_CONFIG.zoom}`,
    `&size=${MAP_STATIC_CONFIG.width}x${MAP_STATIC_CONFIG.height}`,
    // `&markers=color:${sector.id}%7C${lat},${lng}`,
    `&path=color:${MAP_STATIC_CONFIG.path.color}|fillcolor:${MAP_STATIC_CONFIG.path.fill}|weight:${MAP_STATIC_CONFIG.path.weight}|${circlePoints}`,
    `&key=${process.env.GOOGLE_MAPS_STATIC_KEY}`,
  ].join('');

  function formatDistance(distance){
    const unit = distance > 1 ? 'km' : 'm'
    return `${distance} ${unit}`
  }

  return (
    <div key={id} className="rounded-xl p-5 border" style={{borderColor: config.color.primary}}>
      <div className="flex flex-row justify-between">
        <div style={{color: config.color.primary}}>
          <span className="text-4xl uniform-black">GC</span><br/>
          <span className="text-md uniform">{name}</span>
        </div>
        <div className="text-sm text-right self-end" style={{color: config.color.primary}}>
          {distance && <div className="mb-2">{formatDistance(distance)}</div>}

          {schedules.map(({weekday, hour}, scheduleIndex) => (
            <div key={scheduleIndex}>
              <span className="">{weekday}</span>
              <br/>
              <span className="">{hour}h</span>
            </div>
          ))}
        </div>

      </div>

      <div className="flex flex-row justify-between text-sm my-4">
        {contacts.map((contact, contactIndex) => <ContactPhoneWA key={contactIndex} contact={contact} name={name} />)}
      </div>

      <div>
        <div className="flex flex-row items-center text-sm mb-2">
          <Image alt="" src="/icons/map-pin.svg" className="mr-2" width={24} height={24} />
          <p className="">{address.text}</p>
        </div>
        <Image
          alt={mapImageAlt}
          src={mapImageUrl}
          width={MAP_STATIC_CONFIG.width}
          height={MAP_STATIC_CONFIG.height}
          className="rounded-lg"
        />
      </div>
    </div>
  )
}