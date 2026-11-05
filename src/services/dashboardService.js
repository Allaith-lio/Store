const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
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
  return mockStats
}

export async function getSalesChart(range = 'week') {
  await delay(400)
  return range === 'month' ? mockMonth : mockWeek
}
