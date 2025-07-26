// API Backend pour Stripe - À déployer sur Vercel/Netlify
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Créer une session de paiement Stripe
exports.createCheckoutSession = async (req, res) => {
  try {
    const { priceId, userEmail, userId, successUrl, cancelUrl } = req.body

    // Créer ou récupérer le client Stripe
    let customer
    try {
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1
      })
      
      if (customers.data.length > 0) {
        customer = customers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            supabase_user_id: userId
          }
        })
      }
    } catch (error) {
      console.error('Erreur création client:', error)
      return res.status(400).json({ error: 'Erreur lors de la création du client' })
    }

    // Créer la session de paiement
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        user_email: userEmail
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          user_email: userEmail
        }
      }
    })

    res.json({ id: session.id })
  } catch (error) {
    console.error('Erreur Stripe:', error)
    res.status(500).json({ error: error.message })
  }
}

// Vérifier le statut d'un paiement
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { session_id } = req.query

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID requis' })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'customer']
    })

    let subscriptionEnd = null
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription.id)
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString()
    }

    res.json({
      payment_status: session.payment_status,
      customer_id: session.customer.id,
      subscription_id: session.subscription?.id,
      subscription_end: subscriptionEnd,
      plan_type: session.metadata?.plan_type || 'monthly',
      amount_total: session.amount_total,
      currency: session.currency
    })
  } catch (error) {
    console.error('Erreur vérification paiement:', error)
    res.status(500).json({ error: error.message })
  }
}

// Créer un portail client Stripe
exports.createCustomerPortal = async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    res.json({ url: portalSession.url })
  } catch (error) {
    console.error('Erreur portail client:', error)
    res.status(500).json({ error: error.message })
  }
}

// Webhook Stripe pour les événements
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Erreur webhook signature:', err.message)
    return res.status(400).send(`Webhook signature verification failed.`)
  }

  // Gérer les événements Stripe
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object
      // Mettre à jour Supabase avec le statut d'abonnement
      console.log('Abonnement mis à jour:', subscription.id)
      break
      
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object
      // Désactiver l'abonnement dans Supabase
      console.log('Abonnement annulé:', deletedSubscription.id)
      break
      
    case 'invoice.payment_succeeded':
      const invoice = event.data.object
      console.log('Paiement réussi:', invoice.id)
      break
      
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object
      console.log('Paiement échoué:', failedInvoice.id)
      break
      
    default:
      console.log(`Événement non géré: ${event.type}`)
  }

  res.json({ received: true })
}
