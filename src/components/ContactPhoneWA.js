import Image from 'next/image'

export default function ContactPhoneWA(props) {
  const gcName = props.name ?? ''
  const {name, phone} = props.contact

  const waphone = '55'+phone.replace(/\D/g, '')
  const watext = encodeURIComponent('Olá, gostaria de conhecer o GC '+gcName)
  const waUrl = `https://wa.me/${waphone}?text=${watext}`

  return (
    <a className="flex flex-row items-center cursor-pointer" href={waUrl}>
      <span className="flex flex-col lg:flex-row flex-1 mr-2">
        <span className="font-semibold">{name}:</span> <span className="">{phone}</span>
      </span>
      <i className="uil uil-external-link-alt" />
    </a>
  )
}