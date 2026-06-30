import Link from 'next/link'
import database from '@/service/database/gcs'
import {SECTORS} from '@/gc/sectors'
import {deleteGCAction} from '@/app/manager/actions'

export const dynamic = 'force-dynamic'

export default async function ManagerHomePage(){
  const gcs = await database.all()

  return (
    <main>
      <h1 className="text-2xl font-black mb-6">GCs ({gcs.length})</h1>

      <div className="flex flex-col gap-2">
        {gcs.map(gc => {
          const sector = SECTORS[gc.sector.id]
          return (
            <div key={gc.id} className="flex flex-row items-center justify-between border border-gray-200 rounded-md px-4 py-3">
              <div className="flex flex-row items-center gap-3">
                <span
                  className="inline-block w-3 h-3 rounded-full border border-gray-300"
                  style={{background: sector?.color ?? '#000'}}
                  title={sector?.name ?? gc.sector.id}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{gc.name}</span>
                  <span className="text-xs text-gray-500">{gc.id}</span>
                </div>
              </div>
              <div className="flex flex-row gap-3">
                <Link className="text-sm underline" href={`/manager/gc/${gc.id}`}>editar</Link>
                <form action={deleteGCAction.bind(null, gc.id)}>
                  <button
                    type="submit"
                    className="text-sm text-red-700 underline"
                    formNoValidate
                  >
                    excluir
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
