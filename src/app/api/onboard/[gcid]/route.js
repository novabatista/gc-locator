import {NextResponse} from 'next/server'
import {append} from '@/service/drive/sheet/sheet'
import database from '@/service/database/gcs'

const LOCALE = 'pt-BR'
const localeConfig = {timeZone: 'America/Sao_Paulo'}

export async function POST(request, {params}) {
  const {gcid} = params
  const {name, phone, birthday, email} = await request.json()
  const today = new Date()

  const gc = database.find(gcid)

  if (!gc) {
    return NextResponse.json({message: 'GC não encontrado'}, {status: 404})
  }

  try {
    const sheetAdd = await append(gc.sheetId, 'membros!A2:E', [
      [
        today.toLocaleDateString(LOCALE, localeConfig),
        birthday,
        phone,
        email,
        name
      ]
    ])
    console.log(sheetAdd)

    return NextResponse.json({ok: true})
  }catch(ex){
    console.error(ex)
    return NextResponse.json({message: "Não foi realizar o cadastro"}, { status: 400 })
  }
}

function boolToString(value){
  return value ? 'sim' : 'não'
}