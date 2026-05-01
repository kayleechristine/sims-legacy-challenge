<template>
  <div class="pack-grid">
    <button
      v-for="pack in PACKS"
      :key="pack.id"
      type="button"
      class="pack-opt"
      :class="{ 'pack-opt--active': model.includes(pack.id) }"
      @click="toggle(pack.id)"
    >
      <img :src="`/img/packs/${pack.img}`" :alt="pack.name" width="64" height="64" />
      <span class="text-caption pack-label">{{ pack.name }}</span>
    </button>
  </div>
</template>

<script setup>
import { PACKS } from '@/data/challenge-constants.js';

const model = defineModel({ type: Array, default: () => [] });

function toggle(packId) {
  model.value = model.value.includes(packId)
    ? model.value.filter((id) => id !== packId)
    : [...model.value, packId];
}
</script>

<style scoped>
.pack-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pack-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
  padding: 8px 4px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  background: none;
  transition: border-color 0.15s, background-color 0.15s;
  text-align: center;
}

.pack-opt:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.pack-opt--active {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.pack-label {
  margin-top: 4px;
  line-height: 1.3;
}
</style>
