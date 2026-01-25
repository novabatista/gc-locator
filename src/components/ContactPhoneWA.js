export default function ContactPhoneWA(props) {
  const openTarget = props.openTarget ?? '_blank'
  const gcName = props.name ?? ''
  const iconVisible = props.iconVisible ?? true
  const {name, phone} = props.contact

  const waphone = '55'+phone.replace(/\D/g, '')
  const watext = encodeURIComponent('Olá, gostaria de conhecer o GC '+gcName)
  const waUrl = `https://wa.me/${waphone}?text=${watext}`

  return (
    <a className="flex flex-row items-center cursor-pointer" href={waUrl} target={openTarget}>
      <span className="flex flex-col lg:flex-row flex-1 mr-2">
        <span className="font-semibold">{name}:</span> <span className="">{phone}</span>
      </span>
      {iconVisible && <i className="uil uil-external-link-alt" />}
    </a>
  )
}