import React from 'react'
import { Link } from 'react-router-dom'
import {
  Scale,
  Flame,
  Droplet,
  Beef,
  PieChart,
  Sparkles,
  CalendarDays,
  Baby,
  HeartPulse,
  UtensilsCrossed,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react'

// Grouped by what the person actually came for, not alphabetically --
// the grouping itself is information: three different reasons someone
// opens this page.
const GROUPS = [
  {
    key: 'body',
    label: 'Body & Fitness',
    description: 'Measurements and training zones to track where you stand.',
    accent: 'teal',
    items: [
      { calculator: 'BMI Calculator', url: 'bmi-calculator', description: 'Body mass from height & weight', icon: Scale },
      { calculator: 'BMR Calculator', url: 'bmr-calculator', description: 'Calories burned at rest', icon: Flame },
      { calculator: 'Body Fat Calculator', url: 'body-fat-calculator', description: 'Estimate body fat %', icon: PieChart },
      { calculator: 'Heart Rate Calculator', url: 'heart-rate-calculator', description: 'Target training zones', icon: HeartPulse },
    ],
  },
  {
    key: 'nutrition',
    label: 'Nutrition',
    description: 'Daily targets for fueling training and recovery.',
    accent: 'amber',
    items: [
      { calculator: 'Water Intake Calculator', url: 'water-intake-calculator', description: 'Daily hydration target', icon: Droplet },
      { calculator: 'Protein Intake Calculator', url: 'protein-intake-calculator', description: 'Daily protein needs', icon: Beef },
      { calculator: 'Calorie Calculator', url: 'calorie-calculator', description: 'Daily energy needs', icon: UtensilsCrossed },
      { calculator: 'Weight Loss Calculator', url: 'weight-loss-calculator', description: 'Plan your goal weight', icon: TrendingDown },
    ],
  },
  {
    key: 'womens',
    label: "Women's Health",
    description: 'Cycle tracking and pregnancy milestones.',
    accent: 'rose',
    items: [
      { calculator: 'Ovulation Calculator', url: 'ovulation-calculator', description: 'Find your fertile window', icon: Sparkles },
      { calculator: 'Menstrual Cycle Calculator', url: 'menstrual-cycle-calculator', description: 'Predict upcoming cycles', icon: CalendarDays },
      { calculator: 'Pregnancy Calculator', url: 'pregnancy-calculator', description: 'Due date & milestones', icon: Baby },
    ],
  },
]

const TOTAL_TOOLS = GROUPS.reduce((sum, g) => sum + g.items.length, 0)


const ACCENT_STYLES = {
  teal: {
    dot: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-600',
    badgeHover: 'group-hover:bg-teal-600 group-hover:text-white',
    border: 'hover:border-teal-300',
    arrow: 'group-hover:text-teal-500',
  },
  amber: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-600',
    badgeHover: 'group-hover:bg-amber-500 group-hover:text-white',
    border: 'hover:border-amber-300',
    arrow: 'group-hover:text-amber-500',
  },
  rose: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-600',
    badgeHover: 'group-hover:bg-rose-500 group-hover:text-white',
    border: 'hover:border-rose-300',
    arrow: 'group-hover:text-rose-500',
  },
}

export default function HealthCalculators() {
  return (
    <section className="min-h-screen bg-[#f6f4f0] font-body pt-26 pb-16 px-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-mono-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-mono-data text-xs tracking-widest text-stone-400 uppercase mb-1">
              Health tools
            </p>
            <h1 className="font-display text-4xl font-semibold text-stone-900 mb-2">
              Health Calculators
            </h1>
            <p className="text-sm text-stone-500 max-w-md">
              Quick, no-signup calculators for tracking fitness, nutrition, and family health --
              built for real life, not spreadsheets.
            </p>
          </div>
          <span className="font-mono-data text-xs text-stone-400 border border-stone-200 rounded-full px-3 py-1.5 bg-white shrink-0">
            {TOTAL_TOOLS} tools &middot; always free
          </span>
        </div>

        {/* Groups */}
        <div className="flex flex-col gap-11">
          {GROUPS.map((group) => {
            const accent = ACCENT_STYLES[group.accent]
            return (
              <div key={group.key}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                  <h2 className="font-display text-lg font-semibold text-stone-900">
                    {group.label}
                  </h2>
                  <span className="font-mono-data text-[11px] text-stone-400">
                    {group.items.length} tools
                  </span>
                </div>
                <p className="text-xs text-stone-400 mb-4">{group.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.url}
                        to={`/${item.url}`}
                        className={`group relative flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${accent.border}`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${accent.badge} ${accent.badgeHover}`}
                          >
                            <Icon className="w-5 h-5" strokeWidth={2} />
                          </span>
                          <ArrowUpRight
                            className={`w-4 h-4 text-stone-300 transition-colors ${accent.arrow}`}
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-stone-900">
                            {item.calculator}
                          </h3>
                          <p className="text-xs text-stone-400 mt-0.5">{item.description}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}