import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { BrowserIcon } from '@/components/icons/BrowserIcon';
import { MissionIcon } from '@/components/icons/MissionIcon';
import { WeTalkIcon } from '@/components/icons/WeTalkIcon';
import type { AppId } from '@/stores/useWindowStore';

type SvgIcon = (props: ComponentPropsWithoutRef<'svg'>) => ReactNode;

/** Default icon size for launcher-style chrome (taskbar, etc.). */
export const DEFAULT_APP_ICON_CLASSNAME = 'h-6 w-6';

export type ShellApp = {
  id: AppId;
  label: string;
  Icon: SvgIcon;
};

export const APPS: ShellApp[] = [
  { id: 'wetalk', label: '微談', Icon: WeTalkIcon },
  { id: 'browser', label: '瀏覽器', Icon: BrowserIcon },
  { id: 'mission-center', label: '任務中心', Icon: MissionIcon },
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
