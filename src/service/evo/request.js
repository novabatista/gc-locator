import {NextResponse} from 'next/server'

export default async function requestEvo(path, config) {
  const requestConfig = {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      'Content-Type': 'application/json',
      'apikey': process.env.EVO_KEY
    },
    body: config.body ? JSON.stringify(config.body) : undefined,
  }
  const response = await fetch(`${process.env.EVO_URL}/${path}/${process.env.EVO_INSTANCE}`, requestConfig)
  const data = await response.json()
  const number = config.body?.number

  const respPayload = {
    status: 200,
    sent: true,
    message: 'ok',
    number,
    data,
  }

  if(!isStatusCodeOk(response.status)){
    console.error(data)
    respPayload.sent = false
    respPayload.status = response.status
    respPayload.message = data.response?.message?.[0] ?? data.response?.message ?? 'Erro desconhecido'

    return respPayload
  }

  console.log(data)
  return respPayload
}

export function massSentParser(responses){
  const fails = responses?.filter((resp)=>!resp.sent)
  return {
    sent: fails?.length === 0,
    fails,
  }
}

function isStatusCodeOk(code) {
  console.log('code', code)
  if(typeof code === 'number'){
    return Math.floor(code / 100) === 2;
  }

  return true
}
