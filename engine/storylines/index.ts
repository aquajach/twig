import type { StorylineGraph } from '@/engine/types';
import { ebankingLoginBug } from './ebankingLoginBug';
import { gameStart } from './gameStart';
import { hiddenCoffeeQuest } from './hiddenCoffeeQuest';

export const allStorylines: StorylineGraph[] = [gameStart, ebankingLoginBug, hiddenCoffeeQuest];
