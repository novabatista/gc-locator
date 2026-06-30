export const WEEKDAYS = [
  {day_index: 0, weekday: 'Domingos'},
  {day_index: 1, weekday: 'Segundas-feiras'},
  {day_index: 2, weekday: 'Terças-feiras'},
  {day_index: 3, weekday: 'Quartas-feiras'},
  {day_index: 4, weekday: 'Quintas-feiras'},
  {day_index: 5, weekday: 'Sextas-feiras'},
  {day_index: 6, weekday: 'Sábados'},
]

export function weekdayByIndex(index){
  return WEEKDAYS.find(w => w.day_index === Number(index)) ?? WEEKDAYS[6]
}
