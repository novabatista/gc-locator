import {notFound} from 'next/navigation'
import database from '@/service/database/gcs'
import OnboardForm from '@/app/onboard/[gcid]/OnboardForm'

export const dynamic = 'force-dynamic'

export default async function PageGCOnboard({params}){
  const {gcid} = await params
  const gc = await database.find(gcid)

  if (!gc) {
    return notFound()
  }

  return <OnboardForm gc={gc} />
}
