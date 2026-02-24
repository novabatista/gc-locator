'use client'

import {notFound} from 'next/navigation'
import database from '@/service/database/gcs'
import GCHeader from '@/components/GCHeader'
import Button from '@/components/ui/Button'
import {phoneMaskChange, phoneMaskKeyPress} from '@/mask/phonemask'
import {birthdayMaskChange, birthdayMaskKeyPress} from '@/mask/datemask'
import {useEffect, useState} from 'react'

export default function PageGCOnboard({params}){
  const [isLoading, setLoading] = useState(false)
  const [gcid, setGcid] = useState(null)
  const [gc, setGc] = useState(null)

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params
      const id = resolvedParams.gcid

      if (!database.exists(id)) {
        notFound()
        return
      }

      setGcid(id)
      setGc(database.find(id))
    }

    loadParams()
  }, [params])

  if (!gc) {
    return null
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const form = e.target
    const nameEl = form.querySelector('input[name="name"]')
    const phoneEl = form.querySelector('input[name="phone"]')
    const birthdayEl = form.querySelector('input[name="birthday"]')
    const emailEl = form.querySelector('input[name="email"]')

    const name = nameEl.value
    const phone = phoneEl.value
    const birthday = birthdayEl.value
    const email = emailEl.value

    if (!name) {
      alert('Por favor preencha o nome')
      return
    }

    if (!phone) {
      alert('Por favor preencha o telefone')
      return
    }

    if (!birthday) {
      alert('Por favor preencha o anivesário')
      return
    }

    if (!email) {
      alert('Por favor preencha o email')
      return
    }

    setLoading(true)
    fetch(`/api/onboard/${gcid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        phone,
        birthday,
        email,
        gcid,
      }),
    })
      .then((r)=>r.json())
      .then((resp)=>{

        form.reset()
        alert('Dados enviados com sucesso')
      }).finally(setLoading)
  }

  return (
    <main className="font-sans min-h-screen w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-8/12 max-w-[1200px] m-auto py-8 sm:py-12">
      <GCHeader gc={gc} />
      <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            name="name"
            id="name"
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (preferência por gmail)</label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Aniversário</label>
          <input
            type="text"
            name="birthday"
            className="form-input"
            placeholder="DD/MM"
            onKeyPress={birthdayMaskKeyPress}
            onChange={birthdayMaskChange}
            maxLength="5"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone (whatsapp)</label>
          <input
            type="text"
            name="phone"
            className="form-input"
            placeholder="(00) 00000-0000"
            onKeyPress={phoneMaskKeyPress}
            onChange={phoneMaskChange}
            maxLength="15"
          />
        </div>
        <div>
          <Button type="submit" disabled={isLoading} icon={isLoading ? 'uil uil-spinner-alt animate-spin' : ''}>
            Enviar
          </Button>
        </div>
      </form>
    </main>
  )
}