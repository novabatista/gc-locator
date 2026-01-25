'use client'

import gcs from '@/assets/gcs.json'
import Button from '@/components/ui/Button'

export default function PageLead({params, searchParams}) {
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const form = e.target
    const responsible = form.querySelector('select').value
    const name = form.querySelector('input[type="text"]').value
    const whatsapp = form.querySelector('input[placeholder="(00) 00000-0000"]').value

    if (responsible === '-- selecione --') {
      alert('Por favor selecione um responsável')
      return
    }

    if (!name) {
      alert('Por favor preencha o nome')
      return
    }

    if (!whatsapp) {
      alert('Por favor preencha o WhatsApp')
      return
    }

    // TODO: Enviar para API
    /* fetch('/api/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        responsible,
        name,
        whatsapp,
      }),
    }) */
  }
  
  return (
    <main
      className="font-sans min-h-screen w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-8/12 max-w-[1200px] m-auto py-8 sm:py-12">
      <form className="flex flex-col gap-8" onSubmit={handleFormSubmit}>
        <section>
          <h2 className="text-xl mb-4">Responsável</h2>
          <select className="w-full p-2 border rounded">
            <option>-- selecione --</option>
            {Object.values(gcs).map(gc =>
              gc.contacts.map((contact, index) => (
                <option key={`${gc.id}-${index}`} value={contact.name}>
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
              <input type="text" className="w-full p-2 border rounded"/>
            </div>
            <div>
              <label className="block mb-2">WhatsApp</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="(00) 00000-0000"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                maxLength="15"
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '')
                  if (value.length > 0) {
                    value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`
                  }
                  e.target.value = value
                }}
              />
            </div>
          </div>
        </section>

        <Button type="submit">Enviar</Button>
      </form>
    </main>
  )
}