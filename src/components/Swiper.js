'use client'

import {useState} from 'react'
import Image from 'next/image'

export default function Swiper({images}) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleOpenImage = (image) => () => {
    if (!isScrolling) {
      setSelectedImage(image)
    }
  }

  const handleCloseImage = () => setSelectedImage(null)

  const handleMouseDown = (e) => {
    setIsScrolling(false)
    setStartX(e.pageX - e.currentTarget.offsetLeft)
    setScrollLeft(e.currentTarget.scrollLeft)
    e.currentTarget.style.cursor = 'grabbing'
  }

  const handleMouseLeave = (e) => {
    setIsScrolling(false)
    e.currentTarget.style.cursor = 'grab'
  }

  const handleMouseUp = (e) => {
    setIsScrolling(false)
    e.currentTarget.style.cursor = 'grab'
  }

  const handleMouseMove = (e) => {
    if (e.currentTarget.style.cursor !== 'grabbing') return
    e.preventDefault()
    setIsScrolling(true)
    const x = e.pageX - e.currentTarget.offsetLeft
    const walk = (x - startX) * 2
    e.currentTarget.scrollLeft = scrollLeft - walk
  }

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
            src={selectedImage}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        className="flex overflow-x-auto gap-2 cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            onClick={handleOpenImage(image)}
          >
            <Image
              width={40}
              height={40}
              alt=""
              src={image}
              className="h-40 w-40 object-cover rounded-md"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}