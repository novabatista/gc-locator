import {loginAction} from '@/app/manager/actions'

export default async function ManagerLoginPage({searchParams}){
  const {error, next} = await searchParams
  const errorMessage = error ? decodeURIComponent(error) : null

  return (
    <main className="max-w-md m-auto">
      <h1 className="text-2xl font-black mb-6">Entrar no Manager</h1>

      <form action={loginAction} className="flex flex-col gap-4">
        {next && <input type="hidden" name="next" value={next} />}
        <div>
          <label className="form-label">Email</label>
          <input name="email" type="email" required className="form-input" autoComplete="email" />
        </div>
        <div>
          <label className="form-label">Senha</label>
          <input name="password" type="password" required className="form-input" autoComplete="current-password" />
        </div>

        {errorMessage && <p className="text-sm text-red-700">{errorMessage}</p>}

        <button type="submit" className="bg-gray-950 text-white py-2 rounded-md">
          Entrar
        </button>
      </form>
    </main>
  )
}
