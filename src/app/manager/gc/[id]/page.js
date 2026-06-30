import {notFound} from 'next/navigation'
import database from '@/service/database/gcs'
import GCForm from '@/components/manager/GCForm'
import {updateGCAction} from '@/app/manager/actions'

export const dynamic = 'force-dynamic'

export default async function ManagerEditGCPage({params}){
  const {id} = await params
  const gc = await database.find(id)

  if (!gc) return notFound()

  const bound = updateGCAction.bind(null, id)

  return (
    <main>
      <h1 className="text-2xl font-black mb-6">Editar: {gc.name}</h1>
      <GCForm action={bound} gc={gc} />
    </main>
  )
}
