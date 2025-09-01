import gcs from '@/assets/gcs.json'
import {notFound} from 'next/navigation'
import ContactPhoneWA from '@/components/ContactPhoneWA'
import Image from 'next/image'
import {Fragment} from 'react'
import {getMapStaticConfig} from '@/map/map'
import GCLogo from '@/components/GCLogo'
import Button from '@/components/ui/Button'
import googleCalendarLink from '@/calendar/calendar'
import Swiper from '@/components/Swiper'

const MAP_STATIC_CONFIG = getMapStaticConfig()

export default async function PageGCDetail({params}) {
  const {gcid} = await params
  const gc = gcs[gcid]

  if (!gc) {
    return notFound()
  }

  const {id, name, address, description, contacts, schedules, images, links, config} = gc
  const {lat, lng} = address.fake ?? address

  const mapImageAlt = `Mapa GC ${name}`
  const mapNavigationUrl = `https://www.google.com/maps/dir//${lat},${lng}`
  const mapImageUrl = `/maps/map-${id}-full.png?v=${MAP_STATIC_CONFIG.version}`


  return (
    <main>
      <header className="flex flex-row items-center" style={{color: config.color.primary}}>
        <span className="text-5xl uniform-black mr-2">GC</span>
        <GCLogo config={config} name={name} location="single" textSize="3xl" className="mr-2" width={64} height={64} />
      </header>

      <section className="mb-8">
        {description.map((paragraph, paragraphIndex) => (<p key={paragraphIndex} className="mb-2">{paragraph}</p>))}
      </section>

      {links.length > 0 && (
        <section className="mb-8">
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
      )}

      <section className="mb-8">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xl" style={{color: config.color.primary}}>Líderes</span>
            {contacts.map((contact, contactIndex) => <ContactPhoneWA key={contactIndex} contact={contact} name={name} />)}
          </div>

          <div>
            <span className="text-xl mb-1" style={{color: config.color.primary}}>Reuniões</span>
            <div className="">
              {schedules.map((schedule, scheduleIndex) => (
                <div className="flex flex-col" key={scheduleIndex}>
                  <span className="mb-2">{schedule.weekday} às {schedule.hour}h</span>
                  <Button label="adicionar na agenda" asLink href={googleCalendarLink(gc, schedule)} target="_blank" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {images.length>0 && (<section className="mb-8">
        <Swiper images={images} />
      </section>)}

      <section className="mb-8">
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