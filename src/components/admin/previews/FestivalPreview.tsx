'use client'

import React from 'react'
import { Calendar, MapPin, Music, Info, Navigation, Share2 } from 'lucide-react'

interface FestivalPreviewProps {
  data: any
}

export default function FestivalPreview({ data }: FestivalPreviewProps) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 animate-fade-in font-inter">
      {/* Hero Section */}
      <div className="relative h-[450px] bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(245,158,11,0.15),transparent_50%)] z-10" />
        {data.hero_image ? (
          <img src={data.hero_image} alt={data.name} className="w-full h-full object-cover opacity-70" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-4">
            <Music size={64} className="opacity-20" />
            <span className="font-bold uppercase tracking-widest text-xs">No festival image uploaded</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent flex items-end p-12 lg:p-16 z-20">
          <div className="text-white max-w-4xl">
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                {data.state}
              </span>
              <span className="px-4 py-1.5 bg-saffron-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-saffron-500/20">
                Cultural Festival
              </span>
            </div>
            <h1 className="text-6xl font-black mb-6 font-outfit tracking-tighter leading-none max-w-3xl">
              {data.name}
            </h1>
            <div className="flex gap-8 text-base font-medium text-slate-300">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-saffron-400" />
                <span>Month: <span className="text-white font-bold">{data.month || 'Not specified'}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 p-12 lg:p-20">
        <div className="space-y-16">
          {/* About */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-8 font-outfit uppercase tracking-tight">The Celebration</h2>
            <div className="text-xl text-slate-600 leading-[1.8] font-medium whitespace-pre-wrap">
              {data.description || 'No description provided.'}
            </div>
          </section>

          {/* Cultural Significance */}
          {data.cultural_significance && (
            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-8 font-outfit uppercase tracking-tight">Heritage & Meaning</h2>
              <div className="p-10 bg-saffron-50 rounded-[2.5rem] border-2 border-dashed border-saffron-200">
                <div className="text-2xl text-saffron-900 font-black italic font-outfit tracking-tight leading-relaxed text-center">
                  "{data.cultural_significance}"
                </div>
              </div>
            </section>
          )}

          {/* Key Activities */}
          {data.key_activities && (
            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-8 font-outfit uppercase tracking-tight">Key Highlights</h2>
              <div className="text-xl text-slate-600 leading-[1.8] font-medium whitespace-pre-wrap bg-slate-50 p-8 rounded-3xl border border-slate-100">
                {data.key_activities}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-saffron-500/20 transition-colors" />
            <h3 className="text-saffron-400 text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
               <Info size={18} /> Festival Ledger
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-saffron-500 border border-white/10">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-0.5">Timeline</p>
                  <p className="text-lg font-black text-white leading-none font-outfit">{data.month}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-saffron-500 border border-white/10">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-0.5">Location</p>
                  <p className="text-lg font-black text-white leading-none font-outfit">{data.state}</p>
                </div>
              </div>
            </div>
            <button className="w-full py-4 bg-saffron-500 hover:bg-saffron-600 active:scale-95 rounded-2xl font-black text-sm uppercase tracking-widest mt-12 transition-all shadow-xl shadow-saffron-500/30 text-white">
              Explore Packages
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">Interaction</h3>
            <div className="flex gap-4">
              <button className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors flex-1 flex flex-col items-center gap-2 text-slate-900 border border-transparent hover:border-slate-200 group">
                <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-black tracking-widest">Invite</span>
              </button>
              <button className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors flex-1 flex flex-col items-center gap-2 text-slate-900 border border-transparent hover:border-slate-200 group">
                <Navigation size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-black tracking-widest">Route</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
