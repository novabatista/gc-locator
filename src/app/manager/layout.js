import Link from 'next/link'
import {logoutAction} from '@/app/manager/actions'
import {createClient} from '@/lib/supabase/server'

export const metadata = {
  title: 'Manager — GC Locator',
}

export default async function ManagerLayout({children}){
  const supabase = await createClient()
  const {data: {user}} = await supabase.auth.getUser()

  return (
    <div className="font-sans min-h-screen w-11/12 md:w-10/12 max-w-[1100px] m-auto py-8">
      {user && (
        <header className="flex flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="flex flex-row items-center gap-4">
            <Link href="/manager" className="text-2xl font-black">Manager</Link>
            <Link href="/manager/gc/new" className="text-sm underline">+ Novo GC</Link>
          </div>
          <form action={logoutAction}>
            <span className="text-sm text-gray-600 mr-3">{user.email}</span>
            <button type="submit" className="text-sm underline">sair</button>
          </form>
        </header>
      )}
      {children}
    </div>
  )
}
