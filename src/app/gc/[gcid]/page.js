import gcs from '@/assets/gcs.json'
import {notFound} from 'next/navigation'
import ContactPhoneWA from '@/components/ContactPhoneWA'
import Image from 'next/image'
import {Fragment} from 'react'
import {generateCirclePoints, getMapStaticConfig} from '@/map/distance'

const MAP_STATIC_CONFIG = getMapStaticConfig()
export default async function PageGCDetail({params}) {
  const {gcid} = await params
  const gc = gcs[gcid]

  if (!gc) {
    return notFound()
  }

  const {id, name, address, description, contacts, schedules, config, links, sector} = gc
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
    `&path=color:${MAP_STATIC_CONFIG.path.color}|fillcolor:${MAP_STATIC_CONFIG.path.fill}|weight:2|${circlePoints}`,
    `&key=${process.env.GOOGLE_MAPS_STATIC_KEY}`,
    ].join('');

  return (
    <main>
      <header style={{color: config.color.primary}}>
        <span className="text-5xl uniform-black mr-2">GC</span>
        <span className="text-3xl uniform">{name}</span>
      </header>

      <section className="my-4">
        {description.map((paragraph, paragraphIndex) => (<p key={paragraphIndex} className="mb-2">{paragraph}</p>))}
      </section>

      <section className="my-4">
        <ul className="flex flex-row justify-end">
        {links.map((link, linkIndex) => (
           <li key={linkIndex} className="mb-2">
             <a href={link.url} target={link.label} className="">
               <Image alt={link.label} src={link.icon} className="" width={32} height={32} />
             </a>
           </li>
        ))}
        </ul>
      </section>

      <section>
        <div className="flex flex-row justify-between">
          <div>
            <span className="text-xl mb-1" style={{color: config.color.primary}}>Reuniões</span>
            <div className="">
              {schedules.map(({weekday, hour}, scheduleIndex) => (
                <Fragment key={scheduleIndex}>
                  <span className="">{weekday}s</span> às <span className="">{hour}h</span>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xl" style={{color: config.color.primary}}>Líderes</span>
            {contacts.map((contact, contactIndex) => <ContactPhoneWA key={contactIndex} contact={contact} name={name} />)}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-row items-center justify-center mb-2">
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
      </section>

    </main>
  )
}