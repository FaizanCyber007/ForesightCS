import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid work email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Full name is required.'),
  companyName: z.string().min(2, 'Company name is required.'),
  role: z.enum([
    'Customer Success Manager',
    'Founder',
    'Operations Lead',
    'RevOps Analyst',
  ]),
});

export const metricTypeSchema = z.enum([
  'login_drop',
  'feature_adoption',
  'ticket_spike',
  'billing_delinquency',
  'nps_decline',
]);

export const ruleConditionSchema = z.object({
  metric: metricTypeSchema,
  operator: z.enum(['>', '>=', '<', '<=', 'between']),
  threshold: z.coerce.number().min(0).max(100),
  weight: z.coerce.number().min(1).max(10),
  windowDays: z.coerce.number().int().min(1).max(90),
});

export const churnRuleSchema = z.object({
  name: z.string().min(3, 'Rule name is required.'),
  description: z.string().min(12, 'Add a short description for this rule.'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  triggerDelayHours: z.coerce.number().int().min(0).max(168),
  scoreThreshold: z.coerce.number().min(1).max(100),
  conditions: z
    .array(ruleConditionSchema)
    .min(1, 'Add at least one signal.')
    .max(6),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ChurnRuleFormValues = z.infer<typeof churnRuleSchema>;
