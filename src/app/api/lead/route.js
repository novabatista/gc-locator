import {NextResponse} from 'next/server'
import {sendMessage} from '@/service/evo/message'
import {massSentParser} from '@/service/evo/request'
import {append} from '@/service/drive/sheet/sheet'
import database from '@/service/database/gcs'

const LOCALE = 'pt-BR'
const localeConfig = {timeZone: 'America/Sao_Paulo'}
export async function POST(request) {
  const {responsible, guest} = await request.json()
  const gc = database.find(responsible.id)
  const leader = gc.contacts[responsible.contactIndex]
  const leadDate = new Date()

  const guestPhoneRaw = guest.phone.replace(/\D/g, '')
  const guestMessage = [
    `Olá ${guest.name}, que bom que você quer conhecer o GC ${gc.name}!`,
    '',
    `Se precisar pode entrar em contatos com os lideres do GC pelo WhatsApp:`,
  ]
  gc.contacts.forEach(contact => {
    guestMessage.push(`${contact.name} - ${contact.phone.replace(/\D/g, '')}`, ' ')
  })

  const leaderMessage = [
    `*Encaminhamento de GC*`,
    '',
    `Data: ${leadDate.toLocaleString(LOCALE, localeConfig)}`,
    `Nome: ${guest.name}`,
    `Telefone: ${guestPhoneRaw}`,
  ].join('\n')

  try {
    const guestResp = await sendMessage('55'+guestPhoneRaw, guestMessage.join('\n'))
    const leaderResp = await sendMessage('55'+leader.phone.replace(/\D/g, ''), leaderMessage)
    // const guestResp = await sendMessage('5511995278831', guestMessage.join('\n'))
    // const leaderResp = await sendMessage('5511995278831', leaderMessage)


    const sheetAdd = await append(process.env.GOOGLE_SHEET_LEAD_ID, 'leads!A2', [
      [leadDate.toLocaleDateString(LOCALE, localeConfig), guest.name, guest.phone, gc.name, leader.name, boolToString(leaderResp.sent), boolToString(guestResp.sent)]
    ])

    return NextResponse.json({
      message: massSentParser([guestResp, leaderResp]),
      sheet: {
        sent: !!!sheetAdd.error?.code,
      },
    })
  }catch(ex){
    console.error(ex)
    return NextResponse.json({message: "Não foi possível enviar a mensagem"}, { status: 400 })
  }
}

function boolToString(value){
  return value ? 'sim' : 'não'
}