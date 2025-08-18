import Image from 'next/image'

export default function ContactPhoneWA(props) {
  const {name, phone} = props.contact

  return (
    <a className="flex flex-row items-center cursor-pointer" href={`https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent('Olá, gostaria de conhecer o GC')}`}>
      <span>
        <span className="font-semibold">{name}:</span> <span className="">{phone}</span>
      </span>
      <Image alt="" src="/icons/external-link.svg" className="ml-1" width={16} height={16} />
    </a>
  )
}