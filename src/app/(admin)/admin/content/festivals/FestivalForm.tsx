'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { NE_STATES } from '@/types'
import { Info, Search } from 'lucide-react'
import { TextField, Select, Button, ImageAttacher, TagInput } from '@/components/admin/ui'
import type { SelectOption } from '@/components/admin/ui'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })

function MapRecenter({ coords }: { coords: [number, number] }) {
  const { useMap } = require('react-leaflet')
  const map = useMap()
  if (map) map.setView(coords, 13)
  return null
}

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'Cultural', label: 'Cultural' },
  { value: 'Religious', label: 'Religious' },
  { value: 'Music', label: 'Music' },
  { value: 'Food', label: 'Food' },
  { value: 'Tribal', label: 'Tribal' },
]

const STATE_OPTIONS: SelectOption[] = NE_STATES.map(s => ({ value: s, label: s }))

const RECURRENCE_OPTIONS: SelectOption[] = [
  { value: 'Annual', label: 'Annual' },
  { value: 'Seasonal', label: 'Seasonal' },
  { value: 'One-time', label: 'One-time' },
]

const MONTH_OPTIONS: SelectOption[] = [...Array(12)].map((_, i) => ({
  value: String(i + 1),
  label: new Date(0, i).toLocaleString('en', { month: 'long' }),
}))

