import gcs from '@/assets/gcs.json'
import {notFound} from 'next/navigation'
import ContactPhoneWA from '@/components/ContactPhoneWA'
import Image from 'next/image'
import {Fragment} from 'react'

const MAP_STATIC_CONFIG = {
  width: 1200,
  height: 280,
  zoom: 16,
}
export default async function PageGCDetail({params}) {
  const {gcid} = await params
  const gc = gcs[gcid]

  if (!gc) {
    return notFound()
  }

  const {id, name, address, description, contacts, schedules, config, links} = gc
  const {lat, lng} = address

  const mapImageAlt = `Mapa GC ${name}`
  const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${MAP_STATIC_CONFIG.zoom}&size=${MAP_STATIC_CONFIG.width}x${MAP_STATIC_CONFIG.height}&markers=color:red%7C${lat},${lng}&key=${process.env.GOOGLE_MAPS_STATIC_KEY}`
  const mapNavigationUrl = `https://www.google.com/maps/dir//${lat},${lng}`

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
            {contacts.map((contact, contactIndex) => <ContactPhoneWA key={contactIndex} contact={contact} />)}
          </div>
        </div>

        <div className="mt-4">
          <a className="flex flex-row items-center justify-center mb-2" href={mapNavigationUrl} target={id}>
            <Image alt="" src="/icons/map-pin.svg" className="mr-2" width={24} height={24} />
            <p className="">{address.text}</p>
            <Image alt="" src="/icons/external-link.svg" className="ml-1" width={16} height={16} />
          </a>
          <a className="" href={mapNavigationUrl} target={id}>
            <Image
              alt={mapImageAlt}
              src={mapImageUrl}
              width={MAP_STATIC_CONFIG.width}
              height={MAP_STATIC_CONFIG.height}
              className="rounded-lg"
            />
          </a>
        </div>
      </section>

    </main>
  )
}