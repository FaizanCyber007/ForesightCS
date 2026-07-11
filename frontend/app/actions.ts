'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateCustomerHealth, resetDatabase, type HealthStatus } from '@/services/api';

const updateHealthSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
  health: z.enum(['Healthy', 'At-Risk', 'Critical'], {
    message: "Invalid health status",
  }),
  churnProbability: z.number().min(0).max(100, "Churn probability must be between 0 and 100"),
});

/**
 * Server Action to update a customer's health status and revalidate paths
 */
export async function updateCustomerHealthAction(id: string, health: HealthStatus, churnProbability: number) {
  // Validate input using Zod
  const parsed = updateHealthSchema.safeParse({ id, health, churnProbability });
  
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const updated = await updateCustomerHealth(parsed.data.id, parsed.data.health, parsed.data.churnProbability);
  // Revalidate the dashboard and details pages so they refetch the updated dataset
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/customer/${id}`);
  return updated;
}

/**
 * Server Action to reset the database to baseline and refresh dashboard
 */
export async function resetDatabaseAction() {
  await resetDatabase();
  revalidatePath('/dashboard');
}
