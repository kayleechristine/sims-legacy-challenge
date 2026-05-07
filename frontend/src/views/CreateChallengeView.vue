<template>
  <div class="mt-4">
    <h2>Create a Legacy Challenge</h2>
    <v-divider class="my-3" />

    <v-card elevation="1" class="form-card">
    <!-- Custom header: gives full control over hover/click style -->
    <div class="custom-header">
        <template v-for="(label, i) in STEPS" :key="i">
          <button
            type="button"
            class="step-btn"
            :class="{ 'step-btn--active': step === i + 1, 'step-btn--done': step > i + 1 }"
            @click="step = i + 1"
          >
            <div class="step-circle">
              <v-icon v-if="step > i + 1" size="14">mdi-check</v-icon>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span class="step-label">{{ label }}</span>
          </button>
          <div v-if="i < STEPS.length - 1" class="step-line" />
        </template>
    </div>

    <v-window v-model="step">

        <!-- Step 1: Basic Info -->
        <v-window-item :value="1">
          <v-card flat>
            <v-card-text>
              <v-row align="start">
                <v-col cols="auto" class="d-flex flex-column align-center">
                  <button type="button" class="logo-preview" @click="logoDialogOpen = true">
                    <img :src="`/img/logos/${form.logo || 'empty'}.png`" alt="Challenge logo" />
                  </button>
                  <p class="text-caption text-medium-emphasis mt-1">Select a Logo</p>
                </v-col>
                <v-col>
                  <div class="d-flex ga-5">
                    <v-text-field
                      v-model="form.title"
                      label="Title"
                      variant="outlined"
                      density="compact"
                      placeholder="Give your challenge a name"
                      class="flex-1"
                    />
                    <v-select
                      v-model="form.difficulty"
                      :items="DIFFICULTIES"
                      item-title="label"
                      item-value="value"
                      label="Difficulty"
                      variant="outlined"
                      density="compact"
                      style="max-width: 200px"
                    />
                  </div>
                  <v-textarea
                    v-model="form.description"
                    label="Description"
                    variant="outlined"
                    rows="3"
                    placeholder="Describe your challenge, its theme, or any additional rules"
                    hide-details
                    class="mb-3"
                  />
                  <v-switch
                    v-model="form.isPublic"
                    label="Make this challenge public"
                    color="primary"
                    inset
                    hide-details
                    density="compact"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Step 2: Required Packs -->
        <v-window-item :value="2">
          <v-card flat>
            <v-card-text>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Select the expansion and game packs required to play this challenge.
                <template v-if="form.packs.length">
                  <strong>{{ form.packs.length }}</strong> selected.
                </template>
              </p>
              <PackSelector v-model="form.packs" />
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Step 3: Succession Laws -->
        <v-window-item :value="3">
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-text>
                      <p class="text-subtitle-2 text-uppercase text-medium-emphasis mb-2">Inheritance</p>
                      <LawSection
                        v-model="form.successionLaws.inheritance"
                        :laws="INHERITANCE_LAWS"
                        :selected-packs="form.packs"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-text>
                      <p class="text-subtitle-2 text-uppercase text-medium-emphasis mb-2">Bloodline</p>
                      <LawSection
                        v-model="form.successionLaws.bloodline"
                        :laws="BLOODLINE_LAWS"
                        :selected-packs="form.packs"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-text>
                      <p class="text-subtitle-2 text-uppercase text-medium-emphasis mb-2">Heir</p>
                      <LawSection
                        v-model="form.successionLaws.heir"
                        :laws="HEIR_LAWS"
                        :selected-packs="form.packs"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-text>
                      <p class="text-subtitle-2 text-uppercase text-medium-emphasis mb-2">Occult</p>
                      <LawSection
                        v-model="form.successionLaws.occult"
                        :laws="OCCULT_LAWS"
                        :selected-packs="form.packs"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Step 4: Generations -->
        <v-window-item :value="4">
          <v-card flat>
            <v-card-text>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Define up to 12 generations. Each generation has required goals and optional bonus milestones.
              </p>

              <v-expansion-panels v-model="openPanels" multiple class="mb-4">
                <v-expansion-panel v-for="(gen, i) in form.generations" :key="i">
                  <v-expansion-panel-title>
                    <div class="d-flex ga-2 align-center">
                      <v-chip size="small" label variant="flat" :color="gen.color" :style="{ color: chipTextColor(gen.color) }" class="font-weight-medium">
                        Gen {{ gen.number }}
                      </v-chip>
                      <span>{{ gen.title || `Generation ${gen.number}` }}</span>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-row class="mt-1">
                      <v-col cols="12" sm="8">
                        <v-text-field
                          v-model="gen.title"
                          label="Generation Title"
                          density="compact"
                          variant="outlined"
                          hide-details="auto"
                          placeholder="e.g. The Founder"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="gen.color"
                          label="Color"
                          density="compact"
                          variant="outlined"
                          hide-details="auto"
                          type="color"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="gen.description"
                          label="Description"
                          density="compact"
                          variant="outlined"
                          rows="3"
                          hide-details
                          placeholder="Describe the theme or story of this generation"
                        />
                      </v-col>
                    </v-row>

                    <p class="text-subtitle-2 mt-5 mb-2">Requirements</p>
                    <div v-for="(_, ri) in gen.requirements" :key="ri" class="d-flex gap-2 mb-2">
                      <v-text-field
                        v-model="gen.requirements[ri]"
                        :label="`Requirement ${ri + 1}`"
                        density="compact"
                        variant="outlined"
                        hide-details
                      />
                      <v-btn icon="mdi-close" size="small" variant="text" color="error" @click="removeRequirement(i, ri)" />
                    </div>
                    <v-btn variant="text" size="small" prepend-icon="mdi-plus" @click="addRequirement(i)">
                      Add Requirement
                    </v-btn>

                    <p class="text-subtitle-2 mt-5 mb-2">
                      Milestones
                      <span class="text-caption font-weight-regular text-medium-emphasis">(optional)</span>
                    </p>
                    <div v-for="(_, mi) in gen.milestones" :key="mi" class="d-flex gap-2 mb-2">
                      <v-text-field
                        v-model="gen.milestones[mi]"
                        :label="`Milestone ${mi + 1}`"
                        density="compact"
                        variant="outlined"
                        hide-details
                      />
                      <v-btn icon="mdi-close" size="small" variant="text" color="error" @click="removeMilestone(i, mi)" />
                    </div>
                    <div class="d-flex justify-space-between align-center mt-2">
                      <v-btn variant="text" size="small" prepend-icon="mdi-plus" @click="addMilestone(i)">
                        Add Milestone
                      </v-btn>
                      <v-btn variant="text" size="small" color="error" prepend-icon="mdi-delete-outline" @click="removeGeneration(i)">
                        Remove
                      </v-btn>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-btn v-if="form.generations.length < 12" variant="outlined" prepend-icon="mdi-plus" @click="addGeneration">
                Add Generation
              </v-btn>
              <p v-else class="text-caption text-medium-emphasis">Maximum of 12 generations reached.</p>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Step 5: Review -->
        <v-window-item :value="5">
          <v-card flat>
            <v-card-text>
              <div class="d-flex align-center ga-4 mb-5">
                <img :src="`/img/logos/${form.logo || 'empty'}.png`" alt="logo" width="80" height="80" style="flex-shrink: 0" />
                <div>
                  <p class="text-h6 mb-2">{{ form.title || '(Untitled)' }}</p>
                  <div class="d-flex ga-2 flex-wrap">
                    <v-chip size="small" class="text-capitalize">{{ form.difficulty }}</v-chip>
                    <v-chip v-if="form.isPublic" size="small" color="primary">Public</v-chip>
                    <v-chip v-else size="small">Private</v-chip>
                  </div>
                </div>
              </div>

              <p v-if="form.description" class="text-body-2 mb-4">{{ form.description }}</p>

              <v-divider class="mb-3" />
              <p class="text-subtitle-2 mb-2">Required Packs</p>
              <p v-if="!form.packs.length" class="text-body-2 text-medium-emphasis mb-4">None required</p>
              <div v-else class="d-flex flex-wrap ga-2 mb-4">
                <v-tooltip
                  v-for="packId in form.packs"
                  :key="packId"
                  :text="packById(packId).name"
                  location="top"
                >
                  <template #activator="{ props: tip }">
                    <img
                      v-bind="tip"
                      :src="`/img/packs/${packById(packId).img}`"
                      :alt="packById(packId).name"
                      width="60"
                      height="60"
                      style="cursor: default"
                    />
                  </template>
                </v-tooltip>
              </div>

              <v-divider class="mb-3" />
              <p class="text-subtitle-2 mb-2">Succession Laws</p>
              <v-table density="compact" class="mb-4">
                <thead>
                  <tr>
                    <th class="text-left">Category</th>
                    <th class="text-left">Law</th>
                    <th class="text-left">Strict</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="[key, label] in LAW_CATEGORIES" :key="key">
                    <td class="text-medium-emphasis text-body-2">{{ label }}</td>
                    <td class="text-body-2">
                      {{ lawName(form.successionLaws[key].law) || '—' }}
                      <span v-if="form.successionLaws[key].exemplarTrait" class="text-medium-emphasis">
                        · {{ form.successionLaws[key].exemplarTrait }}
                      </span>
                      <span v-if="form.successionLaws[key].occultType" class="text-medium-emphasis">
                        · {{ form.successionLaws[key].occultType }}
                      </span>
                    </td>
                    <td class="text-body-2">{{ form.successionLaws[key].strict ? 'Yes' : '—' }}</td>
                  </tr>
                </tbody>
              </v-table>

              <v-divider class="mb-3" />
              <p class="text-subtitle-2 mb-3">Generations ({{ form.generations.length }})</p>
              <p v-if="!form.generations.length" class="text-body-2 text-medium-emphasis">No generations defined.</p>
              <div v-for="gen in form.generations" :key="gen.number" class="mb-4">
                <div class="d-flex align-center ga-2 mb-1">
                  <v-chip size="small" label variant="flat" :color="gen.color" :style="{ color: chipTextColor(gen.color) }">Gen {{ gen.number }}</v-chip>
                  <span class="font-weight-medium">{{ gen.title || `Generation ${gen.number}` }}</span>
                </div>
                <p v-if="gen.description" class="text-body-2 text-medium-emphasis mb-1">{{ gen.description }}</p>
                <ul v-if="gen.requirements.filter((r) => r).length" class="text-body-2 pl-4">
                  <li v-for="req in gen.requirements.filter((r) => r)" :key="req">{{ req }}</li>
                </ul>
              </div>
            </v-card-text>
          </v-card>
        </v-window-item>

    </v-window>

  </v-card>
  <div class="d-flex justify-end gap-3 pa-3">
    <v-btn v-if="step > 1" variant="text" @click="step--">Back</v-btn>
    <v-btn v-if="step < 5" color="primary" variant="flat" @click="step++">Next</v-btn>
    <v-btn v-else color="primary" variant="flat" @click="submit">Create Challenge</v-btn>
  </div>

    <!-- Logo picker dialog -->
    <v-dialog v-model="logoDialogOpen" max-width="560">
      <v-card>
        <v-card-title class="pt-4">Choose a Logo</v-card-title>
        <v-card-text>
          <LogoPicker v-model="form.logo" />
        </v-card-text>
        <v-card-actions class="pb-4 px-4">
          <v-spacer />
          <v-btn color="primary" variant="flat" @click="logoDialogOpen = false">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import {
  INHERITANCE_LAWS,
  BLOODLINE_LAWS,
  HEIR_LAWS,
  OCCULT_LAWS,
  ALL_LAWS,
  PACKS,
} from '@/data/challenge-constants.js';
import LogoPicker from '@/components/challenge/LogoPicker.vue';
import PackSelector from '@/components/challenge/PackSelector.vue';
import LawSection from '@/components/challenge/LawSection.vue';

