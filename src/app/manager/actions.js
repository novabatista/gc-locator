'use server'

import {revalidatePath, revalidateTag} from 'next/cache'
import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import {createAdminClient} from '@/lib/supabase/admin'
import {weekdayByIndex} from '@/gc/weekdays'
import {buildLinksFromUrls} from '@/gc/links'
import {CACHE_TAG, tagFor} from '@/service/database/gcs'

function publicRevalidate(gcId){
  revalidateTag(CACHE_TAG)
  if (gcId) revalidateTag(tagFor(gcId))
  revalidatePath('/')
  revalidatePath('/print')
  revalidatePath('/embed')
  revalidatePath(`/gc/${gcId}`)
}

function parsePayload(formData){
  const raw = formData.get('payload')
  if (!raw) throw new Error('Form payload missing')
  return JSON.parse(raw)
}

function buildRowFromPayload(payload, existingData = {}){
  const weekday = weekdayByIndex(payload.schedule_day_index)
  const contacts = (payload.contacts ?? [])
    .map(c => ({name: (c.name ?? '').trim(), phone: (c.phone ?? '').trim()}))
    .filter(c => c.name || c.phone)

  const schedules = [{
    day_index: weekday.day_index,
    weekday: weekday.weekday,
    hour: (payload.schedule_hour ?? '').trim() || '20:00',
  }]

  const links = buildLinksFromUrls(payload.links ?? {})

  // Preserve fields not editable in the form
  const data = {
    ...existingData,
    config: existingData.config ?? {},
    address: {
      ...(existingData.address ?? {street_number: null, complement: '', lat: null, lng: null, fake: null}),
    },
    contacts,
    schedules,
    links,
    description: payload.description ?? '',
    images: existingData.images ?? [],
  }

  return {
    id: (payload.id ?? '').trim(),
    name: (payload.name ?? '').trim(),
    sector_id: payload.sector_id,
    sheet_id: (payload.sheetId ?? '').trim() || null,
    address_text: (payload.address_text ?? '').trim() || null,
    data,
  }
}

export async function loginAction(formData){
  const email = formData.get('email')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const next = formData.get('next')?.toString() || '/manager'

  const supabase = await createClient()
  const {error} = await supabase.auth.signInWithPassword({email, password})

  if (error) {
    const msg = encodeURIComponent(error.message)
    redirect(`/manager/login?error=${msg}${next ? `&next=${encodeURIComponent(next)}` : ''}`)
  }

  redirect(next)
}

export async function logoutAction(){
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/manager/login')
}

async function requireAdmin(){
  const supabase = await createClient()
  const {data: {user}} = await supabase.auth.getUser()
  if (!user) redirect('/manager/login')
  return user
}

export async function createGCAction(formData){
  await requireAdmin()
  const payload = parsePayload(formData)
  const row = buildRowFromPayload(payload)

  if (!row.id || !row.name || !row.sector_id) {
    throw new Error('id, nome e sector são obrigatórios')
  }

  const supabase = createAdminClient()
  const {error} = await supabase.from('gcs').insert(row)
  if (error) throw new Error(`Erro ao criar GC: ${error.message}`)

  publicRevalidate(row.id)
  redirect(`/manager/gc/${row.id}`)
}

export async function updateGCAction(id, formData){
  await requireAdmin()
  const payload = parsePayload(formData)
  payload.id = id

  const supabase = createAdminClient()
  const {data: existing, error: fetchErr} = await supabase.from('gcs').select('data').eq('id', id).maybeSingle()
  if (fetchErr) throw new Error(`Erro ao buscar GC: ${fetchErr.message}`)

  const row = buildRowFromPayload(payload, existing?.data ?? {})

  const {id: _, ...updatable} = row
  const {error} = await supabase.from('gcs').update(updatable).eq('id', id)
  if (error) throw new Error(`Erro ao salvar GC: ${error.message}`)

  publicRevalidate(id)
  redirect(`/manager/gc/${id}`)
}

export async function deleteGCAction(id){
  await requireAdmin()

  const supabase = createAdminClient()
  const {error} = await supabase.from('gcs').delete().eq('id', id)
  if (error) throw new Error(`Erro ao excluir GC: ${error.message}`)

  publicRevalidate(id)
  redirect('/manager')
}
