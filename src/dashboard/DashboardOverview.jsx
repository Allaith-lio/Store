import { useEffect, useState } from 'react'
import {
  DollarSign,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import {
  getDashboardStats,
  getSalesChart,
} from '../services/dashboardService'

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)

const formatNumber = (n) => new Intl.NumberFormat('en-US').format(n)

const statCards = [
  {
    key: 'totalSales',
    label: 'Total Sales',
    Icon: DollarSign,
    color: 'bg-sky-400/15 text-sky-500',
    format: formatCurrency,
  },
  {
    key: 'netProfit',
    label: 'Net Profit',
    Icon: Wallet,
    color: 'bg-emerald-400/15 text-emerald-500',
    format: formatCurrency,
  },
  {
    key: 'newOrders',
    label: 'New Orders',
    Icon: ShoppingBag,
    color: 'bg-amber-400/15 text-amber-500',
    format: formatNumber,
  },
  {
    key: 'totalUsers',
    label: 'Registered Users',
    Icon: Users,
    color: 'bg-orange-400/15 text-orange-500',
    format: formatNumber,
  },
]

const ranges = [
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
]

function StatCard({ label, value, change, Icon, color }) {
  const isUp = change >= 0

  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-raised">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <span
          className={`flex size-10 items-center justify-center rounded-control ${color}`}
        >
          <Icon size={20} />
        </span>
      </div>

      <p className="mt-4 font-heading text-3xl font-semibold">{value}</p>

      <p className="mt-2 flex items-center gap-2 text-xs text-muted">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${
            isUp
              ? 'bg-emerald-400/15 text-emerald-500'
              : 'bg-red-500/10 text-red-500'
          }`}
        >
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isUp ? '+' : ''}
          {change}%
        </span>
        vs last month
      </p>
    </div>
  )
}

function ErrorMessage({ children }) {
  return (
    <p
      role="alert"
      className="rounded-control border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500"
    >
      {children}
    </p>
  )
}

function SalesChart({ range, onRangeChange, data, loading, error }) {
  const hasData = !loading && !error && data && data.length > 0

  let max = 0
  let peak = null
  let total = 0
  if (hasData) {
    max = Math.max(...data.map((d) => d.value))
    peak = data.find((d) => d.value === max)
    total = data.reduce((sum, d) => sum + d.value, 0)
  }
  const average = hasData ? Math.round(total / data.length) : 0
  const peakLabel = peak ? (range === 'month' ? `Day ${peak.label}` : peak.label) : ''

  const summary = [
    { label: 'Peak day', value: peakLabel, hint: peak ? formatCurrency(peak.value) : '' },
    { label: 'Average / day', value: formatCurrency(average), hint: '' },
    { label: 'Total', value: formatCurrency(total), hint: '' },
  ]

  return (
    <section className="rounded-card border border-line bg-surface p-5 shadow-card md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl">Sales Performance</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            Find your busiest days
            <span className="inline-flex items-center gap-1.5 text-xs">
              <span className="size-2.5 rounded-full bg-accent" />
              Peak
            </span>
          </p>
        </div>

        <div className="inline-flex rounded-control border border-line bg-page p-1">
          {ranges.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onRangeChange(id)}
              aria-pressed={range === id}
              className={`cursor-pointer rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
                range === id
                  ? 'bg-surface text-ink shadow-card'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {loading && <div className="h-64 animate-pulse rounded-control bg-page" />}

        {error && <ErrorMessage>Could not load the sales data. Please try again later.</ErrorMessage>}

        {!loading && !error && data && data.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">No sales data yet.</p>
        )}

        {hasData && (
          <>
            <div className="relative h-64">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((line) => (
                  <div key={line} className="border-t border-dashed border-line" />
                ))}
              </div>

              <div className="relative flex h-full items-end gap-1.5 sm:gap-2">
                {data.map(({ label, value }) => {
                  const percent = (value / max) * 100
                  const isPeak = value === max

                  return (
                    <div
                      key={label}
                      className="group relative flex h-full flex-1 items-end"
                    >
                      <div
                        className={`w-full transition-all duration-500 ${
                          range === 'month' ? 'rounded-t' : 'rounded-t-control'
                        } ${
                          isPeak
                            ? 'bg-accent'
                            : 'bg-primary/60 group-hover:bg-primary'
                        }`}
                        style={{ height: `${percent}%` }}
                      />

                      <span
                        className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-control bg-ink px-2 py-1 text-xs font-semibold text-page opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ bottom: `calc(${percent}% + 8px)` }}
                      >
                        {formatCurrency(value)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-2 flex gap-1.5 sm:gap-2">
              {data.map(({ label }, index) => (
                <span
                  key={label}
                  className="flex-1 text-center text-xs text-muted"
                >
                  {range === 'week' || index % 5 === 0 ? label : ''}
                </span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
              {summary.map(({ label, value, hint }) => (
                <div key={label}>
                  <p className="text-xs text-muted">{label}</p>
                  <p className="mt-1 font-heading text-lg font-semibold sm:text-xl">
                    {value}
                  </p>
                  {hint && <p className="text-xs text-muted">{hint}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export const DashboardOverview = () => {
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState(false)

  const [range, setRange] = useState('week')
  const [chart, setChart] = useState(null)
  useEffect(() => {
    let ignore = false
    getDashboardStats()
      .then((data) => {
        if (!ignore) setStats(data)
      })
      .catch(() => {
        if (!ignore) setStatsError(true)
      })
    return () => {
      ignore = true
    }
  }, [])
  useEffect(() => {
    let ignore = false
    getSalesChart(range)
      .then((data) => {
        if (!ignore) setChart({ range, data })
      })
      .catch(() => {
        if (!ignore) setChart({ range, error: true })
      })
    return () => {
      ignore = true
    }
  }, [range])

  const chartLoading = chart?.range !== range

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-muted">
          A quick look at how your store is doing.
        </p>
      </div>

      {statsError ? (
        <ErrorMessage>Could not load the stats. Please try again later.</ErrorMessage>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ key, label, Icon, color, format }) =>
            stats ? (
              <StatCard
                key={key}
                label={label}
                Icon={Icon}
                color={color}
                value={format(stats[key].value)}
                change={stats[key].change}
              />
            ) : (
              <div
                key={key}
                className="h-40 animate-pulse rounded-card border border-line bg-surface"
              />
            )
          )}
        </section>
      )}

      <SalesChart
        range={range}
        onRangeChange={setRange}
        data={chart?.data}
        loading={chartLoading}
        error={!chartLoading && chart?.error}
      />
    </div>
  )
  
}
