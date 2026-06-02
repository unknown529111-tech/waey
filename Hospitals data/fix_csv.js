const fs = require('fs');

const csv = fs.readFileSync(__dirname + '/egypt_hospitals.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim());
const output = [];
output.push(lines[0]);

function quote(v) {
  if (v.includes(',') || v.includes('"') || v.includes('\n')) {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

let fixed = 0;
for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(',');
  if (cols.length === 8) {
    output.push(cols.map(quote).join(','));
    continue;
  }
  fixed++;
  const eng = cols[0];
  const arb = cols[1];
  const govE = cols[2];
  const govA = cols[3];
  const city = cols[4];
  const type = cols[cols.length - 2];
  const spec = cols[cols.length - 1];
  const address = cols.slice(5, cols.length - 2).join(',');
  output.push([eng, arb, govE, govA, city, address, type, spec].map(quote).join(','));
}

fs.writeFileSync(__dirname + '/egypt_hospitals.csv', output.join('\n') + '\n', 'utf8');
console.log('Fixed ' + fixed + ' rows. Total: ' + (output.length - 1) + ' hospitals.');
