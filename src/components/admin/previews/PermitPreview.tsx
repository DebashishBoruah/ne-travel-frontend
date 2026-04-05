'use client'

import React from 'react'
import { Shield, CheckCircle2, Clock, FileText, Info, AlertCircle } from 'lucide-react'

interface PermitPreviewProps {
  data: any
}

export default function PermitPreview({ data }: PermitPreviewProps) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 font-inter animate-fade-in mb-12">
      {/* Header */}
      <div className="p-16 lg:p-24 bg-slate-950 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest-500/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-forest-500/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 bg-forest-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-forest-500/30 border border-forest-400/30 transition-transform hover:scale-110">
              <Shield size={32} className="text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 text-forest-400 text-center w-fit">
                Official Protocol
              </span>
              <p className="text-sm font-bold text-slate-500 italic">Travel Regulation Guide</p>
            </div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 font-outfit tracking-tighter leading-none max-w-4xl text-white">
            Travel Permits for <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-400 to-emerald-300">{data.state}</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl border-l-2 border-forest-800 pl-6 py-2">
            Detailed requirements for {data.permit_type || 'Inner Line Permits'} to ensure seamless entry into the protected regions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-16 lg:p-24 grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-20">
          {/* Who Needs It */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white"><Info size={20} /></div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight font-outfit">Scope of Regulation</h2>
            </div>
            <div className="text-2xl text-slate-700 leading-relaxed font-medium bg-slate-50 p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Shield size={80} />
              </div>
              {data.who_needs_it || 'Regulatory scope pending definition.'}
            </div>
          </section>

          {/* How to Apply */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white"><FileText size={20} /></div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight font-outfit">Application Protocol</h2>
            </div>
            <div className="space-y-6">
              {data.how_to_apply?.split('\n').map((step: string, i: number) => (
                <div key={i} className="flex gap-6 p-6 hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-200 group">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-sm font-black text-slate-900 shrink-0 group-hover:bg-slate-950 group-hover:text-white transition-colors uppercase tracking-widest">{i + 1}</div>
                  <p className="text-xl text-slate-600 font-medium self-center">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Requirements Card */}
          <div className="bg-forest-600 p-10 rounded-[2.5rem] shadow-2xl shadow-forest-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={120} className="text-white" />
            </div>
            <h3 className="text-xs font-black text-white/60 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              Verified Document Checklist
            </h3>
            <ul className="space-y-5 relative z-10">
              {data.documents_required?.map((doc: string, i: number) => (
                <li key={i} className="flex items-start gap-4 text-lg font-black text-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-forest-400 mt-2 shrink-0 border-2 border-white/30" />
                  {doc}
                </li>
              )) || <li className="text-white/40 italic text-sm">Waiting for document list...</li>}
            </ul>
          </div>

          {/* Stats Card */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400"><Clock size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Response Time</p>
                <p className="text-xl font-black text-slate-900 font-outfit">{data.processing_time || 'Variable'}</p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100 flex items-center gap-3 text-slate-500 italic text-xs font-bold uppercase tracking-widest leading-relaxed">
              <AlertCircle size={16} className="text-saffron-500 shrink-0" /> Application lead time: 7-10 days recommended.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
