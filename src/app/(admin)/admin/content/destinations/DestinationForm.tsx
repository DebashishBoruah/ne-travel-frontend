'use client'

import { useState, useRef, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { NE_STATES } from '@/types'
import { Info, UploadCloud, Image as ImageIcon, Plus, X, FileVideo, Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })

// Helper to move map to new location
function MapRecenter({ coords }: { coords: [number, number] }) {
  const { useMap } = require('react-leaflet')
  const map = useMap()
  if (map) map.setView(coords, 13)
  return null
}

interface DestinationFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function DestinationForm({ initialData, onSuccess, onCancel }: DestinationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)

  const [extraFiles, setExtraFiles] = useState<File[]>([])
  const extraInputRef = useRef<HTMLInputElement>(null)

  // Location Picker State
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(
    initialData?.location_geojson ? (typeof initialData.location_geojson === 'string' ? JSON.parse(initialData.location_geojson) : initialData.location_geojson) : 
    initialData?.map_coordinates ? (typeof initialData.map_coordinates === 'string' ? JSON.parse(initialData.map_coordinates) : initialData.map_coordinates) : null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')

  // Leaflet initialization
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
    formData.append('folder', 'destinations')
    
    const res = await apiFetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Upload failed')
    return json.url
  }

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`)
      const data = await res.json()
      setSearchResults(data)
    } catch (err) {
      console.error('Location search failed', err)
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
      if (heroFile) {
        heroUrl = await uploadSingleFile(heroFile)
      } else if (!initialData) {
        throw new Error('Hero image is required.')
      }

      const uploadedExtras = await Promise.all(extraFiles.map(file => uploadSingleFile(file)))
      const finalMedias = [...(initialData?.medias || []), ...uploadedExtras]

      const payload = {
        title: formData.get('title'),
        state: formData.get('state'),
        district: formData.get('district'),
        slug: formData.get('slug') || formData.get('title')?.toString().toLowerCase().replace(/\s+/g, '-'),
        hero_image: heroUrl, 
        description: formData.get('description'),
        short_description: formData.get('short_description'),
        category: formData.get('category'),
        address: formData.get('address'),
        region: formData.get('region'),
        
        // Professional details
        best_time_to_visit: formData.get('best_time_to_visit'),
        entry_fee: formData.get('entry_fee') ? parseFloat(formData.get('entry_fee') as string) : null,
        opening_hours: formData.get('opening_hours'),
        duration: formData.get('duration'),
        difficulty: formData.get('difficulty'),
        weather_info: formData.get('weather_info'),
        safety_tips: formData.get('safety_tips'),
        
        // Media/Geo
        medias: finalMedias,
        videos: (formData.get('videos') as string)?.split(',').map(v => v.trim()).filter(Boolean) || [],
        location_geojson: coords,
        status: formData.get('status') || 'draft',
        
        // SEO
        meta_title: formData.get('meta_title'),
        meta_description: formData.get('meta_description'),
        keywords: (formData.get('keywords') as string)?.split(',').map(k => k.trim()).filter(Boolean) || [],
        tags: tags
      }

      const method = initialData?.id ? 'PUT' : 'POST'
      const url = initialData?.id ? `/api/content/destinations/${initialData.id}` : '/api/content/destinations'

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const json = await res.json()
      if (json.success) {
        if (onSuccess) onSuccess()
      } else {
        setError(json.error || 'Failed to save destination')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
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
        <div className="bg-rose-50 text-rose-600 border border-rose-200 rounded-lg p-4 mb-6 flex gap-3 items-center text-sm font-medium">
          <Info size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Core Management */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 className="text-sm font-bold text-admin-text-main uppercase tracking-wider">Destination Identity</h3>
          </div>
          
          <div className="admin-card-body grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="admin-form-group col-span-full">
              <label className="admin-label">Place Name <span className="text-rose-500">*</span></label>
              <input type="text" name="title" defaultValue={initialData?.title} required className="admin-input text-lg font-semibold" placeholder="e.g. Dawki River" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Category</label>
              <select name="category" defaultValue={initialData?.category} className="admin-input admin-select">
                <option value="">Select Category</option>
                <option value="Waterfall">Waterfall</option>
                <option value="Hill Station">Hill Station</option>
                <option value="Temple">Temple</option>
                <option value="Trek">Trek</option>
                <option value="Cafe">Café</option>
                <option value="Hidden Gem">Hidden Gem</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">State <span className="text-rose-500">*</span></label>
              <select name="state" defaultValue={initialData?.state} required className="admin-input admin-select">
                <option value="">Select State</option>
                {NE_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Region (State → District → Village)</label>
              <input type="text" name="region" defaultValue={initialData?.region} className="admin-input" placeholder="e.g. Meghalaya, West Jaintia Hills" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Address</label>
              <input type="text" name="address" defaultValue={initialData?.address} className="admin-input" placeholder="Nearby Landmark" />
            </div>
          </div>
        </div>

        {/* Experience & Logistics */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 className="text-sm font-bold text-admin-text-main uppercase tracking-wider">Experience & Logistics</h3>
          </div>
          
          <div className="admin-card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="admin-form-group">
                <label className="admin-label">Best Time to Visit</label>
                <input type="text" name="best_time_to_visit" defaultValue={initialData?.best_time_to_visit || initialData?.best_season} className="admin-input" placeholder="Oct - Mar" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Entry Fee (₹)</label>
                <input type="number" name="entry_fee" defaultValue={initialData?.entry_fee} className="admin-input" placeholder="0 for Free" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Difficulty (for Treks)</label>
                <select name="difficulty" defaultValue={initialData?.difficulty} className="admin-input admin-select">
                  <option value="">N/A</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="admin-form-group">
                <label className="admin-label">Short Description (for cards)</label>
                <textarea name="short_description" defaultValue={initialData?.short_description} rows={3} className="admin-input" placeholder="2-3 lines about this place..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Detailed Storytelling (Page Content)</label>
                <textarea name="description" defaultValue={initialData?.description} rows={3} className="admin-input" placeholder="Describe the immersive experience..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="admin-form-group text-xs">
                <label className="admin-label">Weather Info</label>
                <textarea name="weather_info" defaultValue={initialData?.weather_info} rows={2} className="admin-input" />
              </div>
              <div className="admin-form-group text-xs">
                <label className="admin-label">Safety Tips</label>
                <textarea name="safety_tips" defaultValue={initialData?.safety_tips} rows={2} className="admin-input" />
              </div>
            </div>
          </div>
        </div>

        {/* Media Engine */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 className="text-sm font-bold text-admin-text-main uppercase tracking-wider">Media Engine</h3>
          </div>
          
          <div className="admin-card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="admin-form-group">
                <label className="admin-label">Primary Hero Image <span className="text-rose-500">*</span></label>
                <div 
                  onClick={() => heroInputRef.current?.click()}
                  className="admin-input flex flex-col items-center justify-center gap-3 cursor-pointer border-dashed border-2 py-8 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  {(heroFile || initialData?.hero_image) ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-admin-border-standard">
                         <img src={heroFile ? URL.createObjectURL(heroFile) : initialData.hero_image} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-admin-text-main truncate max-w-[200px]">{heroFile ? heroFile.name : 'Change Cover Photo'}</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="text-admin-primary" size={24} />
                      <span className="text-sm font-medium text-admin-text-subtle">Upload Cover Image</span>
                    </>
                  )}
                </div>
                <input type="file" ref={heroInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => e.target.files && setHeroFile(e.target.files[0])} />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Gallery Highlights</label>
                <div 
                  onClick={() => extraInputRef.current?.click()}
                  className="admin-input flex flex-col items-center justify-center gap-3 cursor-pointer border-dashed border-2 py-8 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
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
                      <span className="text-sm font-medium text-admin-text-subtle">Add Gallery Photos</span>
                    </>
                  )}
                </div>
                <input type="file" ref={extraInputRef} multiple style={{ display: 'none' }} accept="image/*" onChange={(e) => e.target.files && setExtraFiles([...extraFiles, ...Array.from(e.target.files)])} />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Video Links (Comma separated YouTube URLS)</label>
              <input type="text" name="videos" defaultValue={initialData?.videos?.join(', ')} className="admin-input" placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>

        {/* Geo Engine */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 className="text-sm font-bold text-admin-text-main uppercase tracking-wider">Geo Intelligence</h3>
          </div>
          
          <div className="admin-card-body">
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-placeholder" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                  className="admin-input pl-10"
                  placeholder="Locate on Map..."
                />
              </div>
              <button type="button" onClick={handleSearchLocation} className="admin-btn admin-btn-secondary" style={{ flexShrink: 0 }}>{searching ? '...' : 'Search'}</button>
            </div>

            {searchResults.length > 0 && (
              <div className="absolute z-50 w-full max-w-[400px] mt-[-1.5rem] bg-white border border-admin-border-standard rounded-lg shadow-xl overflow-hidden animate-fade-in">
                {searchResults.map((r, i) => (
                  <div key={i} onClick={() => selectLocation(r)} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 text-sm flex gap-3 items-center">
                    <Search size={14} className="text-gray-400" />
                    <span className="truncate">{r.display_name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="w-full h-[400px] rounded-xl overflow-hidden border border-admin-border-standard shadow-sm">
              {typeof window !== 'undefined' ? (
                <MapContainerAny center={coords ? [coords.lat, coords.lng] : [26.14, 91.73]} zoom={coords ? 13 : 6} style={{ height: '100%', width: '100%' }}>
                  <TileLayerAny url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {coords && <MarkerAny position={[coords.lat, coords.lng]} />}
                  {coords && <MapRecenter coords={[coords.lat, coords.lng]} />}
                </MapContainerAny>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400 italic">Initializing map engine...</div>
              )}
            </div>
          </div>
        </div>

        {/* SEO & Discovery */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 className="text-sm font-bold text-admin-text-main uppercase tracking-wider">SEO & Discovery</h3>
          </div>
          
          <div className="admin-card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="admin-form-group">
                <label className="admin-label">Meta Title</label>
                <input type="text" name="meta_title" defaultValue={initialData?.meta_title} className="admin-input" placeholder="SEO Title..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Slug (URL friendly)</label>
                <input type="text" name="slug" defaultValue={initialData?.slug} className="admin-input bg-gray-50/50" placeholder="auto-generated-slug" />
              </div>
            </div>

            <div className="admin-form-group mb-8">
              <label className="admin-label">Meta Description</label>
              <textarea name="meta_description" defaultValue={initialData?.meta_description} rows={2} className="admin-input" placeholder="Short SEO description..." />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Discovery Tags ('hidden gem', 'adventure', etc.)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="admin-input" 
                  placeholder="Type and press Enter..." 
                />
                <button type="button" onClick={handleAddTag} className="admin-btn admin-btn-secondary">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map(t => (
                  <span key={t} className="admin-badge admin-badge-emerald flex gap-2 items-center normal-case py-1.5 px-3">
                    {t} <X size={12} className="cursor-pointer hover:text-rose-500 transition-colors" onClick={() => removeTag(t)} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-8 border-t border-admin-border-standard">
          <button type="button" onClick={onCancel} className="admin-btn admin-btn-secondary" style={{ flex: 1 }}>Discard Changes</button>
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
            {loading ? 'Processing...' : initialData ? 'Update Destination' : 'Publish Destination'}
          </button>
        </div>
      </form>
    </div>
  )
}
