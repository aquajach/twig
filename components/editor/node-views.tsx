'use client';

import { eventBlockNodeTypes } from '@/components/editor/event-block-views';
import {
  BrowserStateNodeView,
  ContextNodeView,
  MemoNodeView,
  NotificationNodeView,
  NpcMessageNodeView,
  StorylineRefNodeView,
  UnlockBrowserPageNodeView,
  UnlockNpcNodeView,
  WetalkLinkNodeView,
} from '@/components/editor/nodes/effect-target-node-views';
import { ConditionNodeView } from '@/components/editor/nodes/json-condition-node-view';
import { StepNodeView } from '@/components/editor/nodes/step-node-view';
import { TaskNodeView } from '@/components/editor/nodes/task-node-view';

export const storylineNodeTypes = {
  ...eventBlockNodeTypes,
  step: StepNodeView,
  condition: ConditionNodeView,
  task: TaskNodeView,
  unlock_npc: UnlockNpcNodeView,
  unlock_browser_page: UnlockBrowserPageNodeView,
  context: ContextNodeView,
  memo: MemoNodeView,
  notification: NotificationNodeView,
  npc_message: NpcMessageNodeView,
  wetalk_link: WetalkLinkNodeView,
  browser_state: BrowserStateNodeView,
  storyline_ref: StorylineRefNodeView,
};
