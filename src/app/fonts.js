import localFont from 'next/font/local'

export const uniformFont = localFont({
  src: [
    {
      path: '../../public/fonts/uniform/Uniform.otf',
      weight: '400',
      style: 'normal',
    },
    // Add additional weights if needed
  ],
  variable: '--font-uniform',
})

export const uniformFontBlack = localFont({
  src: [
    {
      path: '../../public/fonts/uniform/UniformBlack.otf',
      weight: '400',
      style: 'normal',
    },
    // Add additional weights if needed
  ],
  variable: '--font-uniform-black',
})
