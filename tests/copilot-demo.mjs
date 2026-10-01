import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  checkToolLibrary,
  observeToolActivity,
  checkCompletedTools,
  checkDiagramSizes,
} from './copilot-tools.mjs';

// Run against the dev or preview server with agent-browser on PATH.
const url = process.argv[2] || 'http://127.0.0.1:4321/';
const session = `copilot-test-${process.pid}`;
function browser(...args) {
  if (args[0] === 'click' || args[0] === 'dblclick') {
    // Keep interaction targets clear of the site's sticky navigation.
    browser(
      'eval',
      `document.querySelector(${JSON.stringify(args[1])}).scrollIntoView({block:'center', behavior:'instant'});`
    );
  }
  const output = execFileSync(
    'agent-browser',
    ['--session', session, '--json', ...args],
    { encoding: 'utf8', timeout: 35000 }
  );
  const response = JSON.parse(output);
  assert.equal(response.success, true, response.error);
  return response.data;
}
function check(expression, message) {
  const result = browser(
    'eval',
    `(() => { const root = document.querySelector('strat-copilot-demo'); return Boolean(${expression}); })()`
  ).result;
  assert.equal(result, true, message);
  console.log(`PASS ${message}`);
}
function complete() {
  browser(
    'wait',
    '--fn',
    "document.querySelector('strat-copilot-demo').dataset.phase === 'answer'"
  );
}
function observePhases() {
  browser(
    'eval',
    `window.demoObserver?.disconnect(); window.demoPhases = []; window.demoObserver = new MutationObserver(() => { const phase = document.querySelector('strat-copilot-demo').dataset.phase; if (window.demoPhases.at(-1) !== phase) window.demoPhases.push(phase); }); window.demoObserver.observe(document.querySelector('strat-copilot-demo'), {attributes:true, attributeFilter:['data-phase']});`
  );
}
function allPhases() {
  check(
    "JSON.stringify(window.demoPhases) === JSON.stringify(['context','select','tools','data','reason','answer'])",
    'all six workflow stages execute in order'
  );
}

