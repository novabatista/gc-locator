import {NextResponse} from 'next/server'
import gcs from '@/assets/gcs.json'
import {sendMessage} from '@/service/evo/message'
import {massSentParser} from '@/service/evo/request'

export async function POST(request) {
  const {responsible, guest} = await request.json()
  const gc = gcs[responsible.id]
  const leader = gc.contacts[responsible.contactIndex]

  const guestPhoneRaw = '55'+guest.phone.replace(/\D/g, '')
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
    `Data: ${new Date().toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'})}`,
    `Nome: ${guest.name}`,
    `Telefone: ${guestPhoneRaw}`,
  ].join('\n')

  try {
    const guestResp = await sendMessage(guestPhoneRaw, guestMessage.join('\n'))
    const leaderResp = await sendMessage('55'+leader.phone.replace(/\D/g, ''), leaderMessage)
    // const guestResp = await sendMessage('5511995278831', guestMessage.join('\n'))
    // const leaderResp = await sendMessage('5511995278831', leaderMessage)

    return NextResponse.json(massSentParser([guestResp, leaderResp]))
  }catch(ex){
    console.error(ex)
    return NextResponse.json({message: "Não foi possível enviar a mensagem"}, { status: 400 })
  }
}
