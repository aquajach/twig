'use client';

import {
  addEdge,
  Background,
  type Connection,
  Controls,
  type IsValidConnection,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { StorylineEditorUiContext } from '@/components/editor/editor-ui-context';
import {
  ADDABLE_TYPES,
  type AddableStorylineNodeType,
  buildStorylineEditorUiContext,
  defaultDataForNodeType,
  flowElementsToStorylineGraph,
  graphToFlowElements,
  type StorylineGraphMeta,
} from '@/components/editor/flow-adapter';
import { storylineNodeTypes } from '@/components/editor/node-views';
import {
  EFFECT_NODE_TARGET_HANDLE,
  isStepEffectSourceHandle,
  isStepLinkTargetHandle,
  STEP_DEPS_TARGET_HANDLE,
  TASK_EFFECT_COMPLETE_HANDLE,
  TASK_EFFECT_CREATE_HANDLE,
} from '@/components/editor/step-link-fields';
import { isEventBlockNodeType } from '@/engine/event-blocks';
import type { StorylineGraph } from '@/engine/types';

export type StorylineFlowCanvasHandle = {
  getGraph: () => StorylineGraph;
};

type StorylineFlowCanvasProps = {
  initialGraph: StorylineGraph;
  /** Registry options for selects (same as API list). */
  allStorylineOptions: { label: string; value: string }[];
  getMeta: () => StorylineGraphMeta;
};

function formatAddableTypeLabel(t: AddableStorylineNodeType): string {
  if (t.startsWith('evt_')) return `event: ${t.slice(4).replace(/_/g, ' ')}`;
  return t;
}

const EFFECT_TARGET_NODE_TYPES = new Set([
  'unlock_npc',
  'context',
  'memo',
  'notification',
  'npc_message',
  'browser_state',
  'storyline_ref',
]);

/** Delete / Backspace removes selected nodes and edges; must run inside `<ReactFlow>`. */
function GraphKeyboardDelete() {
  const { getNodes, getEdges, deleteElements } = useReactFlow();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      if (e.repeat) return;
      const el = e.target;
      if (el instanceof HTMLElement && el.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }

      const selectedNodes = getNodes().filter((n) => n.selected);
      const selectedEdges = getEdges().filter((edge) => edge.selected);
      if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

      e.preventDefault();
      e.stopPropagation();
      void deleteElements({
        nodes: selectedNodes.map((n) => ({ id: n.id })),
        edges: selectedEdges.map((ed) => ({ id: ed.id })),
      });
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [deleteElements, getEdges, getNodes]);

  return null;
}

function AddToolbar() {
  const { setNodes, screenToFlowPosition } = useReactFlow();
  const [addType, setAddType] = useState<AddableStorylineNodeType>('step');
  const add = () => {
    const id = `n-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const pos = screenToFlowPosition({ x: 140 + Math.random() * 60, y: 140 + Math.random() * 60 });
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: addType,
        position: pos,
        data: defaultDataForNodeType(addType),
      },
    ]);
  };
  return (
    <Panel
      position="top-left"
      className="z-10 m-2 flex items-center gap-2 rounded border border-zinc-600 bg-zinc-900/95 p-2 text-xs text-zinc-100 shadow-lg"
    >
      <label className="flex items-center gap-1">
        <span className="text-zinc-400">Add</span>
        <select
          className="nodrag rounded border border-zinc-600 bg-zinc-950 px-1 py-0.5"
          value={addType}
          onChange={(e) => setAddType(e.target.value as AddableStorylineNodeType)}
        >
          {ADDABLE_TYPES.map((t) => (
            <option key={t} value={t}>
              {formatAddableTypeLabel(t)}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="nodrag rounded bg-sky-700 px-2 py-0.5 hover:bg-sky-600" onClick={add}>
        Add node
      </button>
    </Panel>
  );
}

const FlowSurface = forwardRef<StorylineFlowCanvasHandle, StorylineFlowCanvasProps>(function FlowSurface(
  { initialGraph, allStorylineOptions, getMeta },
  ref,
) {
  const ui = useMemo(() => buildStorylineEditorUiContext(allStorylineOptions), [allStorylineOptions]);
  const { nodes: n0, edges: e0 } = useMemo(() => graphToFlowElements(initialGraph), [initialGraph]);
  const [nodes, _setNodes, onNodesChange] = useNodesState(n0);
  const [edges, setEdges, onEdgesChange] = useEdgesState(e0);

  useImperativeHandle(
    ref,
    () => ({
      getGraph: () => flowElementsToStorylineGraph(nodes, edges, getMeta()),
    }),
    [nodes, edges, getMeta],
  );

  const onConnect = useCallback(
    (c: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...c,
            id: `e-${c.source}-${c.target}-${c.targetHandle}-${crypto.randomUUID().slice(0, 8)}`,
            sourceHandle: c.sourceHandle ?? 'out',
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const isValidConnection = useCallback<IsValidConnection>(
    (c) => {
      if (!c.source || !c.target) return false;
      if (c.source === c.target) return false;
      const srcNode = nodes.find((n) => n.id === c.source);
      const tgtNode = nodes.find((n) => n.id === c.target);
      if (!srcNode || !tgtNode) return false;
      const sh = c.sourceHandle ?? 'out';
      const th = c.targetHandle;

      if (srcNode.type === 'step' && isStepEffectSourceHandle(sh)) {
        if (tgtNode.type === 'task') {
          return !!th && (th === TASK_EFFECT_CREATE_HANDLE || th === TASK_EFFECT_COMPLETE_HANDLE);
        }
        if (!EFFECT_TARGET_NODE_TYPES.has(tgtNode.type ?? '')) return false;
        // Single unnamed target handle on effect nodes — targetHandle may be null/undefined from the handle.
        return !th || th === EFFECT_NODE_TARGET_HANDLE;
      }

      if (tgtNode.type === 'step' && th && isStepLinkTargetHandle(th)) {
        if (th === STEP_DEPS_TARGET_HANDLE) {
          if (sh !== 'out') return false;
          const t = srcNode.type;
          return t === 'condition' || t === 'step' || t === 'task' || isEventBlockNodeType(t);
        }
        if (th === 'triggeredBy' || th.startsWith('triggeredBy_')) {
          if (sh !== 'out') return false;
          const t = srcNode.type;
          return t === 'step' || t === 'task' || isEventBlockNodeType(t);
        }
        if (th === 'conditions' || th.startsWith('conditions_')) {
          return sh === 'out' && srcNode.type === 'condition';
        }
        return false;
      }

      return false;
    },
    [nodes],
  );

  return (
    <StorylineEditorUiContext.Provider value={ui}>
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          nodeTypes={storylineNodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          deleteKeyCode={null}
          defaultEdgeOptions={{ type: 'default', selectable: true, deletable: true }}
          snapToGrid
          colorMode="dark"
        >
          <GraphKeyboardDelete />
          <Background gap={16} size={1} color="#27272a" />
          <Controls className="!m-2 !border-zinc-600 !bg-zinc-900 !text-zinc-200" />
          <MiniMap pannable zoomable />
          <AddToolbar />
        </ReactFlow>
      </div>
    </StorylineEditorUiContext.Provider>
  );
});

export const StorylineFlowCanvas = forwardRef<StorylineFlowCanvasHandle, StorylineFlowCanvasProps>(
  function StorylineFlowCanvas(props, ref) {
    return (
      <ReactFlowProvider>
        <FlowSurface ref={ref} {...props} />
      </ReactFlowProvider>
    );
  },
);
