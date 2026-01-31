import {notFound} from 'next/navigation'
import ContactPhoneWA from '@/components/ContactPhoneWA'
import Image from 'next/image'
import {getMapStaticConfig} from '@/map/map'
import GCLogo from '@/components/GCLogo'
import SwiperImage from '@/components/SwiperImage'
import AddToCalendarOptions from '@/app/gc/[gcid]/AddToCalendarOptions'
import {metadataFromGC} from '@/opengraph/metadata-creator'
import database from '@/service/database/gcs'

const MAP_STATIC_CONFIG = getMapStaticConfig()

export async function generateMetadata({params}){
  const {gcid} = await params
  const gc = database.find(gcid)

  return metadataFromGC(gc)
}

export default async function PageGCDetail({params}) {
  const {gcid} = await params


  if (!database.exists(gcid)) {
    return notFound()
  }

  const gc = database.find(gcid)
  const {id, name, address, description, contacts, schedules, links, config} = gc
  const {lat, lng} = address.fake ?? address

  const mapImageAlt = `Mapa GC ${name}`
  const mapNavigationUrl = `https://www.google.com/maps/dir//${lat},${lng}`
  const mapImageUrl = `/maps/map-${id}-full.png?v=${MAP_STATIC_CONFIG.version}`

  const images = gc.images.map(image => {
    if(image?.full){
      return {
        full: image.full,
        thumb: image?.thumb ?? image.full,
      }
    }

    if(image.startsWith('http')) {
      return {
        full: image,
        thumb: image,
      }
    }

    return {
      full: `/internal/mosaico1/full/${image}`,
      thumb: `/internal/mosaico1/thumb/${image}`,
    }
  })

  return (
    <main className="font-sans min-h-screen w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-8/12 max-w-[1200px] m-auto py-8 sm:py-12">
      <header className="flex flex-row items-center" style={{color: config.color.primary}}>
        <span className="text-5xl uniform-black mr-2">GC</span>
        <GCLogo config={config} name={name} location="single" textSize="4xl" className="mr-2" width={64} height={64} />
      </header>

      <section id="description" className="mb-8">
        {description.map((paragraph, paragraphIndex) => (<p key={paragraphIndex} className="mb-4">{paragraph}</p>))}
      </section>

      <section className="flex flex-row justify-between mb-8">
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
                <AddToCalendarOptions gc={gc} schedule={schedule} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {images.length>0 && (
        <section id="gallery" className="mb-8">
          <SwiperImage images={images} />
        </section>
      )}

      <section id="address" className="mb-8">
        <div className="mt-4">
          <a className="flex flex-row items-center justify-center mb-2" href={mapNavigationUrl} target={id}>
            <i className="uil uil-map-marker text-2xl mr-2" />
            <p className="">{address.text}</p>
            <i className="uil uil-external-link-alt ml-1" />
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

      <footer className="mb-8 mt-12 border-t pt-6">
        <div className="flex flex-row justify-between items-center">
          <div className="text-sm">
            GC {name} - {address.text}
          </div>

          {links.length > 0 && (
            <div className="flex flex-row gap-3">
              {links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.url}
                  target={link.label}
                  className=""
                  aria-label={link.label}
                >
                  <i className={`${link.icon} text-3xl`} />
                </a>
              ))}
            </div>
          )}
        </div>
      </footer>
    </main>
  )
}