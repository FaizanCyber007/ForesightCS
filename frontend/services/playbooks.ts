import { apiClient, type PaginatedResponse } from '@/lib/apiClient';

export type Playbook = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'inactive';
  accountsInPlay: number;
  lastTriggered: string | null;
  steps: string[];
  createdAt: string;
};

type PlaybookApiRecord = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'inactive';
  accounts_in_play: number;
  last_triggered: string | null;
  steps: string[];
  created_at: string;
};

function mapPlaybook(record: PlaybookApiRecord): Playbook {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    trigger: record.trigger,
    status: record.status,
    accountsInPlay: record.accounts_in_play,
    lastTriggered: record.last_triggered,
    steps: record.steps,
    createdAt: record.created_at,
  };
}

export async function getPlaybooks(): Promise<Playbook[]> {
  const page = await apiClient.get<PaginatedResponse<PlaybookApiRecord>>(
    '/api/v1/playbooks/?page_size=200'
  );
  return page.results.map(mapPlaybook);
}
