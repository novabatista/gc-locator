import GCLogo from '@/assets/logo-8.svg'

export default function GCMainHeader(props) {
  return (
    <header className="flex flex-col mb-8">
      <div className="flex flex-row items-end gap-2">
        <GCLogo stroke="currentColor" className="" width={64} height={64}/>
        <h1 className="text-5xl ">
          <span className="uniform-black">GC</span> <small className="uniform">Nova Batista</small>
        </h1>
      </div>
      <h2 className="uppercase font-black text-[2.8rem]">A igreja no <span className="text-accent">LAR</span></h2>
    </header>
  )
}