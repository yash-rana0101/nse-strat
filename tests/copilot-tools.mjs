const screenshotTools = [
  'Read Multi TF Trend',
  'Read Consensus Report',
  'Read Market Regime',
  'Read Relative Strength',
  'Read Session Context',
  'Read Event Risk',
  'Read Support Resistance',
  'Read Volume Profile',
  'Read Chart Patterns',
  'Read Forecast',
  'Read Prediction',
];

export function checkDiagramSizes(browser, check) {
  for (const width of [1440, 1280, 1200, 1024, 768, 600, 390, 320]) {
    browser('set', 'viewport', String(width), '1100');
    check(
      "[...root.querySelectorAll('.graph-node')].every(n => n.scrollWidth <= n.clientWidth && n.scrollHeight <= n.clientHeight)",
      `diagram labels fit their boxes at ${width}px`
    );
  }
  browser('set', 'viewport', '1440', '1100');
}

export function checkToolLibrary(browser, check) {
  check(
    "root.querySelector('.library-more').textContent.includes('+15 more tools')",
    'diagram advertises the additional 15 tools'
  );
  browser('focus', '.tool-library summary');
  browser('press', 'Enter');
  check(
    "root.querySelector('.tool-library').open && root.querySelectorAll('.library-list li').length === 18 && new Set([...root.querySelectorAll('.library-list code')].map(n => n.textContent)).size === 18",
    'keyboard opens a library of 18 unique tools'
  );
  check(
    "[...root.querySelectorAll('.library-list small')].filter(n => n.textContent.includes('Control')).length === 2",
    'control tools are identified separately from the replay'
  );
  browser('press', 'Enter');
  check(
    "!root.querySelector('.tool-library').open",
    'keyboard closes the tool library'
  );
  check(
    `JSON.stringify([...root.querySelectorAll('[data-tool-row] strong')].map(n => n.textContent)) === ${JSON.stringify(JSON.stringify(screenshotTools))}`,
    'activity includes all 11 screenshot tool calls in the correct order'
  );
}

export function observeToolActivity(browser) {
  browser(
    'eval',
    `window.toolCalls = []; window.toolReturns = []; window.toolScroll = false;
    new MutationObserver(records => {
      records.forEach(record => {
        const row = record.target;
        if (!row.matches('[data-tool-row]')) return;
        const list = row.dataset.state === 'calling' ? window.toolCalls : row.dataset.state === 'done' ? window.toolReturns : null;
        if (list && !list.includes(row.dataset.toolRow)) list.push(row.dataset.toolRow);
        if (row.dataset.state === 'done' && document.querySelector('[data-terminal-body]').scrollTop > 0) window.toolScroll = true;
      });
    }).observe(document.querySelector('[data-tool-feed]'), {subtree:true, attributes:true, attributeFilter:['data-state']});`
  );
}

export function checkCompletedTools(browser, check) {
  check(
    "root.querySelector('[data-tool-progress]').getAttribute('role') === 'status' && root.querySelector('[data-tool-progress]').getAttribute('aria-live') === 'polite' && root.querySelector('[data-tool-progress]').getAttribute('aria-atomic') === 'true'",
    'tool progress is exposed as a polite status announcement'
  );
  check(
    'JSON.stringify(window.toolCalls) === JSON.stringify(Array.from({length:11}, (_, i) => String(i))) && JSON.stringify(window.toolReturns) === JSON.stringify(window.toolCalls)',
    'every tool is called and returns in order before the result'
  );
  check(
    "[...root.querySelectorAll('[data-tool-row]')].every(n => n.dataset.state === 'done') && root.querySelector('[data-tool-progress]').textContent.includes('11 / 11 results returned')",
    'response waits for all 11 tool results'
  );
  check(
    'window.toolScroll',
    'terminal follows the active tool through the longer list'
  );
  browser('click', '.tool-telemetry summary');
  check(
    "root.querySelector('.tool-telemetry').open && root.querySelectorAll('.telemetry-results .tool-row').length === 11",
    'completed telemetry keeps every tool result available'
  );
  browser('click', '.tool-telemetry summary');
}
