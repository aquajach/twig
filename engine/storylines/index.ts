import type { Storyline } from '@/engine/types';
import { ebankingLoginBug } from './ebanking-login-bug';
import { gameStart } from './game-start';
import { hiddenCoffeeQuest } from './hidden-coffee-quest';

export const allStorylines: Storyline[] = [gameStart, ebankingLoginBug, hiddenCoffeeQuest];
