export const SECTORS = {
  orange: {id: 'orange', name: 'Laranja', color: '#ffb000'},
  blue:   {id: 'blue',   name: 'Azul',    color: '#2186ed'},
  green:  {id: 'green',  name: 'Verde',   color: '#029248'},
  white:  {id: 'white',  name: 'Branco',  color: '#000000'},
  yellow: {id: 'yellow', name: 'Amarelo', color: '#ffd400'},
}

export const SECTOR_LIST = Object.values(SECTORS)

export function getSector(sectorId){
  return SECTORS[sectorId] ?? null
}

export function getSectorColor(sectorId){
  return SECTORS[sectorId]?.color ?? '#000000'
}
