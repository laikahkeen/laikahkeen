<template>
  <!-- Black because gold on white fails contrast (src/theme.test.ts). Gold appears
       only in the live state: the accent means "live system" and nothing else. -->
  <section id="mcp" class="border-t border-gray-800 bg-black py-24 text-white">
    <div class="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[0.75fr_1fr] lg:px-8">
      <div>
        <p class="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gray-500">{{ mcpPanel.eyebrow }}</p>
        <h2 class="mb-6 text-4xl font-bold md:text-5xl">{{ mcpPanel.heading }}</h2>
        <p class="mb-6 text-base leading-8 text-gray-400">{{ mcpPanel.intro }}</p>
        <a
          :href="mcpPanel.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-gray-400 underline underline-offset-4 hover:text-white"
        >
          {{ mcpPanel.sourceLabel }}
        </a>
      </div>

      <div
        class="self-start border p-6 md:p-8"
        :class="isLive ? 'border-accent' : 'border-gray-800'"
        :data-state="state"
      >
        <p role="status" class="flex items-start gap-3 text-sm">
          <span
            class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            :class="isLive ? 'bg-accent' : 'bg-gray-600'"
            aria-hidden="true"
          ></span>
          <span :class="isLive ? 'text-accent' : 'text-gray-400'">{{ mcpPanel.status[state] }}</span>
        </p>

        <p class="mb-2 mt-8 text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
          {{ mcpPanel.endpointLabel }}
        </p>
        <code class="block select-all break-all font-mono text-sm" :class="isLive ? 'text-accent' : 'text-gray-300'">{{
          mcpPanel.endpoint
        }}</code>

        <template v-if="isLive">
          <p class="mb-4 mt-8 text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
            {{ mcpPanel.toolsLabel }}
          </p>
          <ul class="space-y-5">
            <li v-for="tool in tools" :key="tool.name">
              <p class="font-mono text-sm text-accent">{{ tool.name }}</p>
              <p class="mt-1 text-sm leading-6 text-gray-400">{{ tool.description }}</p>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { mcpPanel } from '../../data/mcp';
import { fetchMcpTools, type McpTool } from '../../api/mcp';
import type { McpPanelState } from '../../types';

const TIMEOUT_MS = 8000;

// Starts as 'checking' so the prerendered HTML and the first client render agree;
// the fetch only ever runs in the browser.
const state = ref<McpPanelState>('checking');
const tools = ref<McpTool[]>([]);
const isLive = computed(() => state.value === 'live');

let controller: AbortController | undefined;

onMounted(async () => {
  controller = new AbortController();
  const timer = setTimeout(() => controller?.abort(), TIMEOUT_MS);
  try {
    tools.value = await fetchMcpTools(mcpPanel.endpoint, controller.signal);
    state.value = 'live';
  } catch {
    state.value = 'unreachable';
  } finally {
    clearTimeout(timer);
  }
});

onBeforeUnmount(() => controller?.abort());
</script>
