import gcs from '@/assets/gcs.json'
import GCCard from '@/components/GCCard'
import GCFinder from '@/components/GCFinder'
import {groupGCBySectorFlat} from '@/gc/group'
import {sortGcsByDistanceWithRadius} from '@/gc/sort-by-distance'
import GCHeader from '@/components/GCHeader'

const MAX_SEARCH_RADIUS_KM = 4
export default async function Home({ searchParams }) {
  const { lat, lng } = await searchParams
  const searchCoords = {lat, lng}
  const hasSearchCoords = lat && lng

  let gcsList = []

  if (hasSearchCoords) {
    gcsList = sortGcsByDistanceWithRadius(searchCoords, MAX_SEARCH_RADIUS_KM, gcs)
  }else{
    gcsList = groupGCBySectorFlat(gcs)
  }

  return (
    <main className="font-sans min-h-screen w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-8/12 max-w-[1200px] m-auto py-8 sm:py-12">
      <GCHeader gc={gc} />
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

      <GCFinder />

      <section className="search-result">
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {gcsList.map((gc, index) => <GCCard key={index} gc={gc} applySectorColor={false} />)}
        </div>
      </section>
    </main>
  )
}
