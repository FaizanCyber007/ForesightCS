'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Select, type SelectOption } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/cn';
import { churnRuleSchema, type ChurnRuleFormValues } from '@/lib/schemas';

const metricOptions: SelectOption[] = [
  { value: 'login_drop', label: 'Login drop' },
  { value: 'feature_adoption', label: 'Feature adoption' },
  { value: 'ticket_spike', label: 'Ticket spike' },
  { value: 'billing_delinquency', label: 'Billing delinquency' },
  { value: 'nps_decline', label: 'NPS decline' },
];

const operatorOptions: SelectOption[] = [
  { value: '>', label: 'Greater than (>)' },
  { value: '>=', label: 'At least (>=)' },
  { value: '<', label: 'Less than (<)' },
  { value: '<=', label: 'At most (<=)' },
  { value: 'between', label: 'Between' },
];

const severityOptions: SelectOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

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
  const { toast } = useToast();
  const form = useForm<ChurnRuleFormValues>({
    resolver: zodResolver(churnRuleSchema) as never,
    defaultValues: initialValues,
  });
  const fields = useFieldArray({ control: form.control, name: 'conditions' });

  const totalWeight = fields.fields.reduce(
    (sum, _, index) =>
      sum + Number(form.watch(`conditions.${index}.weight`) ?? 0),
    0
  );

  return (
    <GlassCard className="space-y-6 relative overflow-hidden group">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-transparent" />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300 font-semibold">
          Predictive rules Engine
        </p>
        <h3 className="mt-1.5 text-xl font-bold text-white">Rule Builder</h3>
        <p className="mt-1 text-xs text-zinc-400 leading-normal max-w-xl">
          Compose weighted telemetry signals to trigger automated playbook responses when customer health score degrades.
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(() => {
          toast({
            title: 'Rule saved successfully',
            description: 'The churn logic is now live and evaluating your customer portfolio signals.',
            tone: 'success',
          });
        })}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Rule name"
            error={form.formState.errors.name?.message}
          >
            <Input className="h-10 text-sm" {...form.register('name')} />
          </Field>
          <Field
            label="Severity classification"
            error={form.formState.errors.severity?.message}
          >
            <Select
              options={severityOptions}
              {...form.register('severity')}
            />
          </Field>
          <Field
            label="Description"
            className="md:col-span-2"
            error={form.formState.errors.description?.message}
          >
            <Input className="h-10 text-sm" {...form.register('description')} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Score trigger threshold"
            error={form.formState.errors.scoreThreshold?.message}
          >
            <Input className="h-10 text-sm" type="number" {...form.register('scoreThreshold')} />
          </Field>
          <Field
            label="Trigger delay window (hours)"
            error={form.formState.errors.triggerDelayHours?.message}
          >
            <Input className="h-10 text-sm" type="number" {...form.register('triggerDelayHours')} />
          </Field>
          <div className="rounded-2xl border border-white/5 bg-black/25 p-4 text-xs text-zinc-500 flex items-start gap-3">
            <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Validation parameters</p>
              <p className="mt-1 leading-normal">
                Signal weights must stay between 1 and 10. Conditions cannot contain empty threshold bounds.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                Conditions schema
              </p>
              <h4 className="mt-1.5 text-base font-bold text-white">
                Weighted Signal Set
                <span className="ml-3 align-middle text-xs font-semibold text-emerald-300 border border-emerald-400/20 bg-emerald-400/8 rounded px-2 py-0.5">
                  total weight: {totalWeight}
                </span>
              </h4>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="h-9 text-xs"
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
              <Plus className="h-3.5 w-3.5" /> Add telemetry signal
            </Button>
          </div>

          <div className="relative space-y-4 pl-6 before:absolute before:bottom-4 before:left-2 before:top-4 before:w-[2px] before:bg-white/10">
            {fields.fields.map((field, index) => (
              <div key={field.id} className="relative flex items-center gap-4">
                <div className="z-10 flex h-7 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0a] text-[10px] font-bold text-emerald-300 font-mono">
                  {index === 0 ? 'IF' : 'AND'}
                </div>
                <div className="flex-1 rounded-[24px] border border-white/8 bg-black/20 p-4 transition-colors hover:border-emerald-400/20">
                  <div className="grid gap-3 md:grid-cols-5 items-end">
                    <Field
                      label="Metric"
                      error={
                        form.formState.errors.conditions?.[index]?.metric
                          ?.message
                      }
                    >
                      <Select
                        options={metricOptions}
                        {...form.register(`conditions.${index}.metric` as const)}
                      />
                    </Field>
                    <Field
                      label="Operator"
                      error={
                        form.formState.errors.conditions?.[index]?.operator
                          ?.message
                      }
                    >
                      <Select
                        options={operatorOptions}
                        {...form.register(
                          `conditions.${index}.operator` as const
                        )}
                      />
                    </Field>
                    <Field
                      label="Threshold"
                      error={
                        form.formState.errors.conditions?.[index]?.threshold
                          ?.message
                      }
                    >
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        {...form.register(
                          `conditions.${index}.threshold` as const
                        )}
                      />
                    </Field>
                    <Field
                      label="Weight"
                      error={
                        form.formState.errors.conditions?.[index]?.weight
                          ?.message
                      }
                    >
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        {...form.register(
                          `conditions.${index}.weight` as const
                        )}
                      />
                    </Field>
                    <div className="flex h-10 items-center justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        aria-label={`Remove condition ${index + 1}`}
                        onClick={() => fields.remove(index)}
                        disabled={fields.fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-5">
                    <div className="md:col-span-2">
                      <Field
                        label="Evaluation window (days)"
                        error={
                          form.formState.errors.conditions?.[index]?.windowDays
                            ?.message
                        }
                      >
                        <Input
                          className="h-10 text-sm"
                          type="number"
                          {...form.register(
                            `conditions.${index}.windowDays` as const
                          )}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {typeof form.formState.errors.conditions?.message === 'string' ? (
            <p className="text-xs text-rose-400 mt-2 font-semibold">
              {form.formState.errors.conditions.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2.5 pt-4 border-t border-white/5">
          <Button type="submit" variant="brand" className="h-10 text-xs">Save logic rule</Button>
          <Button
            type="button"
            variant="secondary"
            className="h-10 text-xs"
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
    <label className={cn('space-y-1.5 block', className)}>
      <span className="text-xs font-semibold text-zinc-400">{label}</span>
      {children}
      {error ? (
        <p role="alert" className="text-[10px] font-semibold text-rose-400">
          {error}
        </p>
      ) : null}
    </label>
  );
}
