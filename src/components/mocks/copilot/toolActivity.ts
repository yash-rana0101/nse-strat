type Schedule = (callback: () => void, delay: number) => void;

export function resetToolActivity(root: HTMLElement) {
  const rows = root.querySelectorAll<HTMLElement>('[data-tool-row]');
  rows.forEach((row) => {
    row.dataset.state = 'waiting';
    const status = row.querySelector('.tool-state')!;
    status.textContent = '○';
    status.setAttribute('aria-label', 'Waiting');
  });
  root.querySelector('[data-tool-progress]')!.textContent =
    `0 / ${rows.length} tools called`;
}

export function animateToolActivity(
  root: HTMLElement,
  state: 'calling' | 'done',
  schedule: Schedule
) {
  const rows = root.querySelectorAll<HTMLElement>('[data-tool-row]');
  const body = root.querySelector<HTMLElement>('[data-terminal-body]')!;
  const progress = root.querySelector<HTMLElement>('.tool-progress')!;
  const interval = 280;
  rows.forEach((row, index) => {
    schedule(() => {
      row.dataset.state = state;
      const status = row.querySelector('.tool-state')!;
      status.textContent = state === 'calling' ? '↗' : '✓';
      status.setAttribute(
        'aria-label',
        state === 'calling' ? 'Calling' : 'Complete'
      );
      root.querySelector('[data-tool-progress]')!.textContent =
        `${index + 1} / ${rows.length} ${state === 'calling' ? 'tools called' : 'results returned'}`;
      // Scroll only the terminal, never the page, to keep each active call visible.
      body.scrollTop +=
        row.getBoundingClientRect().top -
        body.getBoundingClientRect().top -
        progress.offsetHeight -
        12;
    }, index * interval);
  });
  return rows.length * interval + 650;
}
