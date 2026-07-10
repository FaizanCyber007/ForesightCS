'use client';

import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/cn';

const pricing = [
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    detail: 'For lean teams getting signal coverage live.',
    features: [
      'Up to 500 accounts',
      'Basic health scoring',
      'Standard playbooks',
      '5 churn rules',
      'Email support',
    ],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$149',
    period: '/mo',
    detail: 'For teams scaling predictive playbooks and automation.',
    features: [
      'Up to 2,500 accounts',
      'Predictive ML churn model',
      'Advanced automation',
      'Unlimited churn rules',
      'Priority support',
      'AI Copilot (beta)',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    detail: 'For multi-team CS operations and data integrations.',
    features: [
      'Unlimited accounts',
      'Custom model weights',
      'Dedicated CSM',
      'SSO & SLA',
      'On-prem option',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function PricingContent() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.1),transparent_38%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.1),transparent_40%)]" />
      <PageWrapper className="relative space-y-16">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">Pricing</p>
          <h1 className="text-5xl font-semibold tracking-tight text-white">
            Pricing that scales with your retention.
          </h1>
          <p className="text-lg text-zinc-400">
            Start lean, build your signal coverage, and upgrade when your team needs advanced predictive models.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {pricing.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
            >
              <GlassCard
                hoverable
                className={cn(
                  'relative flex h-full flex-col',
                  tier.highlighted &&
                    'border-emerald-400/30 bg-emerald-400/5 shadow-[0_0_60px_rgba(52,211,153,0.12)]'
                )}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
                      <Sparkles className="h-3 w-3" />
                      Most popular
                    </span>
                  </div>
                )}
                <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
                  {tier.name}
                </p>
                <div className="mt-4 flex items-end gap-1">
                  <p className="font-mono-numeric text-5xl font-semibold text-white">
                    {tier.price}
                  </p>
                  {tier.period && (
                    <p className="mb-1.5 text-lg font-normal text-zinc-500">{tier.period}</p>
                  )}
                </div>
                <p className="mt-3 h-12 text-sm leading-6 text-zinc-400">
                  {tier.detail}
                </p>

                <div className="my-8 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check
                        className={cn(
                          'h-4 w-4 shrink-0',
                          tier.highlighted ? 'text-emerald-400' : 'text-zinc-500'
                        )}
                      />
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  variant={tier.highlighted ? 'primary' : 'secondary'}
                  asChild
                >
                  <Link href={tier.price === 'Custom' ? '/contact' : '/register'}>
                    {tier.cta}
                  </Link>
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-zinc-500">
            All plans include a 14-day free trial. No credit card required.{' '}
            <Link href="/contact" className="text-emerald-300 transition-colors hover:text-emerald-200">
              Talk to sales →
            </Link>
          </p>
        </div>
      </PageWrapper>
    </section>
  );
}
