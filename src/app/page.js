import Image from 'next/image'
import gcs from '@/assets/gcs.json'
import GCCard from '@/components/GCCard'
import GCFinder from '@/components/GCFinder'
import calculateDistance from '@/map/distance'


export default async function Home({ searchParams }) {
  const { lat, lng } = await searchParams
  const searchCoords = {lat, lng}
  const hasSearchCoords = lat && lng

  let gcsList = Object.values(gcs)

  if (hasSearchCoords) {
    gcsList = sortByDistance()
  }else{
    gcsList = groupBySector()
  }

  function sortByDistance(){
    return gcsList.map(gc => ({
      ...gc,
      distance: calculateDistance(
        searchCoords,
        gc.address,
      )
    }))
      .sort((a, b) => a.distance - b.distance)
  }

  function groupBySector(){
    return Object.entries(gcsList.reduce((acc, gc) => {
      const sectorId = gc.sector.id
      if (!acc[sectorId]) {
        acc[sectorId] = []
      }
      acc[sectorId].push(gc)
      acc[sectorId].sort((a, b) => a.name.localeCompare(b.name))
      return acc
    }, {}))
  }

  return (
    <main className="">
      <header className="flex flex-row items-center gap-2 mb-8">
        <Image src="/logo-8.svg" alt="logo gc nova batista" width={64} height={64} />
        <h1 className="text-5xl ">
          <span className="uniform-black">GC</span> <small className="uniform">Nova Batista</small>
        </h1>
      </header>
      <section className="flex flex-col gap-4 text-base">
        <p>
          Um GC (Grupo de Crescimento) é como a igreja se encontra nas casas, exatamente como foi pensado na Bíblia. É o lugar onde você não é apenas mais um na multidão, mas alguém que vai ser cuidado, ouvido e acompanhado de perto.
        </p>
        <p>
          Nos GCs da Nova Batista, cada encontro segue o tema do culto de domingo, então dá pra aprofundar na Palavra e conversar sobre como ela se aplica na vida de cada um. É também um espaço pra compartilhar experiências, tirar dúvidas, apoiar uns aos outros e crescer junto na fé de um jeito bem real e acolhedor.
        </p>
        <p>
          GC é lugar de crescimento, amizade e cuidado, tudo isso com muito diálogo e coração aberto, e aquela comunhão que todo crente adora.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-4xl font-extrabold mb-4">Encontre o GC mais próximo de você</h2>
        <GCFinder />
      </section>

      <section className="search-result mt-8">


      {hasSearchCoords && (
        <div className="grid md:grid-cols-2 gap-8 pt-8">
          {gcsList.map((gc, index) => <GCCard key={index} gc={gc} />)}
        </div>
      )}

      {!hasSearchCoords && gcsList.map(([sectorId, gcs]) => (
        <div key={sectorId} className="grid md:grid-cols-2 gap-8 pt-8">
          {gcs.map((gc, index) => <GCCard key={index} gc={gc} />)}
        </div>
      ))}
      </section>
    </main>
  )
}
