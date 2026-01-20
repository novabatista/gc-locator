import gcs from '@/assets/gcs.json'
import GCCard from '@/components/GCCard'
import {groupGCBySectorFlat} from '@/gc/group'
import Swiper from '@/components/Swiper'
import SwiperGCs from '@/app/embed/SwipperGCs'

const validValues = ['1', 'true', 'yes', 'y', 'sim', 's']
function isTruthy(value){
  return validValues.some(validValue => value === validValue)
}
/**
 * @param {object} props
 * @param {object} props.searchParams - URL search parameters
 * @param {string} [props.searchParams.type] - list, carousel
 * @param {string} [props.searchParams.map] - display map with radius
 * @param {string} [props.searchParams.sectorcolor] - apply sector colors
 * @param {string} [props.searchParams.limit] - limit the maximum items to display
 * @returns {Promise<JSX.Element>}
 */
export default async function PageEmbed(props) {
  const {
    type='list',
    map='0',
    sectorcolor='0',
    perpage=3,
    limit=null,
  } = props.searchParams

  // const isListMode = type==='list'
  const isCarouselMode = type==='carousel'
  const minHeight = isCarouselMode && isTruthy(map) ? '320px' : '210px'

  let gcsList = groupGCBySectorFlat(gcs)
  if(Number(limit)){
    gcsList = gcsList.slice(0, limit)
  }
  
  if(isCarouselMode){
    return (
      <main className="w-full">
        <SwiperGCs gcsList={gcsList} minHeight={minHeight} displayMap={isTruthy(map)} applySectorColor={isTruthy(sectorcolor)} perPage={perpage} openTarget="_top" />
      </main>
    )
  }


  return (
    <main>
      <div className="flex flex-row flex-wrap gap-8">
        {gcsList.map((gc, index) => (
          <div className="w-[640px]" key={index}>
            <GCCard gc={gc} displayMap={isTruthy(map)} applySectorColor={isTruthy(sectorcolor)} />
          </div>
        ))}
      </div>
    </main>
  )
}
