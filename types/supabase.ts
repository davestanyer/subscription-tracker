export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          name: string
          amount: number
          currency: string
          frequency: 'monthly' | 'quarterly' | 'annually'
          next_billing_date: string
          billing_email: string
          status: 'active' | 'cancelled' | 'pending'
          client_id?: string
          local_amount?: number
          local_currency?: string
          exchange_rate?: number
          logo_url?: string
          created_at: string
          updated_at: string
          flagged_for_removal?: boolean
          removal_date?: string
        }
        Insert: {
          id?: string
          name: string
          amount: number
          currency: string
          frequency: 'monthly' | 'quarterly' | 'annually'
          next_billing_date: string
          billing_email: string
          status?: 'active' | 'cancelled' | 'pending'
          client_id?: string
          local_amount?: number
          local_currency?: string
          exchange_rate?: number
          logo_url?: string
          created_at?: string
          updated_at?: string
          flagged_for_removal?: boolean
          removal_date?: string
        }
        Update: {
          id?: string
          name?: string
          amount?: number
          currency?: string
          frequency?: 'monthly' | 'quarterly' | 'annually'
          next_billing_date?: string
          billing_email?: string
          status?: 'active' | 'cancelled' | 'pending'
          client_id?: string
          local_amount?: number
          local_currency?: string
          exchange_rate?: number
          logo_url?: string
          created_at?: string
          updated_at?: string
          flagged_for_removal?: boolean
          removal_date?: string
        }
      }
    }
  }
}