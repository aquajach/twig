import type { StorylineGraph } from '@/engine/types';
import { chartViz } from './chartViz';
import { ebankingLoginBug } from './ebankingLoginBug';
import { gameStart } from './gameStart';
import { hiddenCoffeeQuest } from './hiddenCoffeeQuest';
import { news } from './news';

export const allStorylines: StorylineGraph[] = [gameStart, ebankingLoginBug, chartViz, news, hiddenCoffeeQuest];
