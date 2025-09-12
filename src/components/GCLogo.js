import Image from 'next/image'
import CustomLogoMosaico from '@/assets/mosaico-logo-4.svg'
import CustomLogoConexaoOrange from '@/assets/logo-conexao-orange.png'
import CustomLogoConexaoBlack from '@/assets/logo-conexao.png'


export default function GCLogo({
  config,
  name,
  color,
  textSize='md',
  location='card',
  width=32,
  height=32,
  applySectorColor=true,
}) {
  const CustomLogoMap = {
    'mosaico': CustomLogoMosaico,
    'conexao': applySectorColor ? CustomLogoConexaoOrange : CustomLogoConexaoBlack,
  }

  const logo = config?.logo ?? {}
  const {alias, full_replace} = logo
  const LogoComponent = CustomLogoMap[alias]
  const isPng = LogoComponent && typeof LogoComponent === 'object' && LogoComponent.src

  const textSizeClass = `text-${textSize}`

  const logoW = logo[location]?.width
  const logoH = logo[location]?.height

  const finalWidth = logoW ?? width
  const finalHeight = logoH ?? height

  const finalColor = color ?? ( applySectorColor ? config?.color?.primary : '#000') ?? '#000'

  return (
    <>
      {LogoComponent && !isPng && <LogoComponent
        width={finalWidth}
        height={finalHeight}
        stroke={finalColor}
        className="mr-1"
      />}
      {LogoComponent && isPng && <Image
        src={LogoComponent}
        alt={name}
        title={`GC ${name}`}
        width={finalWidth}
        height={finalHeight}
        className="mr-1"
      />}

      {(!full_replace && name) && <span className={`${textSizeClass} uniform`}>{name}</span>}
    </>
  )
}