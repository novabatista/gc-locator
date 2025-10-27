import gcs from '@/assets/gcs.json'
import gcFormater, {contactsInline} from '@/gc/formater'

/**
 * @param {object} info
 * @param {string} info.title
 * @param {string} info.description
 * @param {object} info.image
 * @param {string} info.image.url
 * @param {number} info.image.width
 * @param {number} info.image.height
 * @param {string} info.image.alt
 * @returns {{title: *, description: string, openGraph: {title: *, description: string, images: [{url, width: number, height: number, alt: *}]}}}
 */
export function metadataCreator(info){
  const title = info.title ?? ""
  const description = info.description ?? ""
  const meta = {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }

  if(info.image){
    meta.openGraph.images = [
      {
        url: info.image.url,
        width: info.image.width,
        height: info.image.height,
        alt: info.image.alt ?? "",
      }
    ]
  }

  return meta
}

export async function metadataFromGC(gc){
  const title = gcFormater.title(gc)
  const description = [
    gcFormater.contactsInline(gc),
    gc.address.text,
  ].join('\n')

  return metadataCreator({
    title,
    description,
    image: {
      url: `/opengraph/opengraph-${gc.id}.png`,
      width: 1200,
      height: 600,
      alt: "",
    },
  })
}