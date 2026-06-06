---
name: browser-verify
description: Use when verifying frontend behaviour in the browser — opens a clean isolated context, injects monitoring code at page load, inspects React state, takes screenshots. Use for sequential animation timing, React fiber state, DOM structure verification.
---

# Browser Verification Skill

You are verifying frontend behaviour using the Chrome DevTools MCP. Follow this workflow precisely.

---

## Step 0 — Clean up first

Always close all existing browser pages before starting. Ask for the list, close them one by one (cannot close the last one — navigate it instead).

```
list_pages → close_page for each stale tab → one tab remains
```

---

## Step 1 — Open a fresh isolated context

Use `isolatedContext` to get a session with no cookies, no localStorage — completely clean.

```
new_page(url, isolatedContext="verify-<short-label>")
```

For testing guest/anonymous flows specifically, isolated contexts ensure no session cookie leaks in from prior tests.

---

## Step 2 — Inject monitoring BEFORE page scripts run

Use `navigate_page` with `initScript` to install a polling monitor at document load time — before any React hydration.

```js
// Example initScript for time-based animation monitoring:
window.__t0 = Date.now();
window.__log = [];
window.__interval = setInterval(() => {
  const els = document.querySelectorAll('.your-selector');
  window.__log.push({
    t: ((Date.now() - window.__t0)/1000).toFixed(1) + 's',
    count: els.length,
    texts: Array.from(els).map(e => ({ len: e.textContent.length, preview: e.textContent.slice(0,40) }))
  });
}, 1000);
```

`initScript` runs on every navigation including the initial load — it fires before React renders.

---

## Step 3 — Wait, then collect

Wait for the animation/event you're verifying to complete, then call:

```
evaluate_script(() => window.__log)
```

Read the log to verify:
- Count of visible elements changes at the expected time
- Text length grows (streaming) then stabilises (done)
- Sequential animations show the right gap between events

---

## Step 4 — Inspect React fiber state (when needed)

To read component state or context values directly from React's fiber tree:

```js
() => {
  const el = document.querySelector('.your-root-element');
  const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber'));
  let fiber = el[fiberKey];
  let depth = 0;
  while (fiber && depth < 100) {
    // Check context provider values
    const v = fiber.memoizedProps?.value;
    if (v && 'yourContextKey' in Object(v)) return v;
    // Check component by name
    if (fiber.type?.name === 'YourComponent') {
      // Read memoizedState chain (linked list): each .next is the next useState
      const states = [];
      let s = fiber.memoizedState;
      while (s && states.length < 8) {
        const v = s.memoizedState;
        states.push(typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string' ? v : typeof v);
        s = s.next;
      }
      return { states };
    }
    fiber = fiber.return;
    depth++;
  }
  return null;
}
```

**Rules for fiber inspection:**
- `memoizedState` is a linked list — walk `.next` to get each `useState` value in order
- `memoizedProps.value` on a Provider fiber has the context value
- `fiber.type?.name` gives the component's function name (minified in prod builds)
- Avoid circular references in JSON: only serialize primitives (`typeof === 'boolean'|'number'|'string'`)
- Walk `.return` to go UP the tree, `.child` to go DOWN, `.sibling` to go sideways

**Count component instances:**
```js
() => {
  const el = document.querySelector('.aui-thread-viewport');
  const key = Object.keys(el).find(k => k.startsWith('__reactFiber'));
  let fiber = el[key];
  let count = 0;
  function walk(f, d) {
    if (!f || d > 200) return;
    if (f.type?.name === 'YourComponent') count++;
    walk(f.child, d+1);
    walk(f.sibling, d+1);
  }
  walk(fiber, 0);
  return count;
}
```

---

## Step 5 — Screenshot for visual confirmation

```
take_screenshot()
```

Use this to confirm the visual state after the automated check passes. Scroll to specific positions with `evaluate_script` first if needed:

```js
() => { document.querySelector('.aui-thread-viewport').scrollTop = 0; }
```

---

## Delegation as a Subagent

When spawning a `general-purpose` agent to handle browser verification, give it:

1. The URL to test
2. The CSS selector(s) to monitor
3. What "correct" behaviour looks like (counts, timing, content)
4. Whether to use an `isolatedContext` (always yes for auth/session tests)
5. The `initScript` monitoring snippet if timing matters

The agent returns: observed log + pass/fail verdict + screenshot path.

---

## Key Lessons Learned

- **`return null` vs `return <></>`** in React render callbacks: `null` triggers `DefaultPartFallback` (which renders registered tool UIs). `<></>` suppresses it. Critical distinction when gating tool card rendering.
- **Consecutive assistant messages are merged** by `chunkExternalMessages` in `@assistant-ui`. Two `role: "assistant"` UIMessages become one message with combined parts. Design around this, not against it.
- **Fiber state in `ThreadPrimitive.Messages`**: verify with fiber inspection before assuming separate fibers — the library may reuse one fiber for all messages, making `useState` initialisation only happen once.
- **`initScript` is required for timing tests**: polling after `navigate_page` misses the first 1–2 seconds. Always inject the monitor script via `initScript`.
