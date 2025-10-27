function contactsInline(gc){
  return gc?.contacts?.map((c) => `${c.name}: ${c.phone}`).join(' | ') ?? ''
}

function title(gc){
  return `GC ${gc.name}`
}

const gcFormater = {
  title,
  contactsInline,
}

export default gcFormater
