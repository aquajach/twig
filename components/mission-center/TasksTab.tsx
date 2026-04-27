'use client';

import { allStorylines } from '@/engine/storylines';
import type { TaskDefinition, TaskStatus } from '@/engine/types';
import { useGameStore } from '@/stores/useGameStore';

const storylineTitles: Record<string, string> = Object.fromEntries(allStorylines.map((s) => [s.id, s.title]));

export function TasksTab() {
  const tasks = useGameStore((s) => s.tasks);
  const taskDefinitions = useGameStore((s) => s.taskDefinitions);

  const discovered = Object.entries(tasks)
    .filter(([, status]) => status !== 'hidden')
    .map(([id, status]) => ({
      id,
      status: status as Exclude<TaskStatus, 'hidden'>,
      definition: taskDefinitions[id],
    }))
    .filter(
      (t): t is { id: string; status: 'active' | 'completed'; definition: TaskDefinition } =>
        t.definition !== undefined,
    );

  const total = discovered.length;
  const completed = discovered.filter((t) => t.status === 'completed').length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const groups = new Map<string, typeof discovered>();
  for (const task of discovered) {
    const existing = groups.get(task.definition.storylineId) ?? [];
    existing.push(task);
    groups.set(task.definition.storylineId, existing);
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 py-4 border-b border-divider">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-semibold text-text-primary">
            Tasks: {completed}/{total} completed
          </h2>
          <span className="text-xs text-text-secondary">{percent}%</span>
        </div>
        <div
          className="h-2 w-full rounded-full bg-surface-solid overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Task completion progress"
        >
          <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="flex-1 px-6 py-4 space-y-6">
        {groups.size === 0 ? (
          <p className="text-sm text-text-disabled">No tasks yet. Check WeTalk for new messages.</p>
        ) : (
          Array.from(groups.entries()).map(([storylineId, items]) => (
            <section key={storylineId}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
                {storylineTitles[storylineId] ?? storylineId}
              </h3>
              <ul className="space-y-1.5">
                {items.map((task) => (
                  <li key={task.id} className="flex items-start gap-3 text-sm">
                    {task.status === 'completed' ? (
                      <span
                        role="img"
                        aria-label="Completed"
                        className="shrink-0 mt-0.5 size-4 rounded-sm bg-accent flex items-center justify-center"
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path
                            d="M1.5 5.5L4 8L8.5 2.5"
                            stroke="black"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span
                        role="img"
                        aria-label="Active"
                        className="shrink-0 mt-0.5 size-4 rounded-sm border border-text-secondary"
                      />
                    )}
                    <div
                      className={task.status === 'completed' ? 'text-text-disabled line-through' : 'text-text-primary'}
                    >
                      <div className="font-medium">{task.definition.title}</div>
                      {task.definition.description && (
                        <div className="text-xs text-text-secondary mt-0.5">{task.definition.description}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
