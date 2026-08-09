import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelmetSEOManager } from '../seo/HelmetSEOManager';
import { ArrowLeft, RefreshCw, CheckCircle2, HelpCircle, ShieldCheck } from 'lucide-react';

interface UnitDefinition {
  name: string;
  symbol: string;
  ratio: number; // Ratio to base unit
}

interface CategoryConfig {
  id: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  baseUnit: string;
  units: Record<string, UnitDefinition>;
  intro: string;
  formulaText: string;
  commonExamples: { from: string; to: string; formula: string }[];
  useCases: string[];
  faqs: { question: string; answer: string }[];
}

const UNIT_CATEGORIES_DATA: Record<string, CategoryConfig> = {
  'length': {
    id: 'length',
    title: 'Length Converter – Convert Meters, Feet, Miles & Kilometers',
    seoTitle: 'Length Converter – Convert Meters, Feet, Miles & Kilometers | ConvertVerse',
    seoDescription: 'Convert length units instantly with ConvertVerse. Convert meters, kilometers, centimeters, millimeters, miles, yards, feet, and inches with accurate online calculations.',
    baseUnit: 'm',
    units: {
      m: { name: 'Meters', symbol: 'm', ratio: 1 },
      km: { name: 'Kilometers', symbol: 'km', ratio: 1000 },
      cm: { name: 'Centimeters', symbol: 'cm', ratio: 0.01 },
      mm: { name: 'Millimeters', symbol: 'mm', ratio: 0.001 },
      mi: { name: 'Miles', symbol: 'mi', ratio: 1609.344 },
      yd: { name: 'Yards', symbol: 'yd', ratio: 0.9144 },
      ft: { name: 'Feet', symbol: 'ft', ratio: 0.3048 },
      in: { name: 'Inches', symbol: 'in', ratio: 0.0254 }
    },
    intro: 'Convert meters, kilometers, centimeters, millimeters, miles, yards, feet and inches quickly using this online length converter. All conversions run 100% locally in your browser with high floating-point mathematical precision.',
    formulaText: 'Length conversion calculates target unit values by scaling input quantities through standardized metric and imperial base ratios (1 meter = 3.28084 feet = 0.000621371 miles).',
    commonExamples: [
      { from: '1 Kilometer (km)', to: '0.621371 Miles (mi)', formula: '1 km × 0.621371 = 0.621371 mi' },
      { from: '1 Meter (m)', to: '3.28084 Feet (ft)', formula: '1 m × 3.28084 = 3.28084 ft' },
      { from: '1 Inch (in)', to: '2.54 Centimeters (cm)', formula: '1 in × 2.54 = 2.54 cm' },
      { from: '1 Yard (yd)', to: '0.9144 Meters (m)', formula: '1 yd × 0.9144 = 0.9144 m' }
    ],
    useCases: [
      'Architectural blueprint drafting and international construction scaling.',
      'Road trip distance calculation between miles and kilometers.',
      'E-commerce product packaging and parcel shipping measurement conversions.',
      'Scientific research metric unit standardization.'
    ],
    faqs: [
      { question: 'How many feet are in a meter?', answer: 'There are exactly 3.28084 feet in 1 meter.' },
      { question: 'How do I convert kilometers to miles?', answer: 'Multiply the number of kilometers by 0.621371 to get miles.' },
      { question: 'Is this length converter free to use?', answer: 'Yes! ConvertVerse length conversions are 100% free with unlimited local usage.' }
    ]
  },
  'weight': {
    id: 'weight',
    title: 'Weight & Mass Converter – Convert Kilograms, Pounds & Ounces',
    seoTitle: 'Weight & Mass Converter – Convert kg, lb, g & Ounces | ConvertVerse',
    seoDescription: 'Convert kilograms, grams, pounds, ounces, and metric tons instantly with this free online weight converter. 100% private browser calculations.',
    baseUnit: 'kg',
    units: {
      kg: { name: 'Kilograms', symbol: 'kg', ratio: 1 },
      g: { name: 'Grams', symbol: 'g', ratio: 0.001 },
      mg: { name: 'Milligrams', symbol: 'mg', ratio: 0.000001 },
      lb: { name: 'Pounds', symbol: 'lb', ratio: 0.45359237 },
      oz: { name: 'Ounces', symbol: 'oz', ratio: 0.028349523125 },
      t: { name: 'Metric Tons', symbol: 't', ratio: 1000 }
    },
    intro: 'Convert kilograms, grams, milligrams, pounds, ounces, and metric tons easily. Ideal for fitness weight tracking, recipe baking measurements, and international freight logistics.',
    formulaText: 'Weight conversion converts mass values by relating units to base kilogram equivalents (1 kilogram = 2.20462 pounds = 35.274 ounces).',
    commonExamples: [
      { from: '1 Kilogram (kg)', to: '2.20462 Pounds (lb)', formula: '1 kg × 2.20462 = 2.20462 lb' },
      { from: '1 Pound (lb)', to: '453.592 Grams (g)', formula: '1 lb × 453.592 = 453.592 g' },
      { from: '1 Ounce (oz)', to: '28.3495 Grams (g)', formula: '1 oz × 28.3495 = 28.3495 g' }
    ],
    useCases: [
      'Gym workout weight translation between lbs and kg.',
      'Culinary recipe conversion from imperial ounces to metric grams.',
      'Air cargo and postal parcel shipping weight verification.'
    ],
    faqs: [
      { question: 'How many pounds equal one kilogram?', answer: '1 kilogram equals approximately 2.20462 pounds.' },
      { question: 'How many grams are in an ounce?', answer: 'There are 28.3495 grams in 1 avoirdupois ounce.' }
    ]
  },
  'temperature': {
    id: 'temperature',
    title: 'Temperature Converter – Celsius, Fahrenheit & Kelvin',
    seoTitle: 'Temperature Converter – Celsius, Fahrenheit & Kelvin | ConvertVerse',
    seoDescription: 'Convert temperature units instantly between Celsius (°C), Fahrenheit (°F), and Kelvin (K) with exact mathematical equations.',
    baseUnit: 'c',
    units: {
      c: { name: 'Celsius', symbol: '°C', ratio: 1 },
      f: { name: 'Fahrenheit', symbol: '°F', ratio: 1 },
      k: { name: 'Kelvin', symbol: 'K', ratio: 1 }
    },
    intro: 'Convert temperatures accurately between Celsius, Fahrenheit, and Kelvin scales. Essential for weather forecasting, physics experiments, and oven temperature baking.',
    formulaText: 'Celsius to Fahrenheit: °F = (°C × 9/5) + 32. Celsius to Kelvin: K = °C + 273.15.',
    commonExamples: [
      { from: '0 °C (Freezing)', to: '32 °F', formula: '(0 × 9/5) + 32 = 32 °F' },
      { from: '100 °C (Boiling)', to: '212 °F', formula: '(100 × 9/5) + 32 = 212 °F' },
      { from: '37 °C (Body Temp)', to: '98.6 °F', formula: '(37 × 9/5) + 32 = 98.6 °F' }
    ],
    useCases: [
      'Converting international weather forecasts between Celsius and Fahrenheit.',
      'Oven baking temperature adjustments for recipes from different countries.',
      'Scientific thermodynamic research using Kelvin temperatures.'
    ],
    faqs: [
      { question: 'At what temperature are Celsius and Fahrenheit equal?', answer: 'Celsius and Fahrenheit are equal at -40 degrees (-40 °C = -40 °F).' },
      { question: 'How do you convert Celsius to Fahrenheit?', answer: 'Multiply °C by 1.8 and add 32.' }
    ]
  },
  'area': {
    id: 'area',
    title: 'Area Converter – Square Meters, Feet, Acres & Hectares',
    seoTitle: 'Area Converter – Square Meters, Feet, Acres & Hectares | ConvertVerse',
    seoDescription: 'Convert area measurements between square meters, square feet, acres, hectares, and square miles locally in your browser.',
    baseUnit: 'sqm',
    units: {
      sqm: { name: 'Square Meters', symbol: 'm²', ratio: 1 },
      sqft: { name: 'Square Feet', symbol: 'ft²', ratio: 0.09290304 },
      acre: { name: 'Acres', symbol: 'ac', ratio: 4046.8564224 },
      ha: { name: 'Hectares', symbol: 'ha', ratio: 10000 },
      sqkm: { name: 'Square Kilometers', symbol: 'km²', ratio: 1000000 },
      sqmi: { name: 'Square Miles', symbol: 'mi²', ratio: 2589988.110336 }
    },
    intro: 'Calculate real estate property sizes, land plots, and floor plans with our online area unit converter.',
    formulaText: 'Area conversion scales 2D dimensions using square factor constants (1 acre = 43,560 square feet = 4046.86 square meters).',
    commonExamples: [
      { from: '1 Acre', to: '43,560 Square Feet', formula: '1 ac = 43,560 ft²' },
      { from: '1 Hectare', to: '2.47105 Acres', formula: '1 ha = 2.47105 ac' }
    ],
    useCases: ['Real estate land sizing.', 'Agricultural farming plot measurement.'],
    faqs: [{ question: 'How many square feet are in an acre?', answer: '1 acre equals 43,560 square feet.' }]
  },
  'data': {
    id: 'data',
    title: 'Data Storage Converter – Bytes, KB, MB, GB, TB & PB',
    seoTitle: 'Data Storage Converter – Bytes, KB, MB, GB & TB | ConvertVerse',
    seoDescription: 'Convert digital storage metrics between Bytes, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), and Terabytes (TB) instantly.',
    baseUnit: 'mb',
    units: {
      b: { name: 'Bytes', symbol: 'B', ratio: 0.000001 },
      kb: { name: 'Kilobytes', symbol: 'KB', ratio: 0.001 },
      mb: { name: 'Megabytes', symbol: 'MB', ratio: 1 },
      gb: { name: 'Gigabytes', symbol: 'GB', ratio: 1000 },
      tb: { name: 'Terabytes', symbol: 'TB', ratio: 1000000 }
    },
    intro: 'Convert digital memory metrics instantly. Calculate hard drive capacity, network bandwidth usage, and video file sizes.',
    formulaText: 'Decimal metric conversion: 1 GB = 1000 MB. Binary metric conversion: 1 GiB = 1024 MiB.',
    commonExamples: [
      { from: '1 Gigabyte (GB)', to: '1,000 Megabytes (MB)', formula: '1 GB = 1000 MB' },
      { from: '1 Terabyte (TB)', to: '1,000 Gigabytes (GB)', formula: '1 TB = 1000 GB' }
    ],
    useCases: ['Estimating storage requirements for video files.', 'Cloud server bandwidth capacity planning.'],
    faqs: [{ question: 'How many MB are in 1 GB?', answer: 'Standard metric data storage defines 1 GB as 1,000 MB (or 1,024 MiB in binary scale).' }]
  }
};

