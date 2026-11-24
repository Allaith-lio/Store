const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const SESSION_KEY = 'currentUser'
const TOKEN_KEY = 'accessToken'

function notifyAuthChange() {
  window.dispatchEvent(new Event('authchange'))
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getBackendAssetUrl(path) {
  return new URL(path, `${API_BASE_URL}/`).toString()
}

export async function apiRequest(path, { method = 'GET', body, authenticated = true } = {}) {
  const headers = { Accept: 'application/json' }
  const token = authenticated ? getAccessToken() : null
  if (token) headers.Authorization = `Bearer ${token}`
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      ...(body !== undefined && {
        body: isFormData ? body : JSON.stringify(body),
      }),
    })
  } catch {
    throw new Error('The service is temporarily unavailable. Please try again shortly.')
  }

  const responseBody = await response.json().catch(() => null)
  if (!response.ok) {
    const message = Array.isArray(responseBody?.message)
      ? responseBody.message.join(', ')
      : responseBody?.message
    throw new Error(message || `Backend request failed (${response.status}).`)
  }
  return responseBody
}

function normalizeUser(user, avatar = '') {
  const firstName = user.profile?.firstName || ''
  const lastName = user.profile?.lastName || ''
  return {
    id: user.id || user._id,
    name: [firstName, lastName].filter(Boolean).join(' ') || user.email,
    email: user.email,
    phone: user.profile?.phone || '',
    avatar,
    role: user.role,
    profile: user.profile || {},
  }
}

function saveSession(accessToken, user) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  notifyAuthChange()
  return user
}

export function getCurrentUser() {
  const value = localStorage.getItem(SESSION_KEY)
  return value ? JSON.parse(value) : null
}

export async function getAdminUsers() {
  return apiRequest('/users')
}

export function getStoreOrders() {
  return []
}

export async function registerUser({ name, email, password, avatar = '' }) {
  const [firstName, ...lastName] = name.trim().split(/\s+/)
  const result = await apiRequest('/auth/register', {
    method: 'POST',
    authenticated: false,
    body: {
      email: email.trim().toLowerCase(),
      password,
      firstName,
      ...(lastName.length && { lastName: lastName.join(' ') }),
    },
  })
  return saveSession(result.accessToken, normalizeUser(result.user, avatar))
}

export async function loginUser({ email, password }) {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    authenticated: false,
    body: { email: email.trim().toLowerCase(), password },
  })
  return saveSession(
    result.accessToken,
    normalizeUser(result.user, getCurrentUser()?.avatar || ''),
  )
}

export async function verifyCurrentPassword(password) {
  const currentUser = getCurrentUser()
  if (!currentUser) return false
  await loginUser({ email: currentUser.email, password })
  return true
}

export async function updateCurrentUser(updates) {
  const currentUser = getCurrentUser()
  if (!currentUser) throw new Error('Please sign in to update your profile.')

  const [firstName, ...lastName] = (updates.name || '').trim().split(/\s+/)
  const result = await apiRequest('/users/me', {
    method: 'PATCH',
    body: {
      ...(updates.email && { email: updates.email.trim().toLowerCase() }),
      ...(updates.name && { firstName, lastName: lastName.join(' ') }),
      ...(updates.phone !== undefined && { phone: updates.phone.trim() }),
    },
  })
  return saveSession(
    getAccessToken(),
    normalizeUser(result, updates.avatar ?? currentUser.avatar),
  )
}

export async function logoutUser() {
  if (getAccessToken()) await apiRequest('/auth/logout', { method: 'POST' })
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(SESSION_KEY)
  notifyAuthChange()
}

function mapAddress(address) {
  return {
    id: address._id,
    label: address.label || '',
    fullName: address.recipientName,
    address: address.street,
    city: address.city,
    region: address.region || '',
    postalCode: address.postalCode || '',
    country: address.country,
    phone: address.phone,
    isDefault: address.isDefault,
  }
}

function addressRequestBody(address) {
  return {
    label: address.label,
    recipientName: address.fullName,
    phone: address.phone,
    street: address.address,
    city: address.city,
    region: address.region,
    postalCode: address.postalCode,
    country: address.country,
    isDefault: address.isDefault,
  }
}

export async function getSavedAddresses() {
  const addresses = await apiRequest('/users/me/addresses')
  return addresses.map(mapAddress)
}

export async function addSavedAddress(address) {
  return mapAddress(await apiRequest('/users/me/addresses', {
    method: 'POST',
    body: addressRequestBody(address),
  }))
}

export async function updateSavedAddress(id, updates) {
  return mapAddress(await apiRequest(`/users/me/addresses/${id}`, {
    method: 'PATCH',
    body: addressRequestBody(updates),
  }))
}

export async function deleteSavedAddress(id) {
  return apiRequest(`/users/me/addresses/${id}`, { method: 'DELETE' })
}

export async function getAdminOrders() {
  return apiRequest('/admin/orders')
}

export async function updateAdminOrderStatus(id, status) {
  return apiRequest(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: { status: status.toLowerCase() },
  })
}

export async function getDashboardStats() {
  return apiRequest('/admin/dashboard/summary')
}

export async function getSalesChart(range = 'week') {
  return apiRequest(`/admin/dashboard/sales?range=${encodeURIComponent(range)}`)
}
