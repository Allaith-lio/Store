const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const USERS_KEY = 'storeUsers'
const SESSION_KEY = 'currentUser'

function notifyAuthChange() {
  window.dispatchEvent(new Event('authchange'))
}

function readStorage(key, fallback) {
  const value = localStorage.getItem(key)
  return value === null ? fallback : JSON.parse(value)
}

async function hashPassword(password, salt = crypto.randomUUID()) {
  if (!crypto.subtle) {
    throw new Error('Secure browser storage is unavailable. Use localhost or HTTPS.')
  }

  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 120000, hash: 'SHA-256' },
    keyMaterial,
    256,
  )

  return {
    salt,
    hash: Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join(''),
  }
}

export function getCurrentUser() {
  return readStorage(SESSION_KEY, null)
}

export function getRegisteredUsers() {
  return readStorage(USERS_KEY, [])
}

export function getStoreOrders() {
  return readStorage('storeOrders', [])
}

export async function registerUser({ name, email, password }) {
  const users = getRegisteredUsers()
  const normalizedEmail = email.trim().toLowerCase()

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists. Please sign in.')
  }

  const credentials = await hashPassword(password)
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    avatar: '',
    phone: '',
  }

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify([...users, { ...user, ...credentials }]),
  )
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  notifyAuthChange()
  return user
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = getRegisteredUsers().find(
    (account) => account.email.toLowerCase() === normalizedEmail,
  )

  if (!user) throw new Error('No account found for this email.')

  const credentials = await hashPassword(password, user.salt)
  if (credentials.hash !== user.hash) {
    throw new Error('Incorrect password. Please try again.')
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || '',
    phone: user.phone || '',
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
  notifyAuthChange()
  return sessionUser
}

export async function verifyCurrentPassword(password) {
  const currentUser = getCurrentUser()
  if (!currentUser) return false

  const account = getRegisteredUsers().find((user) => user.id === currentUser.id)
  if (!account) return false
  const credentials = await hashPassword(password, account.salt)
  return credentials.hash === account.hash
}

export function updateCurrentUser(updates) {
  const currentUser = getCurrentUser()
  if (!currentUser) throw new Error('Please sign in to update your profile.')

  const normalizedEmail = updates.email?.trim().toLowerCase()
  if (
    normalizedEmail &&
    getRegisteredUsers().some(
      (user) =>
        user.id !== currentUser.id && user.email.toLowerCase() === normalizedEmail,
    )
  ) {
    throw new Error('An account with this email already exists.')
  }

  if (normalizedEmail) updates = { ...updates, email: normalizedEmail }
  const updatedUser = { ...currentUser, ...updates }
  const users = getRegisteredUsers().map((user) =>
    user.id === currentUser.id ? { ...user, ...updates } : user,
  )
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser))
  notifyAuthChange()
  return updatedUser
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
  notifyAuthChange()
}

const mockStats = {
  totalSales: { value: 48250, change: 12.5 },
  netProfit: { value: 12840, change: 8.2 },
  newOrders: { value: 126, change: -3.4 },
  totalUsers: { value: 1893, change: 5.1 },
}

const mockWeek = [
  { label: 'Mon', value: 1200 },
  { label: 'Tue', value: 1450 },
  { label: 'Wed', value: 1100 },
  { label: 'Thu', value: 1700 },
  { label: 'Fri', value: 2400 },
  { label: 'Sat', value: 2100 },
  { label: 'Sun', value: 1600 },
]

const mockMonth = Array.from({ length: 30 }, (_, i) => ({
  label: String(i + 1),
  value: Math.round(1400 + Math.sin(i / 3) * 500 + (i % 7 >= 5 ? 700 : 0)),
}))

export async function getDashboardStats() {
  await delay(400)
  const savedOrders = readStorage('storeOrders', null)
  const users = getRegisteredUsers()
  if (savedOrders === null && users.length === 0) return mockStats

  const totalSales = (savedOrders || []).reduce(
    (total, order) => total + Number(order.total || 0),
    0,
  )

  return {
    totalSales: { value: totalSales, change: 0 },
    netProfit: { value: Math.round(totalSales * 0.266), change: 0 },
    newOrders: { value: (savedOrders || []).length, change: 0 },
    totalUsers: { value: users.length, change: 0 },
  }
}

export async function getSalesChart(range = 'week') {
  await delay(400)
  const orders = readStorage('storeOrders', null)
  if (orders === null) return range === 'month' ? mockMonth : mockWeek

  const dayCount = range === 'month' ? 30 : 7
  const today = new Date()
  const days = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (dayCount - index - 1))
    return date
  })

  return days.map((date) => {
    const total = orders.reduce((sum, order) => {
      const orderDate = new Date(order.date)
      return orderDate.toDateString() === date.toDateString()
        ? sum + Number(order.total || 0)
        : sum
    }, 0)
    return {
      label: range === 'month'
        ? String(date.getDate())
        : date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: total,
    }
  })
}
