'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { cn } from '@/lib/cn';

const features = [
  {
    icon: BrainCircuit,
    title: 'Predictive churn',
    description:
      'Risk scoring from product, support, billing, and engagement signals.',
  },
  {
    icon: BarChart3,
    title: 'Revenue visibility',
    description:
      'Track retained ARR, expansion pipeline, and save-plays in one command center.',
  },
  {
    icon: ShieldCheck,
    title: 'Health orchestration',
    description:
      'Turn account telemetry into operational actions with structured workflows.',
  },
  {
    icon: Users,
    title: 'CS collaboration',
    description:
      'Align CSMs, RevOps, and leadership around the same live account map.',
  },
];

const pricing = [
  {
    name: 'Starter',
    price: '$49',
    detail: 'For lean teams getting signal coverage live.',
  },
  {
    name: 'Growth',
    price: '$149',
    detail: 'For teams scaling predictive playbooks and automation.',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    detail: 'For multi-team CS operations and data integrations.',
  },
];

const testimonials = [
  {
    quote:
      'ForesightCS replaced a scattered CS stack with one command center. We found churn risk before it reached our exec team.',
    name: 'Amina Shah',
    title: 'VP Customer Success, Northpeak',
  },
  {
    quote:
      'The health model is opinionated enough to be useful, but flexible enough to fit our billing and product data.',
    name: 'Jordan Lee',
    title: 'RevOps Lead, SignalDesk',
  },
  {
    quote:
      'The difference is clarity: every CSM knows what to do next and leadership gets a clean revenue story.',
    name: 'Marta Alvarez',
    title: 'Founder, BrightLoop',
  },
];

const faqs = [
  {
    question: 'How quickly can a team get value?',
    answer:
      'Most teams can import a first account snapshot within the same day and start acting on risk signals immediately.',
  },
  {
    question: 'Can we tailor the churn model?',
    answer:
      'Yes. The rule builder lets you weight product, billing, and support signals to reflect your own retention motion.',
  },
  {
    question: 'Is it built for small teams or larger CS orgs?',
    answer:
      'It starts lean for SMBs, then scales into multi-team workflows with customer 360s, shared playbooks, and executive views.',
  },
];

export function LandingSections() {
  const reduceMotion = useReducedMotion();

  const sectionVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 18,
      scale: reduceMotion ? 1 : 0.98,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <div className="space-y-24 py-20">
      <PageWrapper>
        <motion.div
          className="grid gap-6 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={sectionVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                custom={index}
                variants={cardVariants}
                whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
              >
                <GlassCard
                  hoverable
                  className={cn(
                    'min-h-56',
                    index === 0 && 'lg:col-span-2',
                    index === 3 && 'lg:col-span-2'
                  )}
                >
                  <div className="flex h-full flex-col justify-between gap-6">
                    <motion.div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-200"
                      whileHover={
                        reduceMotion ? undefined : { rotate: 6, scale: 1.04 }
                      }
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="leading-7 text-zinc-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </PageWrapper>

      <PageWrapper>
        <motion.div
          className="grid gap-4 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={sectionVariants}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              custom={index}
              variants={cardVariants}
              whileHover={reduceMotion ? undefined : { y: -4 }}
            >
              <GlassCard className="h-full space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Customer proof
                </div>
                <p className="text-sm leading-7 text-zinc-300">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-medium text-white">{testimonial.name}</p>
                  <p className="text-sm text-zinc-500">{testimonial.title}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </PageWrapper>

      <PageWrapper>
        <motion.div
          className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={sectionVariants}
        >
          <motion.div variants={sectionVariants}>
            <GlassCard className="space-y-6">
              <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">
                Why teams switch
              </p>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                A tighter operating system for customer success, not another
                generic dashboard.
              </h2>
              <p className="max-w-2xl text-zinc-400">
                ForesightCS combines product usage, support intensity, billing
                posture, and human account context into a single action layer
                that feels closer to a command center than a CRM addon.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['23%', 'lower churn risk'],
                  ['4.6x', 'faster save-plays'],
                  ['91%', 'signal confidence'],
                ].map(([value, label]) => (
                  <motion.div
                    key={label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4"
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                  >
                    <p className="text-2xl font-semibold text-white">{value}</p>
                    <p className="mt-1 text-sm text-zinc-500">{label}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
          <motion.div variants={sectionVariants}>
            <GlassCard className="space-y-5">
              <div className="flex items-center gap-2 text-emerald-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm uppercase tracking-[0.3em]">
                  Product motion
                </span>
              </div>
              <div className="space-y-4">
                {[
                  'Signals consolidate automatically from connected systems.',
                  'Risk thresholds drive playbooks and executive escalation.',
                  'Every account has a live 360 with timeline and renewal context.',
                ].map((item) => (
                  <motion.div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300"
                    whileHover={
                      reduceMotion
                        ? undefined
                        : { x: 4, borderColor: 'rgba(52,211,153,0.25)' }
                    }
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                    <p>{item}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </PageWrapper>

      <PageWrapper>
        <motion.div
          className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={sectionVariants}
        >
          <motion.div variants={sectionVariants}>
            <GlassCard className="space-y-5">
              <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
                FAQ
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Common questions before trialing ForesightCS.
              </h2>
              <p className="text-zinc-400">
                Clear answers for teams evaluating predictive customer success
                software.
              </p>
            </GlassCard>
          </motion.div>
          <motion.div variants={sectionVariants} className="space-y-3">
            {faqs.map((faq) => (
              <GlassCard key={faq.question} className="space-y-3">
                <p className="text-lg font-medium text-white">{faq.question}</p>
                <p className="leading-7 text-zinc-400">{faq.answer}</p>
              </GlassCard>
            ))}
          </motion.div>
        </motion.div>
      </PageWrapper>

      <PageWrapper>
        <GlassCard className="overflow-hidden border-emerald-400/20 bg-linear-to-br from-emerald-400/10 via-white/4 to-violet-400/10 p-8 md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">
                Ready to launch
              </p>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Give your team a cleaner way to see churn, act faster, and
                protect revenue.
              </h2>
              <p className="max-w-2xl text-zinc-300">
                Start with the command center, calibrate your rules, and turn
                customer health into a measurable operating rhythm.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button asChild size="lg">
                <Link href="/register">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/login">See the dashboard</Link>
              </Button>
            </div>
          </div>
        </GlassCard>
      </PageWrapper>

      <PageWrapper>
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
                Pricing
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                Simple tiers, no clutter.
              </h2>
            </div>
            <Button variant="secondary" asChild>
              <Link href="/register">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {pricing.map((tier, index) => (
              <motion.div
                key={tier.name}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard
                  key={tier.name}
                  hoverable
                  className={cn(
                    index === 1 && 'border-emerald-400/30 bg-emerald-400/5'
                  )}
                >
                  <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
                    {tier.name}
                  </p>
                  <p className="mt-4 text-4xl font-semibold text-white">
                    {tier.price}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {tier.detail}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
