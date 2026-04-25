import { GameShell } from '@/components/GameShell';
import { verifySession } from '@/utils/session/verifySession';

export default async function Home() {
  await verifySession();
  return <GameShell />;
}
