'use client';

import type { ComponentType } from 'react';
import { AssetAllocationPieMockupScreen } from '@/components/browser/pages/fikma-screens/AssetAllocationPieMockupScreen';
import type { FikmaScreenComponentProps } from '@/components/browser/pages/fikma-screens/types';

export const fikmaScreenRegistry = {
  'asset-allocation-pie-mockup': AssetAllocationPieMockupScreen,
} satisfies Record<string, ComponentType<FikmaScreenComponentProps>>;

export type FikmaScreenRegistryKey = keyof typeof fikmaScreenRegistry;

export function getFikmaScreen(key: string): ComponentType<FikmaScreenComponentProps> | undefined {
  if (key in fikmaScreenRegistry) {
    return fikmaScreenRegistry[key as FikmaScreenRegistryKey];
  }
  return undefined;
}
