'use client'

import {useState} from 'react'
import Image from 'next/image'
import Swiper from '@/components/Swiper'
import useBreakpoint from '@/hook/useBreakpoint'

const THUMB_DIMENSION = 140
export default function SwiperImage({images, perpage}) {
  const breakpoint = useBreakpoint()
  const [selectedImage, setSelectedImage] = useState(null)

  const itemsPerPage = breakpoint.matcher({'base':2, 'sm': 4, 'md':6, 'xl':8})

  const handleOpenImage = (image) => () => {
    setSelectedImage(image)
  }

  const handleCloseImage = () => setSelectedImage(null)


  if (selectedImage) {
    return (
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black opacity-90"
        />
        <div className="relative z-10 max-w-4xl max-h-screen p-4 mx-auto flex items-center justify-center h-full">
          <button
            onClick={handleCloseImage}
            className="absolute top-4 right-4 text-white bg-black rounded-full p-2 hover:bg-opacity-75 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <img
            src={selectedImage?.full}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Swiper perPage={itemsPerPage}>
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 rounded-md overflow-hidden cursor-pointer"
            onClick={handleOpenImage(image)}
          >
            <Image
              width={THUMB_DIMENSION}
              height={THUMB_DIMENSION}
              alt=""
              src={image.thumb}
              className={`h-[${THUMB_DIMENSION}px] w-[${THUMB_DIMENSION}px] object-cover hover:scale-120 transition-transform`}
              draggable={false}
            />
          </div>
        ))}
      </Swiper>
    </div>
  )
}