import gcs from '@/assets/gcs.json'
import {notFound} from 'next/navigation'

export default async function PageGCDetail({params}) {
  const {gcid} = await params
  const gc = gcs[gcid]

  if (!gc) {
    return notFound()
  }

  return (
    <>
      <h1>{gc.name}</h1>
    </>
  )
}