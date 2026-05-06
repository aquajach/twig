import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from 'react';
import { BrowserApp } from '@/components/browser/BrowserApp';
import { BrowserIcon } from '@/components/icons/BrowserIcon';
import { MissionIcon } from '@/components/icons/MissionIcon';
import { WeTalkIcon } from '@/components/icons/WeTalkIcon';
import { MissionCenterApp } from '@/components/mission-center/MissionCenterApp';
import { WeTalkApp } from '@/components/wetalk/WeTalkApp';
import type { AppId } from '@/stores/useWindowStore';

type SvgIcon = (props: ComponentPropsWithoutRef<'svg'>) => ReactNode;

/** Default icon size for launcher-style chrome (taskbar, etc.). */
export const DEFAULT_APP_ICON_CLASSNAME = 'h-6 w-6';

export type ShellApp = {
  id: AppId;
  label: string;
  Icon: SvgIcon;
  Component: ComponentType;
};

export const APPS: ShellApp[] = [
  { id: 'wetalk', label: '微談', Icon: WeTalkIcon, Component: WeTalkApp },
  { id: 'browser', label: '瀏覽器', Icon: BrowserIcon, Component: BrowserApp },
  { id: 'mission-center', label: '任務中心', Icon: MissionIcon, Component: MissionCenterApp },
];

const shellAppsById = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<AppId, ShellApp>;

export function getAppLabel(id: AppId): string {
  return shellAppsById[id].label;
}

export type AppIconProps = {
  id: AppId;
  className?: string;
};

export function AppIcon({ id, className = DEFAULT_APP_ICON_CLASSNAME }: AppIconProps) {
  const Icon = shellAppsById[id].Icon;
  return <Icon className={className} />;
}
