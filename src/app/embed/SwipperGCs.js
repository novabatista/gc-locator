'use client'

import Swiper from '@/components/Swiper'
import GCCard from '@/components/GCCard'

export default function SwiperGCs({gcsList, minHeight, displayMap, applySectorColor, perPage, openTarget}) {

  return (
    <Swiper perPage={perPage}>
      {gcsList.map((gc, index) => (
        <div className="flex-none h-full" style={{minHeight}} key={index}>
          <GCCard gc={gc} displayMap={displayMap} applySectorColor={applySectorColor} className="h-full" openTarget={openTarget}/>
        </div>
      ))}
    </Swiper>
  )
}