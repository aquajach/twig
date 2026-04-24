import { Chat } from '@/components/Chat';
import { verifySession } from '@/utils/session/verifySession';

export default async function Home() {
  await verifySession();
  return <Chat />;
}
