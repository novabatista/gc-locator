"use client"

import Image from 'next/image'

export default function ContactPhoneWA(props) {
  const {name, phone} = props.contact

  const handleOpenWhatsapp = (phone)=> ()=>{
    const url = `https://wa.me/55${phone.replace(/\D/g, '')}?text=Olá, gostaria de conhecer o GC`
    window.open(url, 'nb-whatsapp')
  }

  return (
    <div className="flex flex-row items-center underline cursor-pointer" onClick={handleOpenWhatsapp(phone)}>
      <span>
        <span className="font-semibold">{name}:</span> <span className="">{phone}</span>
      </span>
      <Image alt="" src="/icons/external-link.svg" className="ml-1" width={16} height={16} />
    </div>
  )
}