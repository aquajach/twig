'use client';

import {
  addEdge,
  Background,
  type Connection,
  Controls,
  type IsValidConnection,
  MiniMap,
  type OnReconnect,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  reconnectEdge,
  useEdges,
  useEdgesState,
  useNodes,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { useKeyboard } from 'react-aria';
import { Button, MenuTrigger, Popover } from 'react-aria-components';
import {
  storylineKbdHint,
  storylineToolbarBtnSecondary,
  storylineToolbarPanel,
} from '@/components/editor/editor-dialog-styles';
import { StorylineEditorUiContext } from '@/components/editor/editor-ui-context';
import {
  type AddableStorylineNodeType,
  buildStorylineEditorUiContext,
  type ContextSegmentReference,
  defaultDataForNodeType,
  flowElementsToStorylineGraph,
  graphToFlowElements,
  STORYLINE_EFFECT_TARGET_TYPES,
  type StorylineGraphMeta,
} from '@/components/editor/flow-adapter';
import { storylineNodeTypes } from '@/components/editor/node-views';
import {
  EFFECT_NODE_TARGET_HANDLE,
  EVENT_ENABLED_TARGET_HANDLE,
  isEventEnabledTargetHandle,
  isStepEffectSourceHandle,
  isStepLinkTargetHandle,
  STEP_DEPS_TARGET_HANDLE,
  TASK_EFFECT_COMPLETE_HANDLE,
  TASK_EFFECT_CREATE_HANDLE,
} from '@/components/editor/step-link-fields';
import { StorylineAddNodeMenuItems } from '@/components/editor/storyline-add-node-menu';
import { isEventBlockNodeType } from '@/engine/event-blocks';
import type { StorylineGraph } from '@/engine/types';
import '@xyflow/react/dist/style.css';
import {
  forwardRef,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PiPlus, PiTrashDuotone } from 'react-icons/pi';

export type StorylineFlowCanvasHandle = {
  getGraph: () => StorylineGraph;
};

type StorylineFlowCanvasProps = {
  initialGraph: StorylineGraph;
  /** Registry options for selects (same as API list). */
  allStorylineOptions: { label: string; value: string }[];
  getMeta: () => StorylineGraphMeta;
  contextBundle: {
    contextSegments: Record<string, Record<string, string>>;
    contextReferences: Record<string, Record<string, ContextSegmentReference[]>>;
  };
  refreshContextSegments: () => Promise<void>;
};

const EFFECT_TARGET_NODE_TYPES = new Set<string>(STORYLINE_EFFECT_TARGET_TYPES);

function focusInsideEditable(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest('input, textarea, select, [contenteditable="true"]');
}

function StorylineFlowToolbar({
  addNodeAtScreen,
  deleteSelection,
  hasSelection,
}: {
  addNodeAtScreen: (type: AddableStorylineNodeType, screen: { x: number; y: number }) => void;
  deleteSelection: () => void;
  hasSelection: boolean;
}) {
  const toolbarPlacementScreen = useCallback(() => {
    return { x: 120 + Math.random() * 80, y: 120 + Math.random() * 80 };
  }, []);

  return (
    <Panel position="top-left" className={storylineToolbarPanel}>
      <MenuTrigger>
        <Button className={storylineToolbarBtnSecondary}>
          <PiPlus aria-hidden />
          Add node
          <span className="ml-1 flex items-center gap-0.5 text-xs">
            <kbd className={storylineKbdHint}>Shift</kbd>+<kbd className={storylineKbdHint}>A</kbd>
          </span>
        </Button>
        <Popover className="nodrag" placement="bottom start" offset={6}>
          <StorylineAddNodeMenuItems onSelectType={(t) => addNodeAtScreen(t, toolbarPlacementScreen())} />
        </Popover>
      </MenuTrigger>

      <Button
        className={storylineToolbarBtnSecondary}
        isDisabled={!hasSelection}
        onPress={deleteSelection}
        aria-label="Delete selected nodes or edges"
      >
        <PiTrashDuotone aria-hidden />
        Delete
        <span className="ml-1 flex items-center gap-0.5">
          <kbd className={storylineKbdHint}>Del</kbd>
        </span>
      </Button>
    </Panel>
  );
}

const FlowSurface = forwardRef<StorylineFlowCanvasHandle, StorylineFlowCanvasProps>(function FlowSurface(
  { initialGraph, allStorylineOptions, getMeta, contextBundle, refreshContextSegments },
  ref,
) {
  const ui = useMemo(
    () => buildStorylineEditorUiContext(allStorylineOptions, contextBundle, refreshContextSegments),
    [allStorylineOptions, contextBundle, refreshContextSegments],
  );
  const { nodes: n0, edges: e0 } = useMemo(() => graphToFlowElements(initialGraph), [initialGraph]);
  const [nodes, setNodes, onNodesChange] = useNodesState(n0);
  const [edges, setEdges, onEdgesChange] = useEdgesState(e0);

  const nodesLive = useNodes();
  const edgesLive = useEdges();
  const hasSelection = nodesLive.some((n) => n.selected) || edgesLive.some((edge) => edge.selected);

  const { screenToFlowPosition, deleteElements, getNodes, getEdges } = useReactFlow();

  const pointerInPaneRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const surfaceRef = useRef<HTMLDivElement>(null);
  const floatAnchorRef = useRef<HTMLButtonElement>(null);

  const [floatOpen, setFloatOpen] = useState(false);
  const [floatPos, setFloatPos] = useState({ x: 0, y: 0 });

  const addNodeAtScreen = useCallback(
    (type: AddableStorylineNodeType, screen: { x: number; y: number }) => {
      const id = `n-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
      const position = screenToFlowPosition(screen);
      setNodes((nds) => [
        ...nds,
        {
          id,
          type,
          position,
          data: defaultDataForNodeType(type),
        },
      ]);
    },
    [screenToFlowPosition, setNodes],
  );

  const deleteSelection = useCallback(() => {
    const selectedNodes = getNodes().filter((n) => n.selected);
    const selectedEdges = getEdges().filter((edge) => edge.selected);
    if (selectedNodes.length === 0 && selectedEdges.length === 0) return;
    void deleteElements({
      nodes: selectedNodes.map((n) => ({ id: n.id })),
      edges: selectedEdges.map((ed) => ({ id: ed.id })),
    });
  }, [deleteElements, getEdges, getNodes]);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e: ReactKeyboardEvent) => {
      if (focusInsideEditable(e.target)) return;
      if (e.repeat) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedNodes = getNodes().filter((n) => n.selected);
        const selectedEdges = getEdges().filter((edge) => edge.selected);
        if (selectedNodes.length === 0 && selectedEdges.length === 0) return;
        e.preventDefault();
        deleteSelection();
        return;
      }

      if (e.key === 'a' || e.key === 'A') {
        if (!e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
        if (!pointerInPaneRef.current) return;
        e.preventDefault();
        const { x, y } = lastPointerRef.current;
        setFloatPos({ x, y });
        setFloatOpen(true);
      }
    },
  });

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

  const onReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
    },
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

      if (isEventBlockNodeType(tgtNode.type) && th && isEventEnabledTargetHandle(th)) {
        if (th === EVENT_ENABLED_TARGET_HANDLE) {
          if (sh !== 'out') return false;
          const t = srcNode.type;
          return t === 'condition' || t === 'step' || t === 'task' || isEventBlockNodeType(t);
        }
        if (th === 'enabledBy' || th.startsWith('enabledBy_')) {
          if (sh !== 'out') return false;
          const t = srcNode.type;
          return t === 'step' || t === 'task' || isEventBlockNodeType(t);
        }
        if (th === 'enabledConditions' || th.startsWith('enabledConditions_')) {
          return sh === 'out' && srcNode.type === 'condition';
        }
        return false;
      }

      return false;
    },
    [nodes],
  );

  const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
    event.preventDefault();
    setFloatPos({ x: event.clientX, y: event.clientY });
    setFloatOpen(true);
  }, []);

  const onPaneMouseMove = useCallback((event: React.MouseEvent) => {
    pointerInPaneRef.current = true;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  const onPaneMouseEnter = useCallback(() => {
    pointerInPaneRef.current = true;
  }, []);

  const onPaneMouseLeave = useCallback(() => {
    pointerInPaneRef.current = false;
  }, []);

  const onPaneClick = useCallback(() => {
    surfaceRef.current?.focus({ preventScroll: true });
  }, []);

  /** Popovers port to `document.body`, so pane `contains()` misses the menu. While open, block the native menu everywhere except real text fields. */
  useEffect(() => {
    if (!floatOpen) return;
    const onDocumentContextMenu = (e: MouseEvent) => {
      if (focusInsideEditable(e.target)) return;
      e.preventDefault();
    };
    document.addEventListener('contextmenu', onDocumentContextMenu, true);
    return () => document.removeEventListener('contextmenu', onDocumentContextMenu, true);
  }, [floatOpen]);

  return (
    <StorylineEditorUiContext.Provider value={ui}>
      <div
        ref={surfaceRef}
        role="application"
        aria-label="Storyline graph editor"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: focus target for react-aria useKeyboard canvas shortcuts
        tabIndex={0}
        className="h-full min-h-0 w-full outline-none focus-visible:ring-1 focus-visible:ring-accent"
        {...keyboardProps}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          isValidConnection={isValidConnection}
          nodeTypes={storylineNodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          deleteKeyCode={null}
          defaultEdgeOptions={{ type: 'default', selectable: true, deletable: true }}
          snapToGrid
          colorMode="dark"
          onPaneClick={onPaneClick}
          onPaneContextMenu={onPaneContextMenu}
          onPaneMouseMove={onPaneMouseMove}
          onPaneMouseEnter={onPaneMouseEnter}
          onPaneMouseLeave={onPaneMouseLeave}
        >
          <StorylineFlowToolbar
            addNodeAtScreen={addNodeAtScreen}
            deleteSelection={deleteSelection}
            hasSelection={hasSelection}
          />
          {floatOpen ? (
            <>
              <button
                type="button"
                ref={floatAnchorRef}
                tabIndex={-1}
                className="pointer-events-none fixed z-[10001] h-px w-px opacity-0"
                style={{ left: floatPos.x, top: floatPos.y }}
                aria-hidden
              />
              <Popover
                triggerRef={floatAnchorRef}
                isOpen={floatOpen}
                onOpenChange={setFloatOpen}
                placement="bottom start"
                className="nodrag"
                offset={6}
              >
                <StorylineAddNodeMenuItems
                  onSelectType={(t) => {
                    addNodeAtScreen(t, floatPos);
                    setFloatOpen(false);
                  }}
                />
              </Popover>
            </>
          ) : null}
          <Background gap={16} size={1} color="rgba(255, 255, 255, 0.08)" />
          <Controls className="!m-2 !rounded-lg !border !border-specular !bg-surface-solid !text-text-primary" />
          <MiniMap pannable zoomable />
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
