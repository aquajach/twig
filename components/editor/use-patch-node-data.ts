'use client';

import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

export function usePatchNodeData(nodeId: string) {
  const { setNodes } = useReactFlow();
  return useCallback(
    (patch: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...(n.data as Record<string, unknown>), ...patch } } : n)),
      );
    },
    [nodeId, setNodes],
  );
}
