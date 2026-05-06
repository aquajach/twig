export const TASKBAR_LAUNCHER_BUTTON_WIDTH_PX = 120;

export const TASKBAR_LAUNCHER_GAP_PX = 8;

export const TASKBAR_LAUNCHER_STRIDE_PX = TASKBAR_LAUNCHER_BUTTON_WIDTH_PX + TASKBAR_LAUNCHER_GAP_PX;

/** Horizontal px offset from midpoint for a launcher’s center slot (indices left → right). For `transform-origin`: `calc(50% + Npx)`, pair with vertical `100%` (taskbar attaches below window area). */
export function taskbarLauncherOriginOffsetXpx(appIndex: number, launcherCount: number): number {
  return (appIndex - (launcherCount - 1) / 2) * TASKBAR_LAUNCHER_STRIDE_PX;
}
