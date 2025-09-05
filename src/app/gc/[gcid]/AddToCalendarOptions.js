'use client'

import SplitButton from '@/components/ui/SplitButton'
import {googleCalendarLink, iosCalendarLink} from '@/calendar/calendar'

const options = [
  {label: 'Google Agenda', value:'google'},
  {label: 'Calendário iOS', value:'ios'}
]

export default function AddToCalendarOptions({gc, schedule}) {
  const handleOptionClick = (option) => {
    if(option.value === 'google'){
      window.open(googleCalendarLink(gc, schedule), '_blank')
    }
    if(option.value === 'ios'){
      window.open(iosCalendarLink(gc, schedule), '_blank')
    }
  }
  return (
    <SplitButton label="adicionar na agenda" options={options} onOptionClick={handleOptionClick} />
  )
}