const STEPS = ['Basic Info', 'Required Packs', 'Succession Laws', 'Generations', 'Review'];

const DIFFICULTIES = [
  { label: 'Easy', value: 'easy' },
  { label: 'Normal', value: 'normal' },
  { label: 'Extreme', value: 'extreme' },
];

const LAW_CATEGORIES = [
  ['inheritance', 'Inheritance'],
  ['bloodline', 'Bloodline'],
  ['heir', 'Heir'],
  ['occult', 'Occult'],
];

const step = ref(1);
const openPanels = ref([]);
const logoDialogOpen = ref(false);

const form = reactive({
  title: '',
  logo: null,
  difficulty: 'normal',
  description: '',
  isPublic: false,
  packs: [],
  successionLaws: {
    inheritance: { law: null, strict: false },
    bloodline: { law: null, strict: false },
    heir: { law: null, strict: false, exemplarTrait: null },
    occult: { law: null, strict: false, occultType: null },
  },
  generations: [],
});

function chipTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

function lawName(key) {
  return ALL_LAWS.find((l) => l.key === key)?.name ?? null;
}

function packById(id) {
  return PACKS.find((p) => p.id === id);
}

function addGeneration() {
  const number = form.generations.length + 1;
  form.generations.push({
    number,
    title: '',
    color: '#4CAF50',
    description: '',
    requirements: [],
    milestones: [],
  });
  openPanels.value = [...openPanels.value, form.generations.length - 1];
}

