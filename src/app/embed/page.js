import gcs from '@/assets/gcs.json'
import GCCard from '@/components/GCCard'
import {groupGCBySectorFlat} from '@/gc/group'

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
 * @returns {Promise<JSX.Element>}
 */
export default async function PageEmbed(props) {
  const {
    type='list',
    map='0',
    sectorcolor='0',
  } = props.searchParams

  // const isListMode = type==='list'
  const isCarouselMode = type==='carousel'

  const gcsList = groupGCBySectorFlat(gcs)
  if(isCarouselMode){
    return (
      <main>
        <div className="flex flex-row gap-8 overflow-auto">
          {gcsList.map((gc, index) => (
            <div className="flex-none w-[375px] sm:w-auto sm:max-w-[640px]" key={index}>
              <GCCard gc={gc} displayMap={isTruthy(map)} applySectorColor={isTruthy(sectorcolor)}/>
            </div>
          ))}
        </div>
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