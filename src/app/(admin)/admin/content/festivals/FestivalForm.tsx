'use client'

import { useState, useRef, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { NE_STATES } from '@/types'
import { Info, UploadCloud, Image as ImageIcon, Plus, X, Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })

// Helper to move map
function MapRecenter({ coords }: { coords: [number, number] }) {
  const { useMap } = require('react-leaflet')
  const map = useMap()
  if (map) map.setView(coords, 13)
  return null
}

interface FestivalFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FestivalForm({ initialData, onSuccess, onCancel }: FestivalFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)
  const [extraFiles, setExtraFiles] = useState<File[]>([])
  const extraInputRef = useRef<HTMLInputElement>(null)

  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(
    initialData?.location_geojson ? (typeof initialData.location_geojson === 'string' ? JSON.parse(initialData.location_geojson) : initialData.location_geojson) : null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }, [])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (t: string) => setTags(tags.filter(item => item !== t))

  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'festivals')
    const res = await apiFetch('/api/upload', { method: 'POST', body: formData })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Upload failed')
    return json.url
  }

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=3`)
      setSearchResults(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  const selectLocation = (result: any) => {
    setCoords({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) })
    setSearchResults([])
    setSearchQuery(result.display_name)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    try {
      let heroUrl = initialData?.hero_image || ''
      if (heroFile) heroUrl = await uploadSingleFile(heroFile)
      else if (!initialData) throw new Error('Hero image is required.')

      const uploadedExtras = await Promise.all(extraFiles.map(file => uploadSingleFile(file)))
      const finalMedias = [...(initialData?.medias || []), ...uploadedExtras]

      const payload = {
        name: formData.get('name'),
        slug: formData.get('slug') || formData.get('name')?.toString().toLowerCase().replace(/\s+/g, '-'),
        state: formData.get('state'),
        district: formData.get('district'),
        location: formData.get('location'),
        short_description: formData.get('short_description'),
        description: formData.get('description'),
        type: formData.get('type'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        recurrence_type: formData.get('recurrence_type'),
        month: parseInt(formData.get('month') as string),
        venue_name: formData.get('venue_name'),
        address: formData.get('address'),
        location_geojson: coords,
        hero_image: heroUrl,
        medias: finalMedias,
        videos: (formData.get('videos') as string)?.split(',').map(v => v.trim()).filter(Boolean) || [],
        history: formData.get('history'),
        cultural_significance: formData.get('cultural_significance'),
        rituals: formData.get('rituals'),
        attire: formData.get('attire'),
        food: formData.get('food'),
        entry_fee: formData.get('entry_fee'),
        booking_link: formData.get('booking_link'),
        crowd_level: formData.get('crowd_level'),
        best_day_to_attend: formData.get('best_day_to_attend'),
        duration: formData.get('duration'),
        travel_logistics: formData.get('travel_logistics'),
        accommodation: formData.get('accommodation'),
        safety_guidelines: formData.get('safety_guidelines'),
        tags: tags,
        status: formData.get('status') || 'draft'
      }

      const method = initialData?.id ? 'PUT' : 'POST'
      const url = initialData?.id ? `/api/content/festivals/${initialData.id}` : '/api/content/festivals'

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const json = await res.json()
      if (json.success) onSuccess?.()
      else setError(json.error || 'Failed to save festival')
    } catch (err: any) {
      setError(err.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const MapContainerAny = MapContainer as any;
  const TileLayerAny = TileLayer as any;
  const MarkerAny = Marker as any;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.8125rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Info size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Core Info */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Festival Identity</h3>
          </div>
          <div className="admin-card-body">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="admin-form-group col-span-full">
              <label className="admin-label">Festival Name <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="text" name="name" defaultValue={initialData?.name} required className="admin-input" placeholder="e.g. Hornbill Festival" style={{ fontWeight: 600 }} />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Festival Type</label>
              <select name="type" defaultValue={initialData?.type} className="admin-input admin-select">
                <option value="">Select Type</option>
                <option value="Cultural">Cultural</option>
                <option value="Religious">Religious</option>
                <option value="Music">Music</option>
                <option value="Food">Food</option>
                <option value="Tribal">Tribal</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">State <span style={{ color: '#dc2626' }}>*</span></label>
              <select name="state" defaultValue={initialData?.state} required className="admin-input admin-select">
                <option value="">Select State</option>
                {NE_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="admin-form-group col-span-full">
              <label className="admin-label">Short Description (for cards)</label>
              <textarea name="short_description" defaultValue={initialData?.short_description} rows={2} className="admin-input" />
            </div>

            <div className="admin-form-group col-span-full">
              <label className="admin-label">Detailed Story (Full Description)</label>
              <textarea name="description" defaultValue={initialData?.description} rows={3} className="admin-input" />
            </div>
          </div>
          </div>
        </div>

        {/* Date & Timing */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheduling & Dynamics</h3>
          </div>
          <div className="admin-card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="admin-form-group">
              <label className="admin-label">Start Date</label>
              <input type="date" name="start_date" defaultValue={initialData?.start_date} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">End Date</label>
              <input type="date" name="end_date" defaultValue={initialData?.end_date} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Recurrence</label>
              <select name="recurrence_type" defaultValue={initialData?.recurrence_type || 'Annual'} className="admin-input admin-select">
                <option value="Annual">Annual</option>
                <option value="Seasonal">Seasonal</option>
                <option value="One-time">One-time</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Month</label>
              <select name="month" defaultValue={initialData?.month || 1} required className="admin-input admin-select">
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

        {/* Cultural Immersion */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cultural Context</h3>
          </div>
          <div className="admin-card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="admin-form-group">
                <label className="admin-label">Cultural Significance</label>
                <textarea name="cultural_significance" defaultValue={initialData?.cultural_significance} rows={3} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">History of the Festival</label>
                <textarea name="history" defaultValue={initialData?.history} rows={3} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Key Rituals & Activities</label>
                <textarea name="rituals" defaultValue={initialData?.rituals} rows={3} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Traditional Attire</label>
                <textarea name="attire" defaultValue={initialData?.attire} rows={3} className="admin-input" />
              </div>
              <div className="admin-form-group col-span-full">
                <label className="admin-label">Festive Cuisine</label>
                <textarea name="food" defaultValue={initialData?.food} rows={2} className="admin-input" />
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Logistics */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visitor & Logistics Info</h3>
          </div>
          <div className="admin-card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="admin-form-group">
                <label className="admin-label">Entry Fee</label>
                <input type="text" name="entry_fee" defaultValue={initialData?.entry_fee} className="admin-input" placeholder="e.g. Free" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Crowd Level</label>
                <select name="crowd_level" defaultValue={initialData?.crowd_level} className="admin-input admin-select">
                  <option value="">Select Level</option>
                  <option value="Low">Low (Quiet)</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Energetic)</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Best Day to Attend</label>
                <input type="text" name="best_day_to_attend" defaultValue={initialData?.best_day_to_attend} className="admin-input" placeholder="e.g. Day 1 (Opening)" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="admin-form-group">
                <label className="admin-label">How to Reach</label>
                <textarea name="travel_logistics" defaultValue={initialData?.travel_logistics} rows={2} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Accommodation</label>
                <textarea name="accommodation" defaultValue={initialData?.accommodation} rows={2} className="admin-input" />
              </div>
              <div className="admin-form-group col-span-full">
                <label className="admin-label">Safety Guidelines</label>
                <textarea name="safety_guidelines" defaultValue={initialData?.safety_guidelines} rows={2} className="admin-input" />
              </div>
            </div>
          </div>
        </div>

        {/* Media Engine */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Media System</h3>
          </div>
          <div className="admin-card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="admin-form-group">
                <label className="admin-label">Heritage Cover Photo <span style={{ color: '#dc2626' }}>*</span></label>
                <div onClick={() => heroInputRef.current?.click()} className="admin-input flex flex-col items-center justify-center gap-3 cursor-pointer border-dashed border-2 py-8 bg-gray-50/50 hover:bg-gray-50 transition-colors" style={{ height: 'auto' }}>
                  {(heroFile || initialData?.hero_image) ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-admin-border-standard">
                        <img src={heroFile ? URL.createObjectURL(heroFile) : initialData.hero_image} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-admin-text-main truncate max-w-[200px]">{heroFile ? heroFile.name : 'Change Heritage Photo'}</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="text-admin-primary" size={24} />
                      <span className="text-sm font-medium text-admin-text-subtle">Upload Heritage Photo</span>
                    </>
                  )}
                </div>
                <input type="file" ref={heroInputRef} style={{ display: 'none' }} onChange={(e) => e.target.files && setHeroFile(e.target.files[0])} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Event Highlights (Gallery)</label>
                <div onClick={() => extraInputRef.current?.click()} className="admin-input flex flex-col items-center justify-center gap-3 cursor-pointer border-dashed border-2 py-8 bg-gray-50/50 hover:bg-gray-50 transition-colors" style={{ height: 'auto' }}>
                  {extraFiles.length > 0 ? (
                    <div className="flex items-center gap-2">
                       <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                         <ImageIcon size={18} />
                       </div>
                       <span className="text-sm font-medium text-admin-text-main">{extraFiles.length} photos added</span>
                    </div>
                  ) : (
                    <>
                      <Plus className="text-admin-text-subtle" size={24} />
                      <span className="text-sm font-medium text-admin-text-subtle">Add Gallery Assets</span>
                    </>
                  )}
                </div>
                <input type="file" ref={extraInputRef} multiple style={{ display: 'none' }} onChange={(e) => e.target.files && setExtraFiles([...extraFiles, ...Array.from(e.target.files)])} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Video Clips (Comma separated YouTube URLs)</label>
              <input type="text" name="videos" defaultValue={initialData?.videos?.join(', ')} className="admin-input" placeholder="Highlight reels URL" />
            </div>
          </div>
        </div>

        {/* Geo Engine */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Map & Venue Intelligence</h3>
          </div>
          <div className="admin-card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="admin-form-group">
                <label className="admin-label">Venue Name</label>
                <input type="text" name="venue_name" defaultValue={initialData?.venue_name} className="admin-input" placeholder="e.g. Kisama Heritage Village" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Full Venue Address</label>
                <input type="text" name="address" defaultValue={initialData?.address} className="admin-input" />
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-placeholder)' }} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())} className="admin-input pl-10" placeholder="Locate on Map..." />
              </div>
              <button type="button" onClick={handleSearchLocation} className="admin-btn admin-btn-secondary" style={{ flexShrink: 0 }}>{searching ? '...' : 'Search'}</button>
            </div>
            <div className="w-full h-[400px] rounded-xl overflow-hidden border border-admin-border-standard shadow-sm">
              {typeof window !== 'undefined' ? (
                <MapContainerAny center={coords ? [coords.lat, coords.lng] : [26.14, 91.73]} zoom={coords ? 13 : 6} style={{ height: '100%', width: '100%' }}>
                  <TileLayerAny url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {coords && <MarkerAny position={[coords.lat, coords.lng]} />}
                  {coords && <MapRecenter coords={[coords.lat, coords.lng]} />}
                </MapContainerAny>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-text-subtle)', fontStyle: 'italic' }}>Initializing map engine...</div>
              )}
            </div>
          </div>
        </div>

        {/* Discovery & Tags */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Search & Discovery</h3>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} 
                  className="admin-input" 
                  placeholder="e.g. Trending, Tribal" 
                />
                <button type="button" onClick={handleAddTag} className="admin-btn admin-btn-secondary" style={{ flexShrink: 0 }}>Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map(t => (
                  <span key={t} className="admin-badge admin-badge-emerald flex gap-2 items-center normal-case py-1.5 px-3">
                    {t} <X size={12} className="cursor-pointer" onClick={() => removeTag(t)} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border-standard)' }}>
          <button type="button" onClick={onCancel} className="admin-btn admin-btn-secondary" style={{ flex: 1 }}>Discard Changes</button>
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
            {loading ? 'Processing...' : initialData ? 'Update Festival' : 'Publish Festival'}
          </button>
        </div>
      </form>
    </div>
  )
}
