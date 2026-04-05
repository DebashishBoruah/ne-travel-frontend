export type { PayoutStatus } from '@/types'

export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  status: string
}

export interface CreateOrderPayload {
  amount: number
  booking_id: string
  homestay_owner_amount?: number
  operator_amount?: number
}
