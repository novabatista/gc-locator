import gcs from '@/assets/gcs.json'
import ContactPhoneWA from '@/components/ContactPhoneWA'
import Image from 'next/image'
import {getMapStaticConfig} from '@/map/map'
import GCLogo from '@/components/GCLogo'
import database from '@/service/database/gcs'

const MAP_STATIC_CONFIG = getMapStaticConfig()

export default async function PageGCPrint({params, searchParams}) {
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }


  return (
    <div className="font-sans w-full flex flex-row flex-wrap" style={{pageBreakAfter: 'always', zoom: 0.70}}>
      {database.all().map((gc) => {
        const {id, name, address, contacts, schedules, links, config} = gc
        const {lat, lng} = address.fake ?? address

        const imageAlt = `Mapa GC ${name}`
        const qrcodeImageUrl = `/qr/${id}.png?v=${MAP_STATIC_CONFIG.version}`
        const imageConfig = {
          alt: imageAlt,
          width: 320,
          height: 320,
          className: 'rounded-lg',
          src: qrcodeImageUrl,
        }

        return (
          <div key={id} className="font-sans w-1/2 p-6 mb-10">
            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col w-7/12 gap-4">
                <div className="flex flex-row items-center" style={{color: config.color.primary}}>
                  <GCLogo config={config} name={name} location="single" textSize="4xl" className="mr-2" width={64} height={64} />
                </div>

                <section className="flex flex-col justify-between">
                  <div className="">
                    <span className="text-xl" style={{color: config.color.primary}}>Líderes</span>
                    <div className="flex flex-row gap-6">
                      {contacts.map((contact, contactIndex) => <ContactPhoneWA key={contactIndex} contact={contact} name={name} iconVisible={false} />)}
                    </div>
                  </div>
                </section>

                <section>
                  <span className="text-xl mb-1" style={{color: config.color.primary}}>Reuniões</span>
                  <div className="">
                    {schedules.map((schedule, scheduleIndex) => (
                      <div className="flex flex-col" key={scheduleIndex}>
                        <span className="">{schedule.weekday} às {schedule.hour}h</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="address" className="flex flex-col">
                  <span className="text-xl mb-1" style={{color: config.color.primary}}>Onde acontece</span>
                  <div className="flex flex-row items-center">
                    <i className="uil uil-map-marker text-2xl mr-2" />
                    <p className="">{address.text}</p>
                  </div>
                </section>
              </div>

              <section id="qrcode" className="w-5/12">
                <Image
                  alt={imageConfig.alt}
                  src={imageConfig.src}
                  width={imageConfig.width}
                  height={imageConfig.height}
                  className={imageConfig.className}
                />
              </section>
            </div>
          </div>
        )})}
    </div>
  )
}