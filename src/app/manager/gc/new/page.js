import GCForm from '@/components/manager/GCForm'
import {createGCAction} from '@/app/manager/actions'

export default function ManagerNewGCPage(){
  return (
    <main>
      <h1 className="text-2xl font-black mb-6">Novo GC</h1>
      <GCForm action={createGCAction} />
    </main>
  )
}
