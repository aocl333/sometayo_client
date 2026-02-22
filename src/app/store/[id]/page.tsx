import { mockStores } from '@/mocks/stores';
import StoreDetailClient from './StoreDetailClient';

export function generateStaticParams() {
  return mockStores.map((store) => ({
    id: store.id,
  }));
}

interface PageProps {
  params: { id: string };
}

export default function StoreDetailPage({ params }: PageProps) {
  return <StoreDetailClient storeId={params.id} />;
}
