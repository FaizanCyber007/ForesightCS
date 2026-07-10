'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Clock,
  LineChart,
  ShieldCheck,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import mockData from '@/data/mock-data.json';

const { landingTestimonials, howItWorks, integrations } = mockData as typeof mockData & {
  landingTestimonials: { quote: string; name: string; title: string; company: string }[];
  howItWorks: { step: string; title: string; description: string }[];
  integrations: { name: string; category: string }[];
};

const features = [
  {
    icon: BrainCircuit,
    title: 'Predictive churn scoring — 30 to 60 days out',
    description: 'Our ML model scores every account daily using signals from product usage, billing events, support intensity, and engagement frequency. No data science team needed.',
    highlight: true,
    stat: '81% accuracy',
  },
  {
    icon: BarChart3,
    title: 'Revenue command center',
    description: 'See retained ARR, expansion pipeline, and at-risk MRR all in one place. Stop building churn reports in spreadsheets the night before board meetings.',
    highlight: false,
    stat: '$1.84M avg ARR protected',
  },
  {
    icon: ShieldCheck,
    title: 'Automated save-play playbooks',
    description: 'When an account crosses a risk threshold, ForesightCS automatically assigns the right playbook — executive outreach, QBR scheduling, or renewal prep — with deadlines and owners.',
    highlight: false,
    stat: '4.3× faster interventions',
  },
  {
    icon: Users,
    title: 'Customer 360 with live timeline',
    description: 'Every account has a live profile: health score history, support ticket trends, billing posture, NPS trajectory, and a timestamped timeline of every meaningful event.',
    highlight: false,
    stat: 'Full context, zero tab-switching',
  },
  {
    icon: Zap,
    title: 'No-code churn rule builder',
    description: "Encode your team's institutional knowledge into weighted signal rules. Set custom thresholds for product adoption, login frequency, NPS drops, and more — in minutes.",
    highlight: false,
    stat: 'Unlimited rules on Growth+',
  },
  {
    icon: LineChart,
    title: 'CS team performance analytics',
    description: 'See which CSMs have the healthiest portfolios, measure save-play success rates, track QBR completion, and benchmark your team against historical performance.',
    highlight: false,
    stat: 'Built for VP CS reporting',
  },
];


const pricingTiers = [
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    description: 'For lean CS teams getting their first signal coverage live.',
    features: ['Up to 250 accounts', 'Basic health scoring', '5 churn rules', 'Email support'],
    cta: 'Start free trial',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$149',
    period: '/mo',
    description: 'For scaling teams that need automation and predictive power.',
    features: ['Up to 2,500 accounts', 'Predictive ML model', 'Unlimited rules', 'Automated playbooks', 'Priority support', 'AI Copilot (beta)'],
    cta: 'Start free trial',
    href: '/register',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For multi-team CS operations with deep data integrations.',
    features: ['Unlimited accounts', 'Custom model weights', 'Dedicated CSM', 'SSO & SLA', 'Custom integrations'],
    cta: 'Talk to sales',
    href: '/contact',
    highlighted: false,
  },
];

