'use client';

import { createContext, useContext } from 'react';
import type { StorylineEditorUiContextValue } from '@/components/editor/flow-adapter';

export const StorylineEditorUiContext = createContext<StorylineEditorUiContextValue | null>(null);

export function useEditorUi(): StorylineEditorUiContextValue {
  const v = useContext(StorylineEditorUiContext);
  if (!v) {
    throw new Error('StorylineEditorUiContext missing');
  }
  return v;
}
