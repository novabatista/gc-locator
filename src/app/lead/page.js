'use client'

import gcs from '@/assets/gcs.json'
import Button from '@/components/ui/Button'
import {useState} from 'react'
import {phoneMaskChange, phoneMaskKeyPress} from '@/mask/phonemask'

const RESPONSIBLE_EMPTY_VALUE = '-- selecione --'
export default function PageLead({params, searchParams}) {
  const gcsList = Object.values(gcs).filter(gc => gc.id===gcs.mosaico1.id)
  const [isLoading, setLoading] = useState(false)

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const form = e.target
    const responsibleEl = form.querySelector('select[name="responsible"]')
    const guestNameEl = form.querySelector('input[name="guest.name"]')
    const guestPhoneEl = form.querySelector('input[name="guest.phone"]')

    const responsible = responsibleEl.value
    const guestName = guestNameEl.value
    const guestPhone = guestPhoneEl.value

    const [responsibleGcId, responsibleContactIndex] = responsible.split('-')

    if (responsible === RESPONSIBLE_EMPTY_VALUE) {
      alert('Por favor selecione um responsável')
      return
    }

    if (!guestName) {
      alert('Por favor preencha o nome')
      return
    }

    if (!guestPhone) {
      alert('Por favor preencha o WhatsApp')
      return
    }

    setLoading(true)
    fetch('/api/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        responsible: {
          id: responsibleGcId,
          contactIndex: responsibleContactIndex,
        },
        guest:{
          name: guestName,
          phone: guestPhone,
        }
      }),
    })
      .then((r)=>r.json())
      .then((resp)=>{
        if(!resp?.sheet?.sent){
          alert('Erro ao encaminhar visitante')
          return
        }

        form.reset()
        alert('Visitante encaminhado com sucesso!')
    }).finally(setLoading)
  }
  
  return (
    <main
      className="font-sans min-h-screen w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-8/12 max-w-[1200px] m-auto py-8 sm:py-12">
      <form className="flex flex-col gap-8" onSubmit={handleFormSubmit}>
        <section>
          <h2 className="text-xl mb-4">Responsável</h2>
          <select className="form-input" name="responsible" required>
            <option>{RESPONSIBLE_EMPTY_VALUE}</option>
            {gcsList.map(gc =>
              gc.contacts.map((contact, index) => (
                <option key={`${gc.id}-${index}`} value={`${gc.id}-${index}`}>
                  {contact.name} ({gc.name})
                </option>
              )),
            )}
          </select>
        </section>

        <section>
          <h2 className="text-xl mb-4">Visitante</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-2">Nome</label>
              <input name="guest.name" type="text" className="form-input"/>
            </div>
            <div>
              <label className="block mb-2">WhatsApp</label>
              <input
                type="text"
                name="guest.phone"
                className="form-input"
                placeholder="(00) 00000-0000"
                onKeyPress={phoneMaskKeyPress}
                onChange={phoneMaskChange}
                maxLength="15"
              />
            </div>
          </div>
        </section>

        <Button type="submit" disabled={isLoading} icon={isLoading ? 'uil uil-spinner-alt animate-spin' : ''}>
          Enviar
        </Button>
      </form>
    </main>
  )
}