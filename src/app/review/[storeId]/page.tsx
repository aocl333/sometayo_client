import { mockStores } from '@/mocks/stores';
import ReviewClient from './ReviewClient';

export function generateStaticParams() {
  return mockStores.map((store) => ({
    storeId: store.id,
  }));
}

interface PageProps {
  params: { storeId: string };
}

export default function ReviewPage({ params }: PageProps) {
  return <ReviewClient storeId={params.storeId} />;
}
