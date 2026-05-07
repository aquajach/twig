/** One entry in `browserPageStates.fikma.screens` (JSON-serialisable). */
export type FikmaScreenState = {
  id: string;
  name: string;
  /** Must match a key in `fikmaScreenRegistry`. */
  screenKey: string;
  /** Passed to the registered screen component. */
  props?: Record<string, unknown>;
};

export type FikmaScreenComponentProps = {
  props: Record<string, unknown>;
};
