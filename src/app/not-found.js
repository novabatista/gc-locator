import Link from 'next/link'

export default function NotFound(){
  return (
    <main className="font-sans min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-3xl font-black">Página não encontrada</h1>
      <p className="text-gray-600">A página que você procura não existe.</p>
      <Link href="/" className="underline">Voltar para o início</Link>
    </main>
  )
}
