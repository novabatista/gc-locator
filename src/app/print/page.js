import ContactPhoneWA from '@/components/ContactPhoneWA'
import Image from 'next/image'
import {getMapStaticConfig} from '@/map/map'
import GCLogo from '@/components/GCLogo'
import database from '@/service/database/gcs'
import {getQrUrl} from '@/service/storage/urls'

export const dynamic = 'force-dynamic'

const MAP_STATIC_CONFIG = getMapStaticConfig()

export default async function PageGCPrint({params, searchParams}) {
  const { mode } = await searchParams
  const isModeDefault = mode !== 'min'
  const pageZoom = isModeDefault ? 0.40 : 0.70
  const imageSize = isModeDefault ? 320 : 300

  const gcs = await database.all()

  return (
    <div className="font-sans w-full flex flex-row flex-wrap" style={{pageBreakAfter: 'always', zoom: pageZoom}}>
      {gcs.map((gc) => {
        const {id, name, address, contacts, schedules, links, config} = gc

        const imageAlt = `Mapa GC ${name}`
        const qrcodeImageUrl = `${getQrUrl(id)}?v=${MAP_STATIC_CONFIG.version}`
        const imageConfig = {
          alt: imageAlt,
          width: imageSize,
          height: imageSize,
          className: 'rounded-lg',
          src: qrcodeImageUrl,
        }

        return (
          <div key={id} className="font-sans w-1/2 p-6 mb-4">
            <div className="flex flex-row justify-start gap-2">
              <div className="flex flex-col justify-center w-6/12 gap-4">
                <div className="flex flex-row items-center" style={{color: config.color.primary}}>
                  <GCLogo config={config} name={name} location="single" textSize="4xl" className="mr-2" width={64} height={64} />
                </div>

                {isModeDefault && <section id="contacts" className="flex flex-col justify-between">
                  <div className="">
                    <span className="text-xl" style={{color: config.color.primary}}>Líderes</span>
                    <div className="flex flex-row gap-6">
                      {contacts.map((contact, contactIndex) => <ContactPhoneWA key={contactIndex} contact={contact} name={name} classColor="" iconVisible={false} />)}
                    </div>
                  </div>
                </section>}

                {isModeDefault && <section id="schedule">
                  <span className="text-xl mb-1" style={{color: config.color.primary}}>Reuniões</span>
                  <div className="">
                    {schedules.map((schedule, scheduleIndex) => (
                      <div className="flex flex-col" key={scheduleIndex}>
                        <span className="">{schedule.weekday} às {schedule.hour}h</span>
                      </div>
                    ))}
                  </div>
                </section>}

                <section id="address" className="flex flex-col">
                  <span className="text-xl mb-1" style={{color: config.color.primary}}>Onde acontece</span>
                  <div className="flex flex-row items-center">
                    <i className="uil uil-map-marker text-2xl mr-2" />
                    <p className="">{address.text}</p>
                  </div>
                </section>
              </div>

              <section id="qrcode" className="w-6/12">
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