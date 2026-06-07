import { useState } from "react";
import { Zap, Wallet, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

type CalcTab = "electricity" | "budget";
type Currency = "EGP" | "SAR" | "AED";

const currencies: Record<Currency, { label: string; symbol: string; rate: number }> = {
  EGP: { label: "🇪🇬 جنيه مصري", symbol: "ج.م", rate: 1 },
  SAR: { label: "🇸🇦 ريال سعودي", symbol: "ر.س", rate: 0.078 },
  AED: { label: "🇦🇪 درهم إماراتي", symbol: "د.إ", rate: 0.076 },
};

// names are translation keys; render via t()
const devicesList = [
  { name: "calc.device.0", watts: 1500 },
  { name: "calc.device.1", watts: 2000 },
  { name: "calc.device.2", watts: 500 },
  { name: "calc.device.3", watts: 150 },
  { name: "calc.device.4", watts: 100 },
  { name: "calc.device.5", watts: 200 },
  { name: "calc.device.6", watts: 1200 },
  { name: "calc.device.7", watts: 1800 },
  { name: "calc.device.8", watts: 1000 },
  { name: "calc.device.9", watts: 75 },
  { name: "calc.device.10", watts: 10 },
  { name: "calc.device.11", watts: 60 },
  { name: "calc.device.12", watts: 5 },
  { name: "calc.device.13", watts: 12 },
  { name: "calc.device.14", watts: 2500 },
  { name: "calc.device.15", watts: 1800 },
  { name: "calc.device.16", watts: 3000 },
  { name: "calc.device.17", watts: 1400 },
];

const Calculators = () => {
  const t = useT();
  const [activeTab, setActiveTab] = useState<CalcTab>("electricity");

  return (
    <section id="calculators" className="py-24 px-6 md:px-12 bg-gradient-to-b from-primary/90 to-primary">
      <div className="max-w-[1000px] mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-primary-foreground">
          {t('calc.title')}
        </h2>
        <p className="text-primary-foreground/70 text-lg max-w-[50ch] mx-auto leading-relaxed">
          {t('calc.subtitle')}
        </p>
      </div>

      <div className="max-w-[900px] mx-auto bg-card rounded-4xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="flex gap-2 mb-10 flex-wrap justify-center">
          {[
          { id: "electricity" as CalcTab, label: t('calc.electricity'), icon: Zap },
            { id: "budget" as CalcTab, label: t('calc.budget'), icon: Wallet },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "electricity" && <ElectricityCalc />}
        {activeTab === "budget" && <BudgetCalc />}
      </div>
    </section>
  );
};

const CurrencySwitcher = ({ currency, setCurrency }: { currency: Currency; setCurrency: (c: Currency) => void }) => (
  <div className="flex gap-2 justify-center flex-wrap">
    {(Object.keys(currencies) as Currency[]).map((key) => (
      <button
        key={key}
        onClick={() => setCurrency(key)}
        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
          currency === key
            ? "bg-accent text-accent-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-muted"
        }`}
      >
        {currencies[key].label}
      </button>
    ))}
  </div>
);

const ElectricityCalc = () => {
  const t = useT();
  const [selectedDevices, setSelectedDevices] = useState<{ name: string; watts: number; hours: number }[]>([
    { name: "calc.device.0", watts: 1500, hours: 6 },
    { name: "calc.device.3", watts: 150, hours: 24 },
    { name: "calc.device.4", watts: 100, hours: 5 },
  ]);
  const [currency, setCurrency] = useState<Currency>("EGP");
  const [showInfo, setShowInfo] = useState(false);
  const [addDevice, setAddDevice] = useState("");

  const cur = currencies[currency];
  const costPerKwh = 1.55; // EGP per kWh (Egyptian tariff avg)

  const totalDailyKwh = selectedDevices.reduce((acc, d) => acc + (d.watts * d.hours) / 1000, 0);
  const monthlyCost = totalDailyKwh * 30 * costPerKwh;
  const savedCost = monthlyCost * 0.2;
  const convert = (v: number) => Math.round(v * cur.rate);

  const handleAddDevice = () => {
    const device = devicesList.find((d) => d.name === addDevice);
    if (device && !selectedDevices.find((d) => d.name === device.name)) {
      setSelectedDevices([...selectedDevices, { ...device, hours: 4 }]);
      setAddDevice("");
    }
  };

  const removeDevice = (name: string) => {
    setSelectedDevices(selectedDevices.filter((d) => d.name !== name));
  };

  const updateHours = (name: string, hours: number) => {
    setSelectedDevices(selectedDevices.map((d) => (d.name === name ? { ...d, hours } : d)));
  };

  return (
    <div className="space-y-8">
      <CurrencySwitcher currency={currency} setCurrency={setCurrency} />

      {/* Add device */}
      <div className="flex gap-2 items-center flex-wrap">
        <select
          value={addDevice}
          onChange={(e) => setAddDevice(e.target.value)}
          className="flex-1 min-w-[180px] bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">{t('calc.addDevice')}</option>
          {devicesList
            .filter((d) => !selectedDevices.find((s) => s.name === d.name))
            .map((d) => (
              <option key={d.name} value={d.name}>
                {t(d.name)} ({d.watts}W)
              </option>
            ))}
        </select>
        <button
          onClick={handleAddDevice}
          disabled={!addDevice}
          className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          <Plus className="size-4" />
          {t('calc.add')}
        </button>
      </div>

      {/* Selected devices */}
      <div className="space-y-3">
        {selectedDevices.map((device) => (
          <div key={device.name} className="flex items-center gap-3 bg-background rounded-2xl p-4 border border-border">
            <div className="flex-1">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>{t(device.name)} ({device.watts}W)</span>
                <span className="text-primary tabular-nums">{device.hours} {t('calc.hourDay')}</span>
              </div>
              <input
                type="range"
                min={0}
                max={24}
                value={device.hours}
                onChange={(e) => updateHours(device.name, Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <button onClick={() => removeDevice(device.name)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResultCard label={t('calc.dailyConsumption')} value={`${totalDailyKwh.toFixed(1)} kWh`} />
        <ResultCard label={t('calc.monthlyCost')} value={`${convert(monthlyCost).toLocaleString()} ${cur.symbol}`} />
        <ResultCard label={t('calc.youCanSave')} value={`${convert(savedCost).toLocaleString()} ${cur.symbol}`} accent />
      </div>

      {/* Know More */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="flex items-center gap-2 mx-auto text-sm font-bold text-primary hover:text-primary/80 transition-colors"
      >
        {showInfo ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        {t('calc.knowMore')}
      </button>

      {showInfo && (
        <div className="bg-background rounded-2xl p-6 border border-border">
          <h4 className="font-bold mb-4 text-sm">{t('calc.avgConsumption')}</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {devicesList.map((d) => (
              <div key={d.name} className="flex justify-between bg-card rounded-xl p-3 border border-border">
                <span className="font-bold">{t(d.name)}</span>
                <span className="text-muted-foreground tabular-nums">{d.watts}W</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            {t('calc.tip').replace('{cost}', (2 * costPerKwh).toFixed(1) + ' ' + currencies.EGP.symbol)}
          </p>
        </div>
      )}
    </div>
  );
};

const BudgetCalc = () => {
  const t = useT();
  const [currency, setCurrency] = useState<Currency>("EGP");
  const [income, setIncome] = useState(10000);
  const [essentials, setEssentials] = useState(5000);
  const [wants, setWants] = useState(3000);
  const [customExpenses, setCustomExpenses] = useState<{ name: string; amount: number }[]>([]);
  const [newExpName, setNewExpName] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");

  const cur = currencies[currency];
  const convert = (v: number) => Math.round(v * cur.rate);

  const totalCustom = customExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalSpending = essentials + wants + totalCustom;
  const savings = income - totalSpending;
  const savingsPercent = income > 0 ? ((savings / income) * 100).toFixed(0) : "0";

  const addExpense = () => {
    const amount = Number(newExpAmount);
    if (newExpName.trim() && amount > 0) {
      setCustomExpenses([...customExpenses, { name: newExpName.trim(), amount }]);
      setNewExpName("");
      setNewExpAmount("");
    }
  };

  const removeExpense = (idx: number) => {
    setCustomExpenses(customExpenses.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8">
      <CurrencySwitcher currency={currency} setCurrency={setCurrency} />

      <div className="space-y-6">
        <NumberField
          label={t('calc.income')}
          value={income}
          onChange={setIncome}
          min={0}
          max={1000000}
          step={500}
          symbol={cur.symbol}
          convertedValue={convert(income)}
          accentColor="primary"
        />
        <NumberField
          label={t('calc.essentials')}
          value={essentials}
          onChange={(v) => setEssentials(Math.min(v, income))}
          min={0}
          max={income}
          step={500}
          symbol={cur.symbol}
          convertedValue={convert(essentials)}
          accentColor="accent"
        />
        <NumberField
          label={t('calc.wants')}
          value={wants}
          onChange={(v) => setWants(Math.min(v, Math.max(income - essentials, 0)))}
          min={0}
          max={Math.max(income - essentials, 0)}
          step={500}
          symbol={cur.symbol}
          convertedValue={convert(wants)}
          accentColor="accent"
        />
      </div>

      {/* Manual expenses */}
      <div className="bg-background rounded-2xl p-5 border border-border space-y-4">
        <h4 className="font-bold text-sm">{t('calc.addExpenses')}</h4>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder={t('calc.expenseName')}
            value={newExpName}
            onChange={(e) => setNewExpName(e.target.value)}
            maxLength={50}
            className="flex-1 min-w-[120px] bg-card border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="number"
            placeholder={t('calc.expenseAmount')}
            value={newExpAmount}
            onChange={(e) => setNewExpAmount(e.target.value)}
            min={0}
            className="w-24 bg-card border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 tabular-nums"
            dir="ltr"
          />
          <button
            onClick={addExpense}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            <Plus className="size-4" />
          </button>
        </div>
        {customExpenses.length > 0 && (
          <div className="space-y-2">
            {customExpenses.map((exp, idx) => (
              <div key={idx} className="flex items-center justify-between bg-card rounded-xl px-4 py-2 border border-border text-sm">
                <span className="font-bold">{exp.name}</span>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums text-accent">{convert(exp.amount).toLocaleString()} {cur.symbol}</span>
                  <button onClick={() => removeExpense(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-background rounded-3xl p-6 text-center border-2 border-border">
        <span className="text-sm font-bold text-muted-foreground block mb-2">{t('calc.remaining')}</span>
        <span className={`text-4xl font-bold tabular-nums ${savings >= 0 ? "text-primary" : "text-destructive"}`}>
          {convert(savings).toLocaleString()} {cur.symbol}
        </span>
        <div className="flex items-center gap-2 mt-4 justify-center">
          <div className={`size-2 rounded-full ${Number(savingsPercent) >= 20 ? "bg-primary" : "bg-accent"}`} />
          <span className="text-sm font-bold text-muted-foreground tabular-nums">{savingsPercent}% {t('calc.incomePercent')}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {Number(savingsPercent) >= 20 ? t('calc.tip.good') : t('calc.tip.bad')}
      </p>
    </div>
  );
};

const ResultCard = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div className={`rounded-2xl p-5 text-center ${accent ? "bg-primary text-primary-foreground" : "bg-background border border-border"}`}>
    <span className={`text-xs font-bold block mb-1 ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{label}</span>
    <span className="text-2xl font-bold tabular-nums">{value}</span>
  </div>
);

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  symbol: string;
  convertedValue: number;
  accentColor: "primary" | "accent";
}

const NumberField = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  symbol,
  convertedValue,
  accentColor,
}: NumberFieldProps) => {
  const [draft, setDraft] = useState<string>(String(value));

  const commitDraft = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    const num = cleaned === "" ? 0 : Number(cleaned);
    if (Number.isFinite(num)) {
      const clamped = Math.max(min, Math.min(max, num));
      onChange(clamped);
      setDraft(String(clamped));
    } else {
      setDraft(String(value));
    }
  };

  const colorClass = accentColor === "primary" ? "text-primary accent-primary" : "text-accent accent-accent";

  return (
    <div>
      <div className="flex justify-between items-center mb-3 gap-3 flex-wrap">
        <label className="text-sm font-bold">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={draft}
            onFocus={() => setDraft(String(value))}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commitDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className={`w-28 bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-bold tabular-nums text-left focus:outline-none focus:ring-2 focus:ring-primary/30 ${colorClass.split(" ")[0]}`}
            dir="ltr"
          />
          <span className="text-xs text-muted-foreground font-bold">{symbol}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(v);
          setDraft(String(v));
        }}
        className={`w-full ${colorClass.split(" ")[1]}`}
      />
      {convertedValue !== value && (
        <p className="text-[10px] text-muted-foreground text-right mt-1 tabular-nums">
          ≈ {convertedValue.toLocaleString()} {symbol}
        </p>
      )}
    </div>
  );
};

export default Calculators;
