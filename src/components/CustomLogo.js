import CustomLogoMosaico from '@/assets/mosaico-logo-4.svg'

const CustomLogoMap = {
  'mosaico': CustomLogoMosaico,
}

export default function CustomLogo({logo, color, width, height}) {
  const CustomLogo = CustomLogoMap[logo]

  if(!CustomLogo) {
    return null;
  }

  return <CustomLogo
    width={width ?? 32}
    height={height ?? 32}
    stroke={color ?? '#000'}
    className="mr-1"
  />
}