const CROWD_OPTIONS: SelectOption[] = [
  { value: 'Low', label: 'Low (Quiet)' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High (Energetic)' },
]

interface FestivalFormProps {
  initialData?: Record<string, unknown>
  onSuccess?: () => void
  onCancel?: () => void
}

export default function FestivalForm({ initialData, onSuccess, onCancel }: FestivalFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!initialData?.id

  const [heroFiles, setHeroFiles] = useState<File[]>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [tags, setTags] = useState<string[]>((initialData?.tags as string[]) || [])

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(() => {
    const geo = initialData?.location_geojson
    if (!geo) return null
    return typeof geo === 'string' ? JSON.parse(geo) : (geo as { lat: number; lng: number })
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const L = require('leaflet')
    delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'festivals')
    const res = await apiFetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Upload failed')
    return json.url
  }

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`)
      setSearchResults(await res.json())
    } catch { /* silent */ } finally { setSearching(false) }
  }

  const selectLocation = (r: { lat: string; lon: string; display_name: string }) => {
    setCoords({ lat: parseFloat(r.lat), lng: parseFloat(r.lon) })
    setSearchResults([])
    setSearchQuery(r.display_name)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)

    try {
      let heroUrl = (initialData?.hero_image as string) || ''
      if (heroFiles.length) heroUrl = await uploadFile(heroFiles[0])
      else if (!isEdit) throw new Error('Hero image is required.')

      const uploadedGallery = await Promise.all(galleryFiles.map(uploadFile))
      const existingMedias = (initialData?.medias as string[]) || []

      const payload = {
        name: fd.get('name'),
        slug: fd.get('slug') || fd.get('name')?.toString().toLowerCase().replace(/\s+/g, '-'),
        state: fd.get('state'),
        district: fd.get('district'),
        location: fd.get('location'),
        short_description: fd.get('short_description'),
        description: fd.get('description'),
        type: fd.get('type'),
        start_date: fd.get('start_date'),
        end_date: fd.get('end_date'),
        recurrence_type: fd.get('recurrence_type'),
        month: parseInt(fd.get('month') as string),
        venue_name: fd.get('venue_name'),
        address: fd.get('address'),
        location_geojson: coords,
        hero_image: heroUrl,
        medias: [...existingMedias, ...uploadedGallery],
        videos: (fd.get('videos') as string)?.split(',').map(v => v.trim()).filter(Boolean) || [],
        history: fd.get('history'),
        cultural_significance: fd.get('cultural_significance'),
        rituals: fd.get('rituals'),
        attire: fd.get('attire'),
        food: fd.get('food'),
        entry_fee: fd.get('entry_fee'),
        booking_link: fd.get('booking_link'),
        crowd_level: fd.get('crowd_level'),
        best_day_to_attend: fd.get('best_day_to_attend'),
        duration: fd.get('duration'),
        travel_logistics: fd.get('travel_logistics'),
        accommodation: fd.get('accommodation'),
        safety_guidelines: fd.get('safety_guidelines'),
        tags,
        status: fd.get('status') || 'draft',
      }

      const method = isEdit ? 'PUT' : 'POST'
      const url = isEdit ? `/api/content/festivals/${initialData!.id}` : '/api/content/festivals'

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) onSuccess?.()
      else setError(json.error || 'Failed to save festival')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const MapContainerAny = MapContainer as any
  const TileLayerAny = TileLayer as any
  const MarkerAny = Marker as any
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: '1.25rem' }}>
          <Info size={16} /> {error}
        </div>
      )}

      {/* ── Festival Identity ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Festival Identity</div>
        <div className="admin-form-section-body">
          <TextField
            label="Festival Name"
            name="name"
            required
            defaultValue={initialData?.name as string}
            placeholder="e.g. Hornbill Festival"
          />

          <div className="admin-form-row admin-form-row--2">
            <Select
              label="Festival Type"
              name="type"
              options={TYPE_OPTIONS}
              placeholder="Select Type"
              defaultValue={initialData?.type as string}
            />
            <Select
              label="State"
              name="state"
              required
              options={STATE_OPTIONS}
              placeholder="Select State"
              defaultValue={initialData?.state as string}
            />
          </div>

          <TextField
            label="Short Description"
            hint="For cards"
            name="short_description"
            multiline
            rows={2}
            defaultValue={initialData?.short_description as string}
          />

          <TextField
            label="Detailed Story"
            hint="Full page content"
            name="description"
            multiline
            rows={3}
            defaultValue={initialData?.description as string}
          />
        </div>
      </div>

      {/* ── Scheduling ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Scheduling &amp; Timing</div>
        <div className="admin-form-section-body">
          <div className="admin-form-row admin-form-row--2">
            <TextField
              label="Start Date"
              name="start_date"
              type="date"
              defaultValue={initialData?.start_date as string}
            />
            <TextField
              label="End Date"
              name="end_date"
              type="date"
              defaultValue={initialData?.end_date as string}
            />
          </div>
          <div className="admin-form-row admin-form-row--2">
            <Select
              label="Recurrence"
              name="recurrence_type"
              options={RECURRENCE_OPTIONS}
              defaultValue={(initialData?.recurrence_type as string) || 'Annual'}
            />
            <Select
              label="Month"
              name="month"
              required
              options={MONTH_OPTIONS}
              defaultValue={String(initialData?.month ?? 1)}
            />
          </div>
        </div>
      </div>

      {/* ── Cultural Context ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Cultural Context</div>
        <div className="admin-form-section-body">
          <div className="admin-form-row admin-form-row--2">
            <TextField
              label="Cultural Significance"
              name="cultural_significance"
              multiline
              rows={3}
              defaultValue={initialData?.cultural_significance as string}
            />
            <TextField
              label="History"
              name="history"
              multiline
              rows={3}
              defaultValue={initialData?.history as string}
            />
          </div>
          <div className="admin-form-row admin-form-row--2">
            <TextField
              label="Key Rituals & Activities"
              name="rituals"
              multiline
              rows={3}
              defaultValue={initialData?.rituals as string}
            />
            <TextField
              label="Traditional Attire"
              name="attire"
              multiline
              rows={3}
              defaultValue={initialData?.attire as string}
            />
          </div>
          <TextField
            label="Festive Cuisine"
            name="food"
            multiline
            rows={2}
            defaultValue={initialData?.food as string}
          />
        </div>
      </div>

      {/* ── Visitor & Logistics ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Visitor &amp; Logistics</div>
        <div className="admin-form-section-body">
          <div className="admin-form-row admin-form-row--3">
            <TextField
              label="Entry Fee"
              name="entry_fee"
              defaultValue={initialData?.entry_fee as string}
              placeholder="e.g. Free"
            />
            <Select
              label="Crowd Level"
              name="crowd_level"
              options={CROWD_OPTIONS}
              placeholder="Select Level"
              defaultValue={initialData?.crowd_level as string}
            />
            <TextField
              label="Best Day to Attend"
              name="best_day_to_attend"
              defaultValue={initialData?.best_day_to_attend as string}
              placeholder="e.g. Day 1 (Opening)"
            />
          </div>

          <div className="admin-form-row admin-form-row--2">
            <TextField
              label="How to Reach"
              name="travel_logistics"
              multiline
              rows={2}
              defaultValue={initialData?.travel_logistics as string}
            />
            <TextField
              label="Accommodation"
              name="accommodation"
              multiline
              rows={2}
              defaultValue={initialData?.accommodation as string}
            />
          </div>

          <TextField
            label="Safety Guidelines"
            name="safety_guidelines"
            multiline
            rows={2}
            defaultValue={initialData?.safety_guidelines as string}
          />
        </div>
      </div>

      {/* ── Media ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Media</div>
        <div className="admin-form-section-body">
          <div className="admin-form-row admin-form-row--2">
            <ImageAttacher
              label="Heritage Cover Photo"
              required={!isEdit}
              existingUrl={initialData?.hero_image as string}
              files={heroFiles}
              onChange={setHeroFiles}
            />
            <ImageAttacher
              label="Event Gallery"
              multiple
              hint="Optional highlights"
              files={galleryFiles}
              onChange={setGalleryFiles}
            />
          </div>

          <TextField
            label="Video Links"
            hint="Comma-separated YouTube URLs"
            name="videos"
            defaultValue={(initialData?.videos as string[])?.join(', ')}
            placeholder="https://youtube.com/…"
          />
        </div>
      </div>

      {/* ── Location ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Map &amp; Venue</div>
        <div className="admin-form-section-body">
          <div className="admin-form-row admin-form-row--2">
            <TextField
              label="Venue Name"
              name="venue_name"
              defaultValue={initialData?.venue_name as string}
              placeholder="e.g. Kisama Heritage Village"
            />
            <TextField
              label="Venue Address"
              name="address"
              defaultValue={initialData?.address as string}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                className="admin-input"
                style={{ paddingLeft: '2rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchLocation() } }}
                placeholder="Search location…"
              />
            </div>
            <Button type="button" onClick={handleSearchLocation} loading={searching}>
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div style={{
              background: '#fff',
              border: '1px solid var(--admin-border-standard)',
              borderRadius: 'var(--admin-radius)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}>
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectLocation(r)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                    padding: '0.625rem 0.75rem', background: 'none', border: 'none',
                    borderBottom: '1px solid #f3f4f6', cursor: 'pointer',
                    fontSize: '0.8125rem', color: '#374151', textAlign: 'left',
                  }}
                >
                  <Search size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.display_name}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{ width: '100%', height: 300, borderRadius: 'var(--admin-radius)', overflow: 'hidden', border: '1px solid var(--admin-border-standard)' }}>
            {typeof window !== 'undefined' ? (
              <MapContainerAny center={coords ? [coords.lat, coords.lng] : [26.14, 91.73]} zoom={coords ? 13 : 6} style={{ height: '100%', width: '100%' }}>
                <TileLayerAny url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {coords && <MarkerAny position={[coords.lat, coords.lng]} />}
                {coords && <MapRecenter coords={[coords.lat, coords.lng]} />}
              </MapContainerAny>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f9fafb', color: '#9ca3af', fontStyle: 'italic', fontSize: '0.8125rem' }}>
                Loading map…
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Discovery Tags ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Search &amp; Discovery</div>
        <div className="admin-form-section-body">
          <TagInput
            label="Tags"
            hint="e.g. Trending, Tribal"
            value={tags}
            onChange={setTags}
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="admin-form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Discard
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? 'Update Festival' : 'Publish Festival'}
        </Button>
      </div>
    </form>
  )
}
