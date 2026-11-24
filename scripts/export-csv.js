const fs = require('fs');
const path = require('path');
const gcs = require('../assets/gcs.json');

const outputPath = process.argv[2] || path.join(process.cwd(), 'gcs.csv');

const contact = (n, field) => gc => gc.contacts?.[n]?.[field];

const columns = [
  ['nome', gc => gc.name],
  ['setor', gc => gc.sector?.name],
  ['endereco', gc => gc.address?.text],
  ['numero', gc => gc.address?.street_number],
  ['complemento', gc => gc.address?.complement],
  ['lider1_nome', contact(0, 'name')],
  ['lider1_telefone', contact(0, 'phone')],
  ['lider2_nome', contact(1, 'name')],
  ['lider2_telefone', contact(1, 'phone')],
  ['dia', gc => gc.schedules?.[0]?.weekday],
  ['horario', gc => gc.schedules?.[0]?.hour],
];

function escape(value) {
  const str = value == null ? '' : String(value);
  return /[",\n\r;]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

const rows = [
  columns.map(([header]) => header),
  ...Object.values(gcs).map(gc => columns.map(([, get]) => get(gc))),
];

// BOM so Excel reads UTF-8 (accents) correctly
const csv = '﻿' + rows.map(r => r.map(escape).join(',')).join('\r\n') + '\r\n';

fs.writeFileSync(outputPath, csv);
console.log(`${rows.length - 1} GCs → ${outputPath}`);
