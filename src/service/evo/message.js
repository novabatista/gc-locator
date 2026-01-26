export async function sendMessage(phone, message) {
  const requestConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.EVO_KEY
    },
    body: JSON.stringify({
      "number": phone,
      "options":{
        "delay":1200,
        "presence":"composing"
      },
      "textMessage":{
        text: message,
      }
    }),
  }
  const response = await fetch(`${process.env.EVO_URL}/message/sendText/${process.env.EVO_INSTANCE}`, requestConfig)
  return response.json()
}