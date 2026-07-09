'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { churnRuleSchema, type ChurnRuleFormValues } from '@/lib/schemas';

const initialValues: ChurnRuleFormValues = {
  name: 'Low engagement watchlist',
  description:
    'Flag accounts with dropping usage, rising support load, and delayed billing events.',
  severity: 'high',
  triggerDelayHours: 12,
  scoreThreshold: 65,
  conditions: [
    {
      metric: 'login_drop',
      operator: '<=',
      threshold: 25,
      weight: 6,
      windowDays: 14,
    },
    {
      metric: 'ticket_spike',
      operator: '>',
      threshold: 4,
      weight: 4,
      windowDays: 7,
    },
  ],
};

export function RuleBuilderForm() {
  const form = useForm<ChurnRuleFormValues>({
    resolver: zodResolver(churnRuleSchema) as never,
    defaultValues: initialValues,
  });
  const fields = useFieldArray({ control: form.control, name: 'conditions' });

  return (
    <GlassCard className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
          Predictive rules
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Rule builder</h3>
        <p className="mt-2 text-zinc-400">
          Compose weighted signals to trigger an action when customer health
          degrades.
        </p>
      </div>
      <form className="space-y-6" onSubmit={form.handleSubmit(() => undefined)}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Rule name" error={form.formState.errors.name?.message}>
            <Input {...form.register('name')} />
          </Field>
          <Field
            label="Severity"
            error={form.formState.errors.severity?.message}
          >
            <select
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none"
              {...form.register('severity')}
            >
              <option className="bg-black" value="low">
                Low
              </option>
              <option className="bg-black" value="medium">
                Medium
              </option>
              <option className="bg-black" value="high">
                High
              </option>
              <option className="bg-black" value="critical">
                Critical
              </option>
            </select>
          </Field>
          <Field
            label="Description"
            className="md:col-span-2"
            error={form.formState.errors.description?.message}
          >
            <Input {...form.register('description')} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Score threshold"
            error={form.formState.errors.scoreThreshold?.message}
          >
            <Input type="number" {...form.register('scoreThreshold')} />
          </Field>
          <Field
            label="Trigger delay (hours)"
            error={form.formState.errors.triggerDelayHours?.message}
          >
            <Input type="number" {...form.register('triggerDelayHours')} />
          </Field>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
            <p className="text-white">Validation notes</p>
            <p className="mt-2">
              Weights must stay between 1 and 10. Metrics cannot be empty.
              Thresholds are normalized to a 0-100 risk band.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                Conditions
              </p>
              <h4 className="mt-2 text-lg font-semibold text-white">
                Weighted signal set
              </h4>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                fields.append({
                  metric: 'feature_adoption',
                  operator: '<',
                  threshold: 40,
                  weight: 5,
                  windowDays: 14,
                })
              }
            >
              <Plus className="h-4 w-4" /> Add signal
            </Button>
          </div>

          <div className="space-y-4">
            {fields.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-[28px] border border-white/10 bg-black/25 p-4 md:grid-cols-5"
              >
                <Field
                  label="Metric"
                  error={
                    form.formState.errors.conditions?.[index]?.metric?.message
                  }
                >
                  <select
                    className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none"
                    {...form.register(`conditions.${index}.metric` as const)}
                  >
                    <option className="bg-black" value="login_drop">
                      Login drop
                    </option>
                    <option className="bg-black" value="feature_adoption">
                      Feature adoption
                    </option>
                    <option className="bg-black" value="ticket_spike">
                      Ticket spike
                    </option>
                    <option className="bg-black" value="billing_delinquency">
                      Billing delinquency
                    </option>
                    <option className="bg-black" value="nps_decline">
                      NPS decline
                    </option>
                  </select>
                </Field>
                <Field
                  label="Operator"
                  error={
                    form.formState.errors.conditions?.[index]?.operator?.message
                  }
                >
                  <select
                    className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none"
                    {...form.register(`conditions.${index}.operator` as const)}
                  >
                    <option className="bg-black" value=">">
                      &gt;
                    </option>
                    <option className="bg-black" value=">=">
                      &gt;=
                    </option>
                    <option className="bg-black" value="<">
                      &lt;
                    </option>
                    <option className="bg-black" value="<=">
                      &lt;=
                    </option>
                    <option className="bg-black" value="between">
                      Between
                    </option>
                  </select>
                </Field>
                <Field
                  label="Threshold"
                  error={
                    form.formState.errors.conditions?.[index]?.threshold
                      ?.message
                  }
                >
                  <Input
                    type="number"
                    {...form.register(`conditions.${index}.threshold` as const)}
                  />
                </Field>
                <Field
                  label="Weight"
                  error={
                    form.formState.errors.conditions?.[index]?.weight?.message
                  }
                >
                  <Input
                    type="number"
                    {...form.register(`conditions.${index}.weight` as const)}
                  />
                </Field>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fields.remove(index)}
                    disabled={fields.fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="md:col-span-5">
                  <Field
                    label="Window (days)"
                    error={
                      form.formState.errors.conditions?.[index]?.windowDays
                        ?.message
                    }
                  >
                    <Input
                      type="number"
                      {...form.register(
                        `conditions.${index}.windowDays` as const
                      )}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          {typeof form.formState.errors.conditions?.message === 'string' ? (
            <p className="text-sm text-rose-300">
              {form.formState.errors.conditions.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">Save rule</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset(initialValues)}
          >
            Reset draft
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('space-y-2', className)}>
      <span className="text-sm text-zinc-300">{label}</span>
      {children}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </label>
  );
}
