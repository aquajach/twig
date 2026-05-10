'use client';

import { Menu, MenuItem, Popover, SubmenuTrigger } from 'react-aria-components';
import { PiCaretDoubleRightDuotone, PiCaretRight, PiFlowArrowDuotone, PiLightningDuotone } from 'react-icons/pi';
import {
  storylineMenuItem,
  storylineMenuSubmenuTrigger,
  storylineMenuSurface,
} from '@/components/editor/editor-dialog-styles';
import {
  type AddableStorylineNodeType,
  formatAddMenuTypeLabel,
  type StorylineAddMenuSubgroupId,
  sortedStorylineAddMenuGroups,
  topLevelStorylineAddMenuTypes,
} from '@/components/editor/flow-adapter';

function SubgroupIcon({ subgroup }: { subgroup: StorylineAddMenuSubgroupId }) {
  const Ico = subgroup === 'events' ? PiLightningDuotone : PiCaretDoubleRightDuotone;
  return <Ico className="shrink-0" size={16} aria-hidden />;
}

export function StorylineAddNodeMenuItems({ onSelectType }: { onSelectType: (t: AddableStorylineNodeType) => void }) {
  const groups = sortedStorylineAddMenuGroups();
  const topLevel = topLevelStorylineAddMenuTypes();
  return (
    <Menu className={storylineMenuSurface} aria-label="Add node types">
      {topLevel.map((t) => (
        <MenuItem
          key={t}
          id={t}
          className={storylineMenuItem}
          textValue={formatAddMenuTypeLabel(t)}
          onAction={() => onSelectType(t)}
        >
          <PiFlowArrowDuotone className="shrink-0" size={16} aria-hidden />
          {formatAddMenuTypeLabel(t)}
        </MenuItem>
      ))}
      {groups.map((g) => (
        <SubmenuTrigger key={g.id}>
          <MenuItem id={`grp-${g.id}`} className={storylineMenuSubmenuTrigger} textValue={g.title}>
            <SubgroupIcon subgroup={g.id} />
            <span className="min-w-0 flex-1">{g.title}</span>
            <PiCaretRight className="shrink-0 text-text-secondary" size={14} aria-hidden />
          </MenuItem>
          <Popover className="nodrag" placement="right top" offset={4}>
            <Menu className={storylineMenuSurface} aria-label={`${g.title} node types`}>
              {g.types.map((t) => (
                <MenuItem
                  key={t}
                  id={t}
                  className={storylineMenuItem}
                  textValue={formatAddMenuTypeLabel(t)}
                  onAction={() => onSelectType(t)}
                >
                  {formatAddMenuTypeLabel(t)}
                </MenuItem>
              ))}
            </Menu>
          </Popover>
        </SubmenuTrigger>
      ))}
    </Menu>
  );
}
