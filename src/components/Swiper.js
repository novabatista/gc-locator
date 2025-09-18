'use client'

import {useState, useRef, useEffect} from 'react'
import GCCard from '@/components/GCCard'

const GAP = 8
export default function Swiper({
                                 controls = true,
                                 perPage = 10,
                                 children,
                               }) {
  const containerRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemWidth, setItemWidth] = useState(0)

  const itemsSize = children.length
  const totalPages = Math.ceil( itemsSize/ perPage)

  const isControlsVisible = controls && itemsSize > perPage


  const handlePrevItem = () => {
    const newPage = currentPage - 1 < 0 ? totalPages - 1 : currentPage - 1
    setCurrentPage(newPage)
  }

  const handleNextItem = () => {
    const newPage = (currentPage + 1) % totalPages
    setCurrentPage(newPage)
  }

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const containerWidth = containerRef.current.clientWidth
    const totalGaps = perPage - 1
    const availableWidth = containerWidth - (totalGaps * GAP)
    setItemWidth(Math.floor(availableWidth / perPage))
  }, [perPage])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const offset = currentPage * (itemWidth + GAP) * perPage

    containerRef.current.scrollTo({
      left: offset,
      behavior: 'smooth',
    })
  }, [currentPage, perPage, itemWidth])


  return (
    <div className="relative flex flex-row justify-center items-center">
      {isControlsVisible && <i className="uil uil-angle-left-b text-5xl cursor-pointer" onClick={handlePrevItem}/>}
      <div
        ref={containerRef}
        className={`swiper-container w-full flex overflow-x-auto gap-2`}
      >
        {children.map((child, index) => (
          <div key={index} style={{width: itemWidth, flexShrink: 0}}>
            {child}
          </div>
        ))}
      </div>
      {isControlsVisible && <i className="uil uil-angle-right-b text-5xl cursor-pointer" onClick={handleNextItem}/>}
    </div>
  )
}