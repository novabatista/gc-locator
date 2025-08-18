import ContactPhoneWA from '@/components/ContactPhoneWA'
import Image from 'next/image'
import { uniformFont } from '@/app/fonts'

export default function GCCard(props) {
  const {id, name, address, distance, contacts, schedules, config} = props.gc
  const {lat, lng} = address

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
        {contacts.map((contact, contactIndex) => <ContactPhoneWA key={contactIndex} contact={contact} />)}
      </div>

      <a className="flex flex-row items-center text-sm cursor-pointer" href={`https://www.google.com/maps/dir//${lat},${lng}`} target={id}>
        <Image alt="" src="/icons/map-pin.svg" className="mr-2" width={24} height={24} />
        <p className="">{address.text}</p>
        <Image alt="" src="/icons/external-link.svg" className="ml-1" width={16} height={16} />
      </a>
    </div>
  )
}