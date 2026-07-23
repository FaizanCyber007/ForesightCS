'use client';

import { useState } from 'react';
import { Mail, Users, Phone, Calendar } from 'lucide-react';

import { useToast } from '@/components/ui/toast';
import type { CustomerDetail } from '@/services/api';
import { CustomerContacts } from '@/components/features/customer-contacts';
import { CustomerHeaderCard } from '@/components/features/customer-360-parts/header-card';
import { TelemetryCard } from '@/components/features/customer-360-parts/telemetry-card';
import { PlaybookCard, type PlaybookTask } from '@/components/features/customer-360-parts/playbook-card';
import { TimelineCard } from '@/components/features/customer-360-parts/timeline-card';
import { NotesCard } from '@/components/features/customer-360-parts/notes-card';

const initialTasks: PlaybookTask[] = [
  { text: 'Send QBR invite to executive sponsor', icon: Mail, done: true },
  { text: 'Review feature adoption drop with product team', icon: Users, done: false },
  { text: 'Sync on upcoming renewal terms', icon: Phone, done: false },
  { text: 'Schedule health review call', icon: Calendar, done: false },
];

export function Customer360({ customer }: { customer: CustomerDetail }) {
  const [tasks, setTasks] = useState(initialTasks);

  function toggleTask(index: number) {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t))
    );
  }

  const [currentHealth, setCurrentHealth] = useState(customer.health);
  const [currentRisk, setCurrentRisk] = useState(customer.churnProbability);
  const [currentScore, setCurrentScore] = useState(customer.engagementScore);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const { toast } = useToast();

  async function handleRecalculate() {
    setIsRecalculating(true);
    try {
      const { recalculateHealthScoreAction } = await import('@/app/actions');
      const updated = await recalculateHealthScoreAction(customer.id);
      setCurrentScore(updated.engagementScore);
      setCurrentHealth(updated.health);
      setCurrentRisk(updated.churnProbability);
      toast({
        title: 'Health Score Recalculated',
        description: `${customer.company} is now scored ${updated.engagementScore} (${updated.health}).`,
        tone: updated.health === 'Critical' ? 'error' : 'success',
      });
    } catch (e) {
      const err = e as Error;
      toast({
        title: 'Recalculation Failed',
        description: err.message || 'An error occurred while recalculating the health score.',
        tone: 'error',
      });
      console.error(e);
    } finally {
      setIsRecalculating(false);
    }
  }

  return (
    <div className="space-y-6">
      <CustomerHeaderCard
        customer={customer}
        currentHealth={currentHealth}
        currentRisk={currentRisk}
        currentScore={currentScore}
        isRecalculating={isRecalculating}
        onRecalculate={handleRecalculate}
      />

      {/* Telemetry + Playbook */}
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <TelemetryCard customer={customer} currentScore={currentScore} />
        <PlaybookCard tasks={tasks} onToggleTask={toggleTask} />
      </div>

      {/* Timeline + Notes */}
      <div className="grid gap-4 xl:grid-cols-2">
        <TimelineCard timeline={customer.timeline} />
        <NotesCard customerId={customer.id} notes={customer.notes} />
        <CustomerContacts contacts={customer.contacts} />
      </div>
    </div>
  );
}
