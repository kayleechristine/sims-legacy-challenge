<template>
  <div class="logo-grid">
    <button
      v-for="logo in LOGOS"
      :key="logo"
      type="button"
      class="logo-opt"
      :class="{ 'logo-opt--active': model === logo }"
      @click="model = logo"
    >
      <img :src="`/img/logos/${logo}.png`" :alt="logo" width="44" height="44" />
    </button>
  </div>
</template>

<script setup>
import { LOGOS } from '@/data/challenge-constants.js';

const model = defineModel({ type: String, default: null });
</script>

<style scoped>
.logo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.logo-opt {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  background: none;
  padding: 4px;
  transition: border-color 0.15s, background-color 0.15s;
}

.logo-opt:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.logo-opt--active {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>