function useScrollAnimation(reduceMotion: boolean | null) {
  return {
    initial: { opacity: 0, y: reduceMotion ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  };
}

export function LandingSections() {
  const reduceMotion = useReducedMotion();
  const scrollAnim = useScrollAnimation(reduceMotion);

  return (
    <div className="space-y-0">
      {/* ─── How It Works ──────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <PageWrapper className="space-y-14">
          <motion.div className="text-center space-y-4" {...scrollAnim}>
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">How it works</p>
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              From signal to save-play in three steps
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Most CS teams discover churn risk too late. ForesightCS surfaces it early enough to do something about it — automatically.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard hoverable className="h-full space-y-4 relative overflow-visible">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/8 font-mono-numeric text-lg font-bold text-emerald-300">
                      {step.step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <p className="text-sm leading-6 text-zinc-400">{step.description}</p>
                    </div>
                  </div>
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-4 w-4 text-zinc-600" />
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* ─── Features ──────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <PageWrapper className="space-y-14">
          <motion.div className="text-center space-y-4" {...scrollAnim}>
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Platform capabilities</p>
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              One platform that replaces five CS tools
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Stop stitching together spreadsheets, CRM plugins, and shared docs. ForesightCS gives your team a unified intelligence layer built specifically for customer retention.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                >
                  <GlassCard
                    hoverable
                    className={`h-full flex flex-col space-y-4 ${feature.highlight ? 'border-emerald-400/25 bg-emerald-400/5' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-emerald-300 ${feature.highlight ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-white/10 bg-white/5'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {feature.stat && (
                        <span className="text-[10px] font-medium text-emerald-300 border border-emerald-400/20 bg-emerald-400/8 rounded-full px-2.5 py-1 whitespace-nowrap">
                          {feature.stat}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-white leading-snug">{feature.title}</h3>
                      <p className="text-sm leading-6 text-zinc-400">{feature.description}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </PageWrapper>
      </section>

      {/* ─── Testimonials ──────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <PageWrapper className="space-y-14">
          <motion.div className="text-center space-y-4" {...scrollAnim}>
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Customer results</p>
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Real outcomes from real CS teams
            </h2>
            <p className="mx-auto max-w-xl text-zinc-400">
              From 2-person startups to 50-person CS orgs — here's what teams say after switching to a signal-first approach.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {landingTestimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
              >
                <GlassCard hoverable className="h-full space-y-5">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-zinc-300 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400/30 to-violet-400/30 border border-white/10 flex items-center justify-center text-xs font-semibold text-white">
                      {testimonial.name.split(' ').map((w: string) => w[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{testimonial.name}</p>
                      <p className="text-xs text-zinc-500">{testimonial.title} · {testimonial.company}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* ─── Integrations ──────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <PageWrapper className="space-y-12">
          <motion.div className="text-center space-y-4" {...scrollAnim}>
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Integrations</p>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Connects to every tool your team already uses
            </h2>
            <p className="mx-auto max-w-xl text-zinc-400">
              No rip-and-replace. ForesightCS sits on top of your existing CRM, billing, support, and product analytics stack — syncing signals in real-time.
            </p>
          </motion.div>

          <motion.div className="flex flex-wrap justify-center gap-3" {...scrollAnim}>
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
                {integration.name}
                <span className="text-xs text-zinc-600">{integration.category}</span>
              </div>
            ))}
          </motion.div>
        </PageWrapper>
      </section>

      {/* ─── Pricing ───────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <PageWrapper className="space-y-14">
          <motion.div className="text-center space-y-4" {...scrollAnim}>
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">Pricing</p>
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto max-w-xl text-zinc-400">
              Start with a free trial. No credit card required. Scale as your CS team grows.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
              >
                <GlassCard
                  className={`h-full flex flex-col relative ${tier.highlighted ? 'border-emerald-400/30 bg-emerald-400/5 shadow-[0_0_60px_rgba(52,211,153,0.08)]' : ''}`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
                        Most popular
                      </span>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">{tier.name}</p>
                    <div className="flex items-end gap-1">
                      <p className="font-mono-numeric text-4xl font-semibold text-white">{tier.price}</p>
                      {tier.period && <p className="mb-1 text-zinc-500">{tier.period}</p>}
                    </div>
                    <p className="text-sm text-zinc-400">{tier.description}</p>
                  </div>

                  <ul className="my-6 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                        <CheckCircle2 className={`h-4 w-4 shrink-0 ${tier.highlighted ? 'text-emerald-400' : 'text-zinc-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={tier.highlighted ? 'brand' : 'secondary'}
                    asChild
                  >
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.p className="text-center text-sm text-zinc-600" {...scrollAnim}>
            All plans include a 14-day free trial. View{' '}
            <Link href="/pricing" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              full pricing details →
            </Link>
          </motion.p>
        </PageWrapper>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <PageWrapper>
          <motion.div {...scrollAnim}>
            <GlassCard className="relative overflow-hidden border-emerald-400/15 bg-gradient-to-br from-emerald-400/8 via-transparent to-violet-400/8 p-10 md:p-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.06),transparent_60%)]" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">Ready to start</p>
                  <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    Give your team a cleaner way to see churn, act faster, and protect revenue.
                  </h2>
                  <p className="max-w-xl text-zinc-400">
                    Join 400+ CS teams already using ForesightCS to turn account health into a measurable operating rhythm.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:min-w-[180px]">
                  <Button variant="brand" size="lg" asChild>
                    <Link href="/register">
                      Start free trial <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/contact">Talk to sales</Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </PageWrapper>
      </section>
    </div>
  );
}
