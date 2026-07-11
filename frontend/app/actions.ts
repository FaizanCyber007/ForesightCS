'use server';

import { revalidatePath } from 'next/cache';
import { updateCustomerHealth, resetDatabase, type HealthStatus } from '@/services/api';

/**
 * Server Action to update a customer's health status and revalidate paths
 */
export async function updateCustomerHealthAction(id: string, health: HealthStatus, churnProbability: number) {
  const updated = await updateCustomerHealth(id, health, churnProbability);
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
