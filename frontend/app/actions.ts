'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateCustomerHealth, resetDatabase, updateTaskStatus, addCustomerNote, type HealthStatus } from '@/services/api';

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

/**
 * Server Action to update a task's status
 */
export async function updateTaskStatusAction(id: string, status: 'Open' | 'In Progress' | 'Completed') {
  await updateTaskStatus(id, status);
  revalidatePath('/dashboard/tasks');
}

export async function addCustomerNoteAction(customerId: string, note: string) {
  if (!note.trim() || !customerId) return;
  await addCustomerNote(customerId, note);
  revalidatePath(`/dashboard/customer/${customerId}`);
}

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContactFormAction(data: z.infer<typeof contactSchema>) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid form data' };
  }
  
  // Simulate network delay / DB write
  await new Promise(r => setTimeout(r, 800));
  
  // In a real app, send an email or store in DB here
  return { success: true };
}
