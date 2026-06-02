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

const typeMap = {
  Public: 'حكومي',
  Private: 'خاص',
  University: 'جامعي',
  Teaching: 'تعليمي',
  Military: 'حكومي',
  Police: 'حكومي',
  'Non-Profit': 'خاص',
  Research: 'حكومي',
  Specialized: 'عام',
};

const engToArb = {
  Cairo: 'القاهرة',
  Giza: 'الجيزة',
  Alexandria: 'الإسكندرية',
  Sharqia: 'الشرقية',
  Dakahlia: 'الدقهلية',
  Beheira: 'البحيرة',
  Gharbia: 'الغربية',
  Minya: 'المنيا',
  Qalyubia: 'القليوبية',
  Sohag: 'سوهاج',
  Assiut: 'أسيوط',
  Monufia: 'المنوفية',
  'Kafr El Sheikh': 'كفر الشيخ',
  Fayoum: 'الفيوم',
  'Beni Suef': 'بني سويف',
  Qena: 'قنا',
  Aswan: 'أسوان',
  Luxor: 'الأقصر',
  'Red Sea': 'البحر الأحمر',
  Damietta: 'دمياط',
  Ismailia: 'الإسماعيلية',
  'Port Said': 'بورسعيد',
  Suez: 'السويس',
  'New Valley': 'الوادي الجديد',
  Matrouh: 'مطروح',
  'North Sinai': 'شمال سيناء',
  'South Sinai': 'جنوب سيناء',
};

const govMap = {};
let idCounter = 0;
let skippedCorrupted = 0;

for (const row of rows) {
  const cols = parseCSVLine(row);
  if (cols.length < 8) continue;

  const engName = cols[0];
  const arbName = cols[1];
  const govEng = cols[2].trim();
  const govArb = cols[3].trim();
  const city = cols[4].trim();
  const address = cols[5].trim();
  const type = cols[6].trim();
  const spec = cols[7].trim();

  // Use English gov name to map to proper Arabic if Arabic is corrupted
  const govName = engToArb[govEng] || govArb;

  if (!govName || govName.length < 2) {
    skippedCorrupted++;
    continue;
  }

  if (!govMap[govName]) {
    govMap[govName] = { cities: {} };
  }
  if (!govMap[govName].cities[city]) {
    govMap[govName].cities[city] = [];
  }
  idCounter++;
  const prefix = govEng.substring(0, 3).toLowerCase();
  govMap[govName].cities[city].push({
    id: `${prefix}-${idCounter}`,
    name: arbName && arbName.length > 1 ? arbName : engName,
    address: address || 'غير محدد',
    type: typeMap[type] || 'عام',
  });
}

// ---- Generate TypeScript ----
let ts = `// Generated from egypt_hospitals.csv — automatically updated
// Phone numbers removed

export interface Hospital {
  id: string;
  name: string;
  address: string;
  type: "حكومي" | "جامعي" | "تعليمي" | "خاص" | "عام";
}

export interface CityHospitals {
  city: string;
  hospitals: Hospital[];
}

export interface GovernorateData {
  name: string;
  cities: CityHospitals[];
}

export const hospitalsData: GovernorateData[] = [
`;

const govKeys = Object.keys(govMap);
for (let gi = 0; gi < govKeys.length; gi++) {
  const gov = govKeys[gi];
  const cities = govMap[gov].cities;
  const cityKeys = Object.keys(cities);

  ts += `  {\n    name: "${gov}",\n    cities: [\n`;

  for (let ci = 0; ci < cityKeys.length; ci++) {
    const city = cityKeys[ci];
    const hospitals = cities[city];
    ts += `      {\n        city: "${city}",\n        hospitals: [\n`;

    for (let hi = 0; hi < hospitals.length; hi++) {
      const h = hospitals[hi];
      const name = h.name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const addr = h.address.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      ts += `          { id: "${h.id}", name: "${name}", address: "${addr}", type: "${h.type}" }`;
      if (hi < hospitals.length - 1) ts += ',';
      ts += '\n';
    }

    ts += '        ]\n      }';
    if (ci < cityKeys.length - 1) ts += ',';
    ts += '\n';
  }

  ts += '    ]\n  }';
  if (gi < govKeys.length - 1) ts += ',';
  ts += '\n';
}

ts += '];\n';

const target = 'C:/Users/mahmo/Downloads/waey-clean - Copy/waey - Copy/src/data/hospitals.ts';
fs.writeFileSync(target, ts, 'utf8');

let total = 0;
for (const gk of govKeys) {
  for (const ck of Object.keys(govMap[gk].cities)) {
    total += govMap[gk].cities[ck].length;
  }
}
console.log(`Generated: ${total} hospitals in ${govKeys.length} governorates`);
if (skippedCorrupted > 0) console.log(`Skipped ${skippedCorrupted} corrupted rows`);
