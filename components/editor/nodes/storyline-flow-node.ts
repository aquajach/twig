import type { Node, NodeProps } from '@xyflow/react';
import type { GraphNode } from '@/engine/types';

/** React Flow node `type` string for every node kind in the storyline editor. */
export type StorylineFlowNodeType = GraphNode['type'];

export type StorylineFlowReactNode<K extends StorylineFlowNodeType> = Node<Record<string, unknown>, K>;

export type StorylineNodeProps<K extends StorylineFlowNodeType = StorylineFlowNodeType> = NodeProps<
  StorylineFlowReactNode<K>
>;

/** Human-readable heading for the canvas (underscores → spaces; `evt_` prefix dropped). */
export function storylineFlowNodeTypeLabel(type: StorylineFlowNodeType): string {
  if (type.startsWith('evt_')) return type.slice(4).replace(/_/g, ' ');
  return type.replace(/_/g, ' ');
}
