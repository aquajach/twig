/**
 * Validates all storyline graph files under engine/storylines/.
 * Linear `Storyline` / `StorylineStep` were removed; graphs live as `StorylineGraph` in TS files.
 * Use this script in CI or after edits: `npm run migrate:storylines`
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseStorylineFile } from '@/engine/codec';
import { allStorylines } from '@/engine/storylines';
import { validateGraph } from '@/engine/validate';

const STORYLINES_DIR = path.join(process.cwd(), 'engine', 'storylines');

function main(): void {
  const ids = new Set(allStorylines.map((g) => g.id));
  let errors = 0;

  for (const graph of allStorylines) {
    const filePath = path.join(STORYLINES_DIR, `${graph.id}.ts`);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing file for ${graph.id}: ${filePath}`);
      errors++;
      continue;
    }
    const parsed = parseStorylineFile(filePath, ids);
    const errs = validateGraph(parsed, ids).filter((e) => e.severity === 'error');
    if (errs.length) {
      console.error(`\n${graph.id}:`);
      for (const e of errs) {
        console.error(`  - [${e.nodeId ?? 'graph'}] ${e.message}`);
      }
      errors++;
    } else {
      console.log(`OK  ${graph.id}`);
    }
  }

  if (errors) {
    console.error(`\n${errors} storyline(s) failed validation.`);
    process.exit(1);
  }
  console.log('\nAll storylines validate.');
}

main();
