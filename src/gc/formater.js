function contactsInline(gc){
  return gc?.contacts?.map((c) => `${c.name}: ${c.phone}`).join(' | ') ?? ''
}

function schedulesInline(gc){
  return gc?.schedules?.map((s) => `${s.weekday} às ${s.hour}h`).join(' | ') ?? ''
}

function title(gc){
  return `GC ${gc.name}`
}

const gcFormater = {
  title,
  contactsInline,
  schedulesInline,
}

export default gcFormater
