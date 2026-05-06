import type { StorylineGraph } from '@/engine/types';
import { chartViz } from './chartViz';
import { ebankingLoginBug } from './ebankingLoginBug';
import { gameStart } from './gameStart';
import { hiddenCoffeeQuest } from './hiddenCoffeeQuest';

export const allStorylines: StorylineGraph[] = [chartViz, gameStart, ebankingLoginBug, hiddenCoffeeQuest];
