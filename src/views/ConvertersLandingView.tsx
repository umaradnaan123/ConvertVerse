import React from 'react';
import { Link } from 'react-router-dom';
import { HelmetSEOManager } from '../seo/HelmetSEOManager';
import { 
  Ruler, Scale, Thermometer, Maximize2, Box, Clock, 
  Gauge, HardDrive, Zap, Compass, RefreshCw, FileText, Image as ImageIcon,
  ArrowRight, ShieldCheck, CheckCircle2 
} from 'lucide-react';

export const CONVERTER_CATEGORIES = [
  { id: 'length', name: 'Length Converter', desc: 'Convert meters, feet, miles, kilometers, inches, yards, cm, and mm.', icon: Ruler, path: '/converters/length', count: '8 units' },
  { id: 'weight', name: 'Weight & Mass Converter', desc: 'Convert kilograms, pounds, grams, ounces, tons, and stones.', icon: Scale, path: '/converters/weight', count: '6 units' },
  { id: 'temperature', name: 'Temperature Converter', desc: 'Convert Celsius, Fahrenheit, and Kelvin temperature scales.', icon: Thermometer, path: '/converters/temperature', count: '3 units' },
  { id: 'area', name: 'Area Converter', desc: 'Convert square meters, square feet, acres, hectares, and square miles.', icon: Maximize2, path: '/converters/area', count: '6 units' },
  { id: 'volume', name: 'Volume Converter', desc: 'Convert liters, gallons, milliliters, cubic meters, and fluid ounces.', icon: Box, path: '/converters/volume', count: '6 units' },
  { id: 'time', name: 'Time Converter', desc: 'Convert seconds, minutes, hours, days, weeks, months, and years.', icon: Clock, path: '/converters/time', count: '7 units' },
  { id: 'speed', name: 'Speed Converter', desc: 'Convert km/h, mph, meters per second, and knots.', icon: Gauge, path: '/converters/speed', count: '4 units' },
  { id: 'data', name: 'Data Storage Converter', desc: 'Convert Bytes, KB, MB, GB, TB, and PB data metrics.', icon: HardDrive, path: '/converters/data', count: '6 units' },
  { id: 'energy', name: 'Energy Converter', desc: 'Convert Joules, Calories, Kilowatt-hours (kWh), and BTUs.', icon: Zap, path: '/converters/energy', count: '5 units' },
  { id: 'pressure', name: 'Pressure Converter', desc: 'Convert Pascal, Bar, PSI, and Atmospheres.', icon: Compass, path: '/converters/pressure', count: '4 units' },
  { id: 'png-to-jpg', name: 'PNG to JPG Converter', desc: 'Convert transparent PNG images into lightweight JPEG files.', icon: RefreshCw, path: '/converters/png-to-jpg', count: 'Image' },
  { id: 'webp-to-png', name: 'WebP to PNG Converter', desc: 'Decode WebP images into full-quality PNG graphics.', icon: ImageIcon, path: '/converters/webp-to-png', count: 'Image' },
  { id: 'pdf-to-word', name: 'PDF to Word Converter', desc: 'Extract structured text and OCR content into Word document format.', icon: FileText, path: '/pdf-to-word', count: 'Document' },
  { path: '/word-to-pdf', name: 'Word to PDF Converter', desc: 'Compile Word documents into standard vector PDF files.', icon: FileText, id: 'word-to-pdf', count: 'Document' }
];

export default function ConvertersLandingView() {
  return (
    <>
      <HelmetSEOManager 
        titleOverride="Online Unit Converters Directory | ConvertVerse"
        descriptionOverride="Free, fast, client-side unit converters for length, weight, temperature, area, volume, time, speed, data metrics, and document formats."
        pathOverride="/converters"
      />

      <div className="max-w-6xl mx-auto py-12 px-4 space-y-12 text-slate-300">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5" /> 100% Client-Side Conversion Engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Free Online Unit Converters Directory
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Instant, mathematically precise conversion tools operating 100% locally in your browser RAM. Zero server uploads, zero data tracking, and zero subscription limits.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONVERTER_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.path}
                className="group bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900 text-slate-400 border border-slate-700">
                      {cat.count}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Open Converter <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </section>

        <section className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Why Use ConvertVerse Unit Converters?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2 text-base">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Local Calculations
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Calculations execute immediately in your browser using JavaScript math functions without network latency.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2 text-base">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Data Privacy
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Your input numbers and data metrics remain strictly on your physical machine. Zero cloud server logging.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2 text-base">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mobile & Offline Ready
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Fully responsive design built for smartphones, tablets, and desktop computers with PWA offline support.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
