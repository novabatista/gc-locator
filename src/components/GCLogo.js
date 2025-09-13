'use client'

import Image from 'next/image'
import {useEffect, useMemo, useState} from 'react'
import CustomLogoConexaoWhite from '@/assets/logo-conexao-white.png'
import CustomLogoConexaoBlack from '@/assets/logo-conexao-black.png'
import CustomLogoConexaoOrange from '@/assets/logo-conexao-orange.png'
import CustomLogoMosaico from '@/assets/mosaico-logo-4.svg?react'

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
  const [isDarkMode, setIsDarkMode] = useState();
  const [LogoComponent, setLogoComp] = useState();
  const [isPng, setIsPng] = useState();

  const logo = config?.logo ?? {}
  const {alias, full_replace} = logo
  const textSizeClass = `text-${textSize}`

  const logoW = logo[location]?.width
  const logoH = logo[location]?.height

  const finalWidth = logoW ?? width
  const finalHeight = logoH ?? height

  const finalColor = color ?? ( applySectorColor ? config?.color?.primary : 'currentColor') ?? 'currentColor'

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = matchMedia.matches

    const CustomLogoMap = {
      'mosaico': CustomLogoMosaico,
      'conexao': (applySectorColor ? CustomLogoConexaoOrange : (isDark ? CustomLogoConexaoWhite : CustomLogoConexaoBlack)),
    }

    const comp = CustomLogoMap[alias]
    const pngCheck = !!(comp && typeof comp === 'object' && comp?.src)
    setIsPng(pngCheck)
    setLogoComp(comp)
  }, [alias, applySectorColor]);

  return (
    <>
      {LogoComponent && !isPng && <CustomLogoMosaico
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