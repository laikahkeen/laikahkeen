<template>
  <figure class="my-12">
    <!-- currentColor throughout so this survives the dark-theme flip without edits. -->
    <svg
      viewBox="0 -14 720 366"
      class="w-full text-black"
      role="img"
      :aria-label="ariaLabel"
      fill="none"
      stroke="currentColor"
    >
      <title>{{ ariaLabel }}</title>

      <defs>
        <marker id="ef-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none" />
        </marker>
      </defs>

      <g stroke-width="1.25" font-family="ui-monospace, monospace" font-size="12">
        <!-- ── the intended path ─────────────────────────────────────────── -->
        <rect x="8" y="46" width="128" height="52" />
        <text x="72" y="68" text-anchor="middle" stroke="none" fill="currentColor">Telegram</text>
        <text x="72" y="84" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">raw text</text>

        <rect x="176" y="46" width="128" height="52" />
        <text x="240" y="68" text-anchor="middle" stroke="none" fill="currentColor">planner</text>
        <text x="240" y="84" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">confidence</text>

        <rect x="344" y="34" width="128" height="76" stroke-width="2" />
        <text x="408" y="62" text-anchor="middle" stroke="none" fill="currentColor">ops executor</text>
        <text x="408" y="82" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">the only</text>
        <text x="408" y="98" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">writer</text>

        <rect x="544" y="20" width="168" height="52" />
        <text x="628" y="42" text-anchor="middle" stroke="none" fill="currentColor">events</text>
        <text x="628" y="58" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">append only</text>

        <rect x="544" y="96" width="168" height="70" />
        <text x="628" y="118" text-anchor="middle" stroke="none" fill="currentColor">edit_batches</text>
        <text x="628" y="136" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">ops_json</text>
        <text x="628" y="152" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">inverse_ops_json</text>

        <path d="M136,72 L172,72" marker-end="url(#ef-arrow)" />
        <path d="M304,72 L340,72" marker-end="url(#ef-arrow)" />
        <path d="M472,58 L540,48" marker-end="url(#ef-arrow)" />
        <path d="M472,88 L540,124" marker-end="url(#ef-arrow)" />

        <!-- inverse is captured before the forward op runs — the whole point -->
        <path d="M408,34 L408,8 L628,8 L628,16" marker-end="url(#ef-arrow)" stroke-dasharray="4 3" />
        <text x="518" y="2" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">
          inverse captured first
        </text>

        <!-- undo, routed clear of both boxes -->
        <path d="M560,166 L560,196 L408,196 L408,114" marker-end="url(#ef-arrow)" stroke-dasharray="4 3" />
        <text x="484" y="212" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">
          /undo replays the stored inverse
        </text>

        <!-- ── the path that bypassed it ─────────────────────────────────── -->
        <rect x="8" y="250" width="216" height="52" stroke-dasharray="5 4" />
        <text x="116" y="272" text-anchor="middle" stroke="none" fill="currentColor">statement re-import</text>
        <text x="116" y="288" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">
          booked no rows
        </text>

        <!-- around the executor, never through it -->
        <path d="M224,276 L470,276 L470,240 L700,240 L700,80" marker-end="url(#ef-arrow)" stroke-dasharray="5 4" />
        <text x="352" y="268" text-anchor="middle" stroke="none" fill="currentColor" opacity="0.6">
          skipped the executor
        </text>
        <text x="690" y="230" text-anchor="end" stroke="none" fill="currentColor" opacity="0.6">
          changed the document, recorded no batch
        </text>

        <text x="8" y="322" text-anchor="start" stroke="none" fill="currentColor" opacity="0.6">
          22 Apr 2026: the next /undo reached
        </text>
        <text x="8" y="338" text-anchor="start" stroke="none" fill="currentColor" opacity="0.6">
          past it to an older batch
        </text>
      </g>
    </svg>

    <figcaption v-if="caption" class="mt-4 text-sm leading-7 text-gray-500">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
defineProps<{ caption?: string }>();

// Spelled out for screen readers, because the diagram carries an argument rather
// than decoration: the ordering of inverse capture is the point.
const ariaLabel =
  'Capture flows from Telegram through a planner into the ops executor, which is the single writer. ' +
  'The executor appends to the events table and records a batch holding both the forward operations and ' +
  'their inverse. The inverse is captured before the forward operation runs. Undo replays the stored ' +
  'inverse back through the executor. Shown separately: a statement re-import that booked no rows, ' +
  'skipped the executor, still changed the document, and recorded no batch — which is how the next undo ' +
  'reached past it and lost data on 22 April 2026.';
</script>
