import { NE_STATES } from '@/types/enums'

/**
 * NE States with labels for UI select/filter components.
 */
export const NE_STATE_OPTIONS = [
  { value: 'all', label: 'All States' },
  ...NE_STATES.map((state) => ({ value: state, label: state })),
]

export { NE_STATES }
