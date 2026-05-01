<template>
  <div>
    <div class="law-grid mb-2">
      <button
        v-for="law in laws"
        :key="law.key"
        type="button"
        class="law-opt"
        :class="{ 'law-opt--active': model.law === law.key }"
        @click="selectLaw(law.key)"
      >
        <img :src="`/img/laws/${law.img}`" :alt="law.alt" width="36" height="36" />
        <span class="text-caption">{{ law.name }}</span>
      </button>
    </div>

    <p v-if="selectedLaw" class="text-body-2 text-medium-emphasis mb-3 pl-1">
      {{ selectedLaw.description }}
    </p>

    <div v-if="model.law" class="d-flex flex-wrap gap-4 align-center">
      <v-switch
        :model-value="model.strict"
        label="Strict"
        density="compact"
        hide-details
        color="primary"
        inset
        @update:model-value="setStrict"
      />

      <v-autocomplete
        v-if="showExemplarTrait"
        :model-value="model.exemplarTrait"
        :items="traitItems"
        label="Exemplar Trait"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        style="max-width: 240px"
        @update:model-value="setExemplarTrait"
      />

      <v-select
        v-if="showOccultType"
        :model-value="model.occultType"
        :items="occultTypeItems"
        label="Founder Species"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        style="max-width: 200px"
        @update:model-value="setOccultType"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { TRAITS, PACK_CONTENT } from '@/data/challenge-constants.js';

const props = defineProps({
  laws: { type: Array, required: true },
  selectedPacks: { type: Array, default: () => [] },
});

const model = defineModel({ type: Object, required: true });

const selectedLaw = computed(() => props.laws.find((l) => l.key === model.value.law));

const showExemplarTrait = computed(() => model.value.law === 'exemplar');
const showOccultType = computed(() => model.value.law === 'xenophobic');

const traitItems = computed(() =>
  TRAITS
    .filter((t) => t.pack === null || props.selectedPacks.includes(t.pack))
    .map((t) => t.name),
);

const occultTypeItems = computed(() => {
  const species = ['Human'];
  Object.entries(PACK_CONTENT).forEach(([packId, content]) => {
    if (content.species && props.selectedPacks.includes(packId)) {
      species.push(content.species);
    }
  });
  return species;
});

function selectLaw(key) {
  model.value = { law: key, strict: model.value.strict, exemplarTrait: null, occultType: null };
}

function setStrict(v) {
  model.value = { ...model.value, strict: v };
}

function setExemplarTrait(v) {
  model.value = { ...model.value, exemplarTrait: v };
}

function setOccultType(v) {
  model.value = { ...model.value, occultType: v };
}
</script>

<style scoped>
.law-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.law-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 72px;
  padding: 8px 4px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  background: none;
  transition: border-color 0.15s, background-color 0.15s;
  text-align: center;
  gap: 4px;
}

.law-opt:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.law-opt--active {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>
