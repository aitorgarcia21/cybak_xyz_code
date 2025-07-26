import { loadStripe } from '@stripe/stripe-js'

// Configuration Stripe avec variables d'environnement pour Railway
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz'

// Initialiser Stripe
let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey)
  }
  return stripePromise
}

// Configuration du prix CYBAK - Plan Mensuel Uniquement
export const CYBAK_PRICE = {
  id: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || 'price_monthly_cybak',
  amount: 499, // 4.99€ en centimes
  currency: 'eur',
  interval: 'month',
  name: 'CYBAK Premium',
  description: 'Audits de sécurité illimités'
}

// Pour compatibilité avec l'ancien code
export const CYBAK_PRICES = {
  monthly: CYBAK_PRICE
}

// Créer une session de paiement Stripe
export const createCheckoutSession = async (priceId, userEmail, userId) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userEmail,
        userId,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/signup`
      }),
    })

    const session = await response.json()
    
    if (session.error) {
      throw new Error(session.error)
    }

    // Rediriger vers Stripe Checkout
    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error)
    return { error: error.message }
  }
}

// Vérifier le statut d'un paiement
export const checkPaymentStatus = async (sessionId) => {
  try {
    const response = await fetch(`/api/check-payment-status?session_id=${sessionId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error)
    return { error: error.message }
  }
}

// Créer un portail client Stripe
export const createCustomerPortal = async (customerId) => {
  try {
    const response = await fetch('/api/create-customer-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/dashboard`
      }),
    })

    const data = await response.json()
    
    if (data.url) {
      window.location.href = data.url
    }

    return data
  } catch (error) {
    console.error('Erreur lors de la création du portail client:', error)
    return { error: error.message }
  }
}

export default getStripe
