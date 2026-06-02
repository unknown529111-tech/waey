const fs = require('fs');
const csv = fs.readFileSync(__dirname + '/egypt_hospitals.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim());
const rows = lines.slice(1);

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

const govs = {};
for (const row of rows) {
  const cols = parseCSVLine(row);
  if (cols.length < 8) {
    console.log('SHORT ROW: ' + cols.length + ' cols: ' + row.substring(0, 100));
    continue;
  }
  const govArb = cols[3];
  const govEng = cols[2];
  if (!govs[govArb]) govs[govArb] = { eng: govEng, count: 0 };
  govs[govArb].count++;
}

console.log('Governorates:');
for (const [k, v] of Object.entries(govs).sort((a, b) => b[1].count - a[1].count)) {
  console.log('  [' + k + '] (' + v.eng + ') = ' + v.count);
}
console.log('Total governorates: ' + Object.keys(govs).length);
