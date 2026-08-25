// ============================================================
//  Contact Form → Supabase Integration
//  Saves form submissions to the "messages" table in Supabase
// ============================================================

import { supabase } from './supabase.js'

const form = document.querySelector('.contact-form')
const submitBtn = form?.querySelector('.form-submit-btn')
const btnText = submitBtn?.querySelector('span')

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // Get form values
    const name = form.querySelector('#name').value.trim()
    const email = form.querySelector('#email').value.trim()
    const subject = form.querySelector('#subject').value.trim()
    const message = form.querySelector('#message').value.trim()

    // Validate
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all fields.', 'error')
      return
    }

    // Disable button & show loading state
    submitBtn.disabled = true
    const originalText = btnText.textContent
    btnText.textContent = 'Sending...'
    submitBtn.style.opacity = '0.7'

    try {
      // Insert message into Supabase "messages" table
      const { data, error } = await supabase
        .from('messages')
        .insert([{ name, email, subject, message }])

      if (error) throw error

      // Success!
      showStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success')
      form.reset()

    } catch (err) {
      console.error('Supabase Error:', err)
      showStatus('❌ Failed to send message. Please try again or email me directly.', 'error')

    } finally {
      // Re-enable button
      submitBtn.disabled = false
      btnText.textContent = originalText
      submitBtn.style.opacity = '1'
    }
  })
}

// ── Status Message Display ──────────────────────────────────

function showStatus(message, type) {
  // Remove existing status message if any
  const existing = document.querySelector('.form-status-msg')
  if (existing) existing.remove()

  const statusEl = document.createElement('div')
  statusEl.className = 'form-status-msg'
  statusEl.textContent = message
  statusEl.style.cssText = `
    margin-top: 1.2rem;
    padding: 1.2rem 1.6rem;
    border-radius: 1rem;
    font-size: 1.4rem;
    font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    text-align: center;
    animation: fadeIn 0.3s ease;
    ${type === 'success'
      ? 'background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3);'
      : 'background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);'
    }
  `

  form.appendChild(statusEl)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    statusEl.style.opacity = '0'
    statusEl.style.transition = 'opacity 0.3s ease'
    setTimeout(() => statusEl.remove(), 300)
  }, 5000)
}
