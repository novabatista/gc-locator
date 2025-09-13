import ContactPhoneWA from '@/components/ContactPhoneWA'
import Image from 'next/image'
import {getMapStaticConfig} from '@/map/map'
import GCLogo from '@/components/GCLogo'

const MAP_STATIC_CONFIG = getMapStaticConfig({width: 640, height: 180})

export default function GCCard(props) {
  const {
    applySectorColor=true,
    displayMap=true,
  } = props

  const {id, name, address, distance, contacts, schedules, config, sector} = props.gc
  const {lat, lng} = address.fake ?? address

  const mapImageAlt = `Mapa GC ${name}`
  const mapNavigationUrl = `https://www.google.com/maps/dir//${lat},${lng}`
  const mapImageUrl = `/maps/map-${id}-min.png?v=${MAP_STATIC_CONFIG.version}`
  const internalUrl = `/gc/${id}`

  const color = applySectorColor ? config.color.primary : ''

  function formatDistance(distance){
    const unit = distance > 1 ? 'km' : 'm'
    return `${distance} ${unit}`
  }

  return (
    <div key={id} className="rounded-xl p-5 border" style={{borderColor: color}}>
      <div className="flex flex-row justify-between">
        <div style={{color}}>
          <span className="text-4xl uniform-black">GC</span><br/>
          <div className="text-md uniform flex flex-row items-center">
            <GCLogo config={config} name={name} applySectorColor={applySectorColor} />
          </div>
        </div>
        <div className="text-sm text-right self-end" style={{color}}>
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
        <a className="flex flex-row items-center text-sm mb-2" href={internalUrl}>
          <i className="uil uil-map-marker text-2xl mr-2" />
          <p className="">{address.text}</p>
          <i className="uil uil-external-link-alt ml-1" />
        </a>
        {displayMap && <a href={internalUrl}>
          <Image
            alt={mapImageAlt}
            src={mapImageUrl}
            width={MAP_STATIC_CONFIG.width}
            height={MAP_STATIC_CONFIG.height}
            className="rounded-lg"
          />
        </a>}
      </div>
    </div>
  )
}