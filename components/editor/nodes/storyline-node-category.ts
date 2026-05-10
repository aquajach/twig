import {
  type AddableStorylineNodeType,
  addGroupIdForType,
  type StorylineAddGroupId,
} from '@/components/editor/flow-adapter';
import type { StorylineFlowNodeType } from '@/components/editor/nodes/storyline-flow-node';

/** Same grouping as the add-node menu (Flow / Events / Effects). */
export function storylineNodeAddGroup(type: StorylineFlowNodeType): StorylineAddGroupId {
  return addGroupIdForType(type as AddableStorylineNodeType);
}