export default function UnitConvertersView() {
  const { category } = useParams<{ category: string }>();
  const config = (category && UNIT_CATEGORIES_DATA[category]) ? UNIT_CATEGORIES_DATA[category] : UNIT_CATEGORIES_DATA['length'];

  const [inputValue, setInputValue] = useState<number | ''>(1);
  const [fromUnit, setFromUnit] = useState<string>(Object.keys(config.units)[0] || 'm');
  const [toUnit, setToUnit] = useState<string>(Object.keys(config.units)[1] || 'km');

  const unitKeys = Object.keys(config.units);

  // Convert function
  const calculateResult = (): string => {
    if (inputValue === '' || isNaN(Number(inputValue))) return '0';
    const val = Number(inputValue);

    if (config.id === 'temperature') {
      if (fromUnit === toUnit) return val.toString();
      let celsiusVal = val;
      if (fromUnit === 'f') celsiusVal = (val - 32) * (5 / 9);
      if (fromUnit === 'k') celsiusVal = val - 273.15;

      let resultVal = celsiusVal;
      if (toUnit === 'f') resultVal = (celsiusVal * 9 / 5) + 32;
      if (toUnit === 'k') resultVal = celsiusVal + 273.15;

      return Number(resultVal.toFixed(6)).toString();
    }

    const fromDef = config.units[fromUnit];
    const toDef = config.units[toUnit];
    if (!fromDef || !toDef) return '0';

    const baseValue = val * fromDef.ratio;
    const resultValue = baseValue / toDef.ratio;
    return Number(resultValue.toFixed(8)).toString();
  };

  return (
    <>
      <HelmetSEOManager
        titleOverride={config.seoTitle}
        descriptionOverride={config.seoDescription}
        pathOverride={`/converters/${config.id}`}
      />

      <div className="max-w-4xl mx-auto py-12 px-4 space-y-10 text-slate-300">
        <Link to="/converters" className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Converters Directory
        </Link>

        {/* Header Section */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase">
            <RefreshCw className="w-3.5 h-3.5" /> Unit Converter Workstation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {config.title}
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {config.intro}
          </p>
        </header>

        {/* Interactive Calculator Component */}
        <section className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" /> Interactive {config.id.toUpperCase()} Calculator
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Input Side */}
            <div className="space-y-3">
              <label htmlFor="convert-input-value" className="block text-sm font-semibold text-slate-300">Enter Value:</label>
              <input
                id="convert-input-value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="100"
              />
              <label htmlFor="convert-from-unit" className="block text-sm font-semibold text-slate-300 mt-2">From Unit:</label>
              <select
                id="convert-from-unit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-emerald-500"
              >
                {unitKeys.map(k => (
                  <option key={k} value={k}>{config.units[k].name} ({config.units[k].symbol})</option>
                ))}
              </select>
            </div>

            {/* Output Side */}
            <div className="space-y-3 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <label htmlFor="convert-to-unit" className="block text-sm font-semibold text-slate-300">Converted Output:</label>
              <div className="text-3xl font-extrabold text-emerald-400 break-words py-1">
                {calculateResult()} <span className="text-lg text-slate-400 font-normal">{config.units[toUnit]?.symbol}</span>
              </div>
              <label htmlFor="convert-to-unit" className="block text-sm font-semibold text-slate-300 mt-2">To Target Unit:</label>
              <select
                id="convert-to-unit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-emerald-500"
              >
                {unitKeys.map(k => (
                  <option key={k} value={k}>{config.units[k].name} ({config.units[k].symbol})</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Supported Units Reference Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Supported {config.id.toUpperCase()} Units</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-700 rounded-xl overflow-hidden text-sm">
              <thead className="bg-slate-800 text-slate-200">
                <tr>
                  <th className="p-3 border border-slate-700">Unit Name</th>
                  <th className="p-3 border border-slate-700">Symbol</th>
                  <th className="p-3 border border-slate-700">Base Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {unitKeys.map(k => (
                  <tr key={k} className="hover:bg-slate-800/40">
                    <td className="p-3 border border-slate-800 font-semibold text-white">{config.units[k].name}</td>
                    <td className="p-3 border border-slate-800 text-emerald-400 font-mono">{config.units[k].symbol}</td>
                    <td className="p-3 border border-slate-800 text-slate-400">{config.units[k].ratio} {config.baseUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Conversion Formula Explanation */}
        <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Conversion Formula & Method</h2>
          <p className="text-slate-300 leading-relaxed">{config.formulaText}</p>
        </section>

        {/* Common Conversion Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Common Conversion Examples</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {config.commonExamples.map((ex, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-1">
                <div className="font-bold text-white">{ex.from} = {ex.to}</div>
                <div className="text-xs text-emerald-400 font-mono">{ex.formula}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Practical Use Cases */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Practical Use Cases</h2>
          <ul className="space-y-2">
            {config.useCases.map((uc, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{uc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        {config.faqs && config.faqs.length > 0 && (
          <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-400" /> Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {config.faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <h3 className="font-semibold text-white text-base">{faq.question}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Converters Internal Links */}
        <section className="pt-6 border-t border-slate-700/60 space-y-4">
          <h3 className="text-xl font-bold text-white">Explore Other Converters</h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/converters/length" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-slate-300">Length Converter</Link>
            <Link to="/converters/weight" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-slate-300">Weight Converter</Link>
            <Link to="/converters/temperature" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-slate-300">Temperature Converter</Link>
            <Link to="/converters/area" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-slate-300">Area Converter</Link>
            <Link to="/converters/data" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-slate-300">Data Converter</Link>
            <Link to="/converters" className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-sm text-emerald-400 font-semibold">View All Converters →</Link>
          </div>
        </section>
      </div>
    </>
  );
}
