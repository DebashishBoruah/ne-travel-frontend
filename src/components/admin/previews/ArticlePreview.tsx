'use client'

import React from 'react'
import { Calendar, User, Tag, Clock, Share2, Bookmark } from 'lucide-react'
import { format } from 'date-fns'

interface ArticlePreviewProps {
  data: any
}

export default function ArticlePreview({ data }: ArticlePreviewProps) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 font-inter animate-fade-in">
      {/* Hero Header */}
      <div className="relative h-[550px] group">
        {data.hero_image ? (
          <img src={data.hero_image} alt={data.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">No cover image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
        
        <div className="absolute bottom-0 left-0 right-0 p-12 lg:p-20 text-white z-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="px-5 py-2 bg-forest-600 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-forest-500/20">{data.category || 'Story'}</span>
            <span className="flex items-center gap-2 text-sm text-slate-300 font-black tracking-widest uppercase">
              <Clock size={16} /> 5 min read
            </span>
          </div>
          <h1 className="text-6xl font-black mb-10 leading-[1.05] font-outfit max-w-5xl tracking-tighter text-white">
            {data.title}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 border-t border-white/10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center text-forest-700 font-black text-xl border-2 border-white/30 shadow-lg">
                {data.author?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-lg font-black text-white font-outfit">{data.author || 'Administrative Editor'}</p>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Published on {format(new Date(), 'MMM d, yyyy')}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-all border border-white/10"><Share2 size={22} /></button>
              <button className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-all border border-white/10"><Bookmark size={22} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto py-24 px-10">
        <div className="article-body text-xl lg:text-2xl leading-[1.9] text-slate-700 font-medium font-serif space-y-10 first-letter:text-7xl first-letter:font-black first-letter:text-forest-600 first-letter:mr-4 first-letter:float-left first-letter:leading-none first-letter:font-outfit">
          {data.body ? data.body.split('\n\n').map((para: string, i: number) => (
            <p key={i} className="mb-8">{para}</p>
          )) : 'Waiting for narrative content...'}
        </div>

        {/* Tags / Footer */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap gap-3">
          {['Authentic Northeast', data.state, data.category].filter(Boolean).map(tag => (
            <span key={tag} className="px-6 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
