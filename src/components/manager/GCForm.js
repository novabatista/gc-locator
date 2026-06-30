'use client'

import {useState} from 'react'
import {SECTOR_LIST, SECTORS} from '@/gc/sectors'
import {WEEKDAYS} from '@/gc/weekdays'
import {LINK_TYPES, LINK_TYPE_KEYS, urlsByKeyFromLinks} from '@/gc/links'

function makeInitialState(gc){
  if (!gc) {
    return {
      id: '',
      name: '',
      sheetId: '',
      sector_id: SECTOR_LIST[0].id,
      address_text: '',
      contacts: [{name: '', phone: ''}],
      schedule_day_index: 6,
      schedule_hour: '20:00',
      links: {facebook: '', instagram: '', tiktok: '', web: ''},
      description: '',
    }
  }

  const schedule = gc.schedules?.[0] ?? {day_index: 6, hour: '20:00'}

  return {
    id: gc.id ?? '',
    name: gc.name ?? '',
    sheetId: gc.sheetId ?? '',
    sector_id: gc.sector?.id ?? SECTOR_LIST[0].id,
    address_text: gc.address?.text ?? '',
    contacts: (gc.contacts?.length ? gc.contacts : [{name: '', phone: ''}]).map(c => ({
      name: c.name ?? '',
      phone: c.phone ?? '',
    })),
    schedule_day_index: schedule.day_index ?? 6,
    schedule_hour: schedule.hour ?? '20:00',
    links: urlsByKeyFromLinks(gc.links),
    description: Array.isArray(gc.description) ? gc.description.join('\n\n') : (gc.description ?? ''),
  }
}

export default function GCForm({action, gc}){
  const isEdit = !!gc
  const [state, setState] = useState(() => makeInitialState(gc))

  const sectorMeta = SECTORS[state.sector_id]

  const updateContact = (i, field, value) => {
    setState(s => ({
      ...s,
      contacts: s.contacts.map((c, idx) => idx === i ? {...c, [field]: value} : c),
    }))
  }
  const addContact = () => setState(s => ({...s, contacts: [...s.contacts, {name: '', phone: ''}]}))
  const removeContact = (i) => setState(s => ({...s, contacts: s.contacts.filter((_, idx) => idx !== i)}))

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="payload" value={JSON.stringify(state)} readOnly />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">ID</label>
          <input
            className="form-input"
            value={state.id}
            onChange={e => setState(s => ({...s, id: e.target.value}))}
            placeholder="ex: mosaico1"
            required
            readOnly={isEdit}
            disabled={isEdit}
          />
        </div>
        <div>
          <label className="form-label">Nome</label>
          <input
            className="form-input"
            value={state.name}
            onChange={e => setState(s => ({...s, name: e.target.value}))}
            required
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Sector</label>
          <div className="flex flex-row items-center gap-3">
            <select
              className="form-input flex-1"
              value={state.sector_id}
              onChange={e => setState(s => ({...s, sector_id: e.target.value}))}
            >
              {SECTOR_LIST.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
            <span
              className="inline-block w-6 h-6 rounded-full border border-gray-300"
              style={{background: sectorMeta?.color ?? '#000'}}
              title={sectorMeta?.color}
            />
          </div>
        </div>
        <div>
          <label className="form-label">Sheet ID (Google Sheets de membros)</label>
          <input
            className="form-input"
            value={state.sheetId}
            onChange={e => setState(s => ({...s, sheetId: e.target.value}))}
            placeholder="opcional"
          />
        </div>
      </section>

      <section>
        <label className="form-label">Endereço</label>
        <input
          className="form-input"
          value={state.address_text}
          onChange={e => setState(s => ({...s, address_text: e.target.value}))}
          placeholder="Rua, número - Bairro, Cidade - UF, CEP"
        />
      </section>

      <section>
        <div className="flex flex-row items-center justify-between mb-2">
          <span className="form-label">Líderes / Contatos</span>
          <button type="button" onClick={addContact} className="text-sm underline">+ adicionar</button>
        </div>
        <div className="flex flex-col gap-2">
          {state.contacts.map((c, i) => (
            <div key={i} className="flex flex-row gap-2">
              <input
                className="form-input flex-1"
                placeholder="Nome"
                value={c.name}
                onChange={e => updateContact(i, 'name', e.target.value)}
              />
              <input
                className="form-input flex-1"
                placeholder="(00) 00000-0000"
                value={c.phone}
                onChange={e => updateContact(i, 'phone', e.target.value)}
              />
              {state.contacts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeContact(i)}
                  className="text-sm text-red-700 underline whitespace-nowrap"
                >remover</button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Dia da reunião</label>
          <select
            className="form-input"
            value={state.schedule_day_index}
            onChange={e => setState(s => ({...s, schedule_day_index: Number(e.target.value)}))}
          >
            {WEEKDAYS.map(w => (
              <option key={w.day_index} value={w.day_index}>{w.weekday}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Horário</label>
          <input
            className="form-input"
            type="time"
            value={state.schedule_hour}
            onChange={e => setState(s => ({...s, schedule_hour: e.target.value}))}
          />
        </div>
      </section>

      <section>
        <span className="form-label block mb-2">Links</span>
        <div className="flex flex-col gap-2">
          {LINK_TYPE_KEYS.map(key => {
            const meta = LINK_TYPES[key]
            return (
              <div key={key} className="flex flex-row items-center gap-2">
                <i className={`${meta.icon} text-xl w-6 text-center`} aria-hidden />
                <input
                  className="form-input flex-1"
                  placeholder={`URL do ${meta.label}`}
                  value={state.links[key] ?? ''}
                  onChange={e => setState(s => ({...s, links: {...s.links, [key]: e.target.value}}))}
                />
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <label className="form-label">Descrição</label>
        <textarea
          className="form-input min-h-40"
          rows={10}
          value={state.description}
          onChange={e => setState(s => ({...s, description: e.target.value}))}
          placeholder="Separe parágrafos com uma linha em branco."
        />
      </section>

      <div className="flex flex-row justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="submit" className="bg-gray-950 text-white px-6 py-2 rounded-md">
          {isEdit ? 'Salvar' : 'Criar GC'}
        </button>
      </div>
    </form>
  )
}
