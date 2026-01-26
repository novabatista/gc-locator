import requestEvo from '@/service/evo/request'

export async function sendMessage(phone, message) {
  const requestConfig = {
    method: 'POST',
    body: {
      number: phone,
      options:{
        delay:1200,
        presence:"composing"
      },
      textMessage:{
        text: message,
      }
    },
  }
  return requestEvo(`message/sendText`, requestConfig)
}