try {
  browser('open', url);
  browser(
    'wait',
    '--fn',
    "customElements.get('strat-copilot-demo') && !document.querySelector('#copilot-find').disabled"
  );
  // Disable optional analytics in the browser-only test session.
  browser(
    'eval',
    "localStorage.setItem('strat_cookie_consent', JSON.stringify({analytics:false,marketing:false}));"
  );
  browser('reload');
  browser('wait', '--fn', "!document.querySelector('#copilot-find').disabled");
  // Keep automated page scrolling instant without disabling demo animations.
  browser('eval', "document.documentElement.style.scrollBehavior = 'auto';");
  checkDiagramSizes(browser, check);
  checkToolLibrary(browser, check);
  check(
    "root.dataset.phase === 'idle' && [...root.querySelectorAll('.demo-question')].every(b => b.disabled)",
    'idle state locks follow-up questions'
  );
  check(
    "root.querySelector('[data-qa]').hidden && root.querySelector('[data-footer]').hidden && !root.querySelector('[data-empty]').textContent.includes('₹') && root.querySelector('[data-result]').hidden",
    'initial terminal has no sample levels, response or question block'
  );
  observePhases();
  observeToolActivity(browser);
  browser('dblclick', '#copilot-find');
  check(
    "root.hasAttribute('data-running') && root.querySelector('#copilot-verify').disabled",
    'double click cannot start concurrent analyses'
  );
  check(
    "!root.querySelector('[data-tool-feed]').hidden && root.querySelector('[data-qa]').hidden && root.querySelector('[data-result]').hidden",
    'first run shows activity without prematurely revealing the response or questions'
  );
  browser(
    'wait',
    '--fn',
    "document.querySelector('strat-copilot-demo').dataset.phase === 'tools'"
  );
  check(
    "getComputedStyle(root.querySelector('.wire-tools')).animationName === 'signal-flow'",
    'running tools have a dynamic flow animation'
  );
  check(
    "getComputedStyle(root.querySelector('.tool-trend')).animationName === 'node-pop' && parseFloat(getComputedStyle(root.querySelector('.tool-trend strong')).fontSize) >= 13",
    'active diagram boxes pop with larger readable labels'
  );
  complete();
  allPhases();
  checkCompletedTools(browser, check);
  check(
    "!root.querySelector('[data-result]').hidden && root.querySelector('[data-verification]').hidden",
    'FIND reveals a sample plan, not a verification result'
  );
  check(
    "[...root.querySelectorAll('.plan-levels dd')].map(n => n.textContent.trim()).join('|') === '₹291.55|₹290.45|₹289.00'",
    'sample stop, entry and target match the reference'
  );
  check(
    "!root.querySelector('[data-qa]').hidden && [...root.querySelectorAll('.demo-question')].every(b => !b.disabled)",
    'question block appears and unlocks only after the response'
  );

  for (const [id, expected] of [
    ['why', 'daily trends all point down'],
    ['stop', '₹1.035'],
    ['risk', 'gap or slippage'],
  ]) {
    observePhases();
    browser('click', `#copilot-q-${id}`);
    check(
      "!root.querySelector('[data-tool-feed]').hidden && root.querySelector('[data-result]').hidden && root.querySelector('[data-qa]').hidden && root.querySelector('[data-conversation]').hidden",
      'follow-up replays visible tool activity before revealing the answer'
    );
    complete();
    allPhases();
    check(
      `root.querySelector('.qa-exchange:last-child .qa-answer').textContent.includes(${JSON.stringify(expected)})`,
      `${id} question gets its fixed answer`
    );
    check(
      "!root.querySelector('[data-result]').hidden && !root.querySelector('[data-conversation]').hidden && !root.querySelector('[data-qa]').hidden && root.querySelector('.plan-levels').textContent.includes('₹290.45')",
      'follow-up returns the saved trade, fixed answer and question block'
    );
  }
  browser('click', '#copilot-q-why');
  complete();
  check(
    "root.querySelectorAll('.qa-exchange').length === 3",
    'transcript remains bounded after repeated questions'
  );

  browser('click', '#copilot-verify');
  complete();
  check(
    "!root.querySelector('[data-verification]').hidden && root.querySelector('[data-plan-heading]').textContent === 'VERIFIED SAMPLE SETUP'",
    'VERIFY displays its own outcome'
  );
  check(
    "root.querySelector('[data-verification]').textContent.includes('1.035') && root.querySelectorAll('.qa-exchange').length === 0",
    'VERIFY audits the same supplied levels and starts a fresh thread'
  );
  browser('click', '#copilot-q-stop');
  complete();
  check(
    "!root.querySelector('[data-verification]').hidden && !root.querySelector('[data-conversation]').hidden",
    'QA also works after VERIFY'
  );

  browser('click', '#copilot-find');
  browser(
    'wait',
    '--fn',
    "document.querySelector('strat-copilot-demo').dataset.phase === 'data'"
  );
  browser('click', '#copilot-reset');
  browser(
    'eval',
    "window.resetToolStates = [...document.querySelectorAll('[data-tool-row]')].map(n => n.dataset.state).join(',');"
  );
  browser('wait', '11500');
  check(
    "[...root.querySelectorAll('[data-tool-row]')].map(n => n.dataset.state).join(',') === window.resetToolStates",
    'reset cancels pending results in the middle of the tool replay'
  );
  check(
    "root.dataset.phase === 'idle' && !root.querySelector('[data-empty]').hidden && root.querySelector('[data-result]').hidden && root.querySelector('[data-qa]').hidden && root.querySelector('[data-footer]').hidden",
    'reset restores the blank state and cancels work without stale results or questions'
  );

  browser('focus', '#copilot-verify');
  browser('press', 'Enter');
  complete();
  check(
    "!root.querySelector('[data-verification]').hidden",
    'keyboard activation runs VERIFY'
  );

  browser('set', 'viewport', '390', '844');
  check(
    'root.scrollWidth <= root.clientWidth && document.documentElement.scrollWidth <= innerWidth',
    'mobile layout has no horizontal overflow'
  );
  check(
    "root.querySelector('.terminal-actions').getBoundingClientRect().top < root.querySelector('.graph').getBoundingClientRect().top",
    'mobile actions appear above the flow'
  );
  for (const node of ['.node-model', '.node-agent', '.tool-trend']) {
    check(
      `root.querySelector('${node}').scrollHeight <= root.querySelector('${node}').clientHeight`,
      `${node} labels fit on mobile`
    );
  }
  check(
    "[...root.querySelectorAll('.graph-node strong')].every(n => parseFloat(getComputedStyle(n).fontSize) >= 13)",
    'mobile diagram retains readable label sizes'
  );
  browser('click', '.tool-library summary');
  check(
    'root.scrollWidth <= root.clientWidth',
    'expanded mobile tool library stays contained'
  );
  browser('click', '.tool-library summary');
  browser('set', 'viewport', '320', '800');
  check(
    "[...root.querySelectorAll('.graph-node')].every(n => n.scrollWidth <= n.clientWidth && n.scrollHeight <= n.clientHeight)",
    'all diagram labels fit their boxes on the smallest viewport'
  );
  check(
    'root.scrollWidth <= root.clientWidth',
    'small mobile viewport stays contained'
  );

  browser('set', 'media', 'light', 'reduced-motion');
  browser(
    'eval',
    "document.documentElement.setAttribute('data-theme','light');"
  );
  browser('click', '#copilot-find');
  check(
    "matchMedia('(prefers-reduced-motion: reduce)').matches && [...root.querySelectorAll('.wire, .graph-node, [data-tool-row]')].every(n => getComputedStyle(n).animationName === 'none')",
    'reduced motion removes animation, not the workflow'
  );
  complete();
  check(
    "!root.querySelector('[data-result]').hidden && root.querySelector('[data-verification]').hidden",
    'replay succeeds in light theme with reduced motion'
  );

  browser('click', '#copilot-find');
  browser(
    'eval',
    "window.detachedDemo = document.querySelector('strat-copilot-demo'); window.demoParent = window.detachedDemo.parentElement; window.detachedDemo.remove();"
  );
  browser('wait', '11500');
  browser('eval', 'window.demoParent.append(window.detachedDemo);');
  check(
    "root.dataset.phase === 'idle' && !root.querySelector('#copilot-find').disabled",
    'disconnect cancels timers and reconnect resets safely'
  );
  assert.deepEqual(browser('errors').errors || [], []);
  console.log('PASS no uncaught browser errors');
} finally {
  browser('close');
}