function removeGeneration(index) {
  form.generations.splice(index, 1);
  form.generations.forEach((gen, i) => { gen.number = i + 1; });
  openPanels.value = openPanels.value
    .filter((p) => p !== index)
    .map((p) => (p > index ? p - 1 : p));
}

function addRequirement(genIndex) {
  form.generations[genIndex].requirements.push('');
}

function removeRequirement(genIndex, reqIndex) {
  form.generations[genIndex].requirements.splice(reqIndex, 1);
}

function addMilestone(genIndex) {
  form.generations[genIndex].milestones.push('');
}

function removeMilestone(genIndex, milIndex) {
  form.generations[genIndex].milestones.splice(milIndex, 1);
}

function submit() {
  // TODO: POST to /api/challenges
  console.log('Challenge:', JSON.parse(JSON.stringify(form)));
}
</script>

<style scoped>
/* ── Custom stepper header ─────────────────────────────── */
.custom-header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.step-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.step-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.38);
  transition: background-color 0.25s ease, color 0.25s ease;
}

.step-btn--active .step-circle,
.step-btn--done .step-circle {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

.step-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.38);
  transition: color 0.25s ease;
}

.step-btn--active .step-label {
  color: rgb(var(--v-theme-primary));
}

.step-btn--done .step-label {
  color: rgba(0, 0, 0, 0.87);
}

.step-line {
  flex: 1;
  height: 1px;
  min-width: 12px;
  background-color: rgba(0, 0, 0, 0.12);
}

/* ── Form card ────────────────────────────────────────── */
.form-card {
  min-height: 600px;
  max-height: 600px;
  overflow: auto;
}

/* ── Logo preview button ───────────────────────────────── */
.logo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  cursor: pointer;
  background: none;
  transition: border-color 0.15s, background-color 0.15s;
}

.logo-preview:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.logo-preview img {
  width: 75%;
  height: 75%;
  object-fit: contain;
}
</style>
