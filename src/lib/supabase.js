import { createClient } from '@supabase/supabase-js'

// Configuration Supabase avec variables d'environnement pour Railway
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://weixdgectjfbdqazcjdg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlaXhkZ2VjdGpmYmRxYXpjamRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTkzMjEsImV4cCI6MjA2ODg3NTMyMX0.5qFaPPGT8420ZtcQUZXVBO7hwmdn7tgYDZpmV_r1NyI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  },

  // Update password
  updatePassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // Users
  users: {
    create: async (userData) => {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
      return { data, error }
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },
    
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    }
  },

  // Audits
  audits: {
    create: async (auditData) => {
      const { data, error } = await supabase
        .from('audits')
        .insert([auditData])
        .select()
      return { data, error }
    },
    
    getByUserId: async (userId) => {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },
    
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('audits')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },
    
    delete: async (id) => {
      const { error } = await supabase
        .from('audits')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Subscriptions
  subscriptions: {
    updateUserSubscription: async (userId, subscriptionData) => {
      const { data, error } = await supabase
        .from('users')
        .update({
          subscription_status: subscriptionData.subscription_status,
          stripe_customer_id: subscriptionData.stripe_customer_id,
          stripe_subscription_id: subscriptionData.stripe_subscription_id,
          plan_type: subscriptionData.plan_type,
          subscription_start: subscriptionData.subscription_start,
          subscription_end: subscriptionData.subscription_end,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()
      return { data, error }
    },

    getUserSubscription: async (userId) => {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_status, stripe_customer_id, stripe_subscription_id, plan_type, subscription_start, subscription_end')
        .eq('id', userId)
        .single()
      return { data, error }
    },

    cancelUserSubscription: async (userId) => {
      const { data, error } = await supabase
        .from('users')
        .update({
          subscription_status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()
      return { data, error }
    }
  }
}
