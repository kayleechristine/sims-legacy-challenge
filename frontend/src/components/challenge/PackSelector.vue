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
        <v-tooltip :text="pack.name" location="top">
          <template #activator="{ props: tip }">
            <img v-bind="tip":src="`/img/packs/${pack.img}`" :alt="pack.name" width="64" height="64" />
          </template>
        </v-tooltip>
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
  margin-bottom: 16px;
}

.pack-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  scale: 1.02;
  padding: 4px 4px;
  border: 2px solid transparent;
  border-radius: 100%;
  cursor: pointer;
  background: none;
  transition: transform 0.3s ease;
  text-align: center;
}

.pack-opt:hover {
  border-radius: 100%;
  transform: scale(1.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
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
