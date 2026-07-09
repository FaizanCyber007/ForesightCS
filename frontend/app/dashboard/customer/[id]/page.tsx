import { notFound } from 'next/navigation';

import { Customer360 } from '@/components/features/customer-360';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { getCustomerById } from '@/services/api';

export const dynamic = 'force-dynamic';

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <PageWrapper className="space-y-6 py-8 lg:py-10">
      <Customer360 customer={customer} />
    </PageWrapper>
  );
}
