<template>
  <div class="mt-4">
    <h2>Create a Legacy Challenge</h2>
    <v-divider class="my-3" />

    <v-stepper v-model="step" flat>
      <v-stepper-header>
        <v-stepper-item :value="1" title="Basic Info" :complete="step > 1" />
        <v-divider />
        <v-stepper-item :value="2" title="Required Packs" :complete="step > 2" />
        <v-divider />
        <v-stepper-item :value="3" title="Succession Laws" :complete="step > 3" />
        <v-divider />
        <v-stepper-item :value="4" title="Generations" />
      </v-stepper-header>

      <v-stepper-window>

        <!-- Step 1: Basic Info -->
        <v-stepper-window-item :value="1">
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="form.title"
                    label="Title"
                    variant="outlined"
                    density="compact"
                    placeholder="Give your challenge a name"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="form.difficulty"
                    :items="DIFFICULTIES"
                    item-title="label"
                    item-value="value"
                    label="Difficulty"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.description"
                    label="Description"
                    variant="outlined"
                    rows="4"
                    placeholder="Describe your challenge, its theme, or any additional rules"
                  />
                </v-col>
                <v-col cols="12">
                  <p class="text-subtitle-2 mb-1">Logo</p>
                  <p class="text-body-2 text-medium-emphasis mb-3">Choose an icon to represent your challenge.</p>
                  <LogoPicker v-model="form.logo" />
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="form.isPublic"
                    label="Make this challenge public"
                    color="primary"
                    inset
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <!-- Step 2: Required Packs -->
        <v-stepper-window-item :value="2">
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
        </v-stepper-window-item>

        <!-- Step 3: Succession Laws -->
        <v-stepper-window-item :value="3">
          <v-card flat>
            <v-card-text>
              <p class="text-body-2 text-medium-emphasis mb-5">
                Define the succession laws that govern how heirs are determined each generation.
              </p>
              <v-row>
                <v-col cols="12">
                  <p class="text-subtitle-2 text-uppercase text-medium-emphasis mb-2">Inheritance</p>
                  <LawSection
                    v-model="form.successionLaws.inheritance"
                    :laws="INHERITANCE_LAWS"
                    :selected-packs="form.packs"
                  />
                </v-col>
                <v-col cols="12"><v-divider /></v-col>
                <v-col cols="12">
                  <p class="text-subtitle-2 text-uppercase text-medium-emphasis mb-2">Bloodline</p>
                  <LawSection
                    v-model="form.successionLaws.bloodline"
                    :laws="BLOODLINE_LAWS"
                    :selected-packs="form.packs"
                  />
                </v-col>
                <v-col cols="12"><v-divider /></v-col>
                <v-col cols="12">
                  <p class="text-subtitle-2 text-uppercase text-medium-emphasis mb-2">Heir</p>
                  <LawSection
                    v-model="form.successionLaws.heir"
                    :laws="HEIR_LAWS"
                    :selected-packs="form.packs"
                  />
                </v-col>
                <v-col cols="12"><v-divider /></v-col>
                <v-col cols="12">
                  <p class="text-subtitle-2 text-uppercase text-medium-emphasis mb-2">Occult</p>
                  <LawSection
                    v-model="form.successionLaws.occult"
                    :laws="OCCULT_LAWS"
                    :selected-packs="form.packs"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <!-- Step 4: Generations -->
        <v-stepper-window-item :value="4">
          <v-card flat>
            <v-card-text>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Define up to 12 generations. Each generation has required goals and optional bonus milestones.
              </p>

              <v-expansion-panels v-model="openPanels" multiple class="mb-4">
                <v-expansion-panel v-for="(gen, i) in form.generations" :key="i">
                  <v-expansion-panel-title>
                    <div class="d-flex align-center gap-3">
                      <v-chip size="small" label :color="gen.color" class="text-white font-weight-medium">
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
                          placeholder="e.g. The Founder"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="gen.color"
                          label="Color"
                          density="compact"
                          variant="outlined"
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
                    <div
                      v-for="(_, ri) in gen.requirements"
                      :key="ri"
                      class="d-flex gap-2 mb-2"
                    >
                      <v-text-field
                        v-model="gen.requirements[ri]"
                        :label="`Requirement ${ri + 1}`"
                        density="compact"
                        variant="outlined"
                        hide-details
                      />
                      <v-btn
                        icon="mdi-close"
                        size="small"
                        variant="text"
                        color="error"
                        @click="removeRequirement(i, ri)"
                      />
                    </div>
                    <v-btn
                      variant="text"
                      size="small"
                      prepend-icon="mdi-plus"
                      @click="addRequirement(i)"
                    >
                      Add Requirement
                    </v-btn>

                    <p class="text-subtitle-2 mt-5 mb-2">
                      Milestones
                      <span class="text-caption font-weight-regular text-medium-emphasis">(optional)</span>
                    </p>
                    <div
                      v-for="(_, mi) in gen.milestones"
                      :key="mi"
                      class="d-flex gap-2 mb-2"
                    >
                      <v-text-field
                        v-model="gen.milestones[mi]"
                        :label="`Milestone ${mi + 1}`"
                        density="compact"
                        variant="outlined"
                        hide-details
                      />
                      <v-btn
                        icon="mdi-close"
                        size="small"
                        variant="text"
                        color="error"
                        @click="removeMilestone(i, mi)"
                      />
                    </div>
                    <div class="d-flex justify-space-between align-center mt-2">
                      <v-btn
                        variant="text"
                        size="small"
                        prepend-icon="mdi-plus"
                        @click="addMilestone(i)"
                      >
                        Add Milestone
                      </v-btn>
                      <v-btn
                        variant="text"
                        size="small"
                        color="error"
                        prepend-icon="mdi-delete-outline"
                        @click="removeGeneration(i)"
                      >
                        Remove
                      </v-btn>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-btn
                v-if="form.generations.length < 12"
                variant="outlined"
                prepend-icon="mdi-plus"
                @click="addGeneration"
              >
                Add Generation
              </v-btn>
              <p v-else class="text-caption text-medium-emphasis">
                Maximum of 12 generations reached.
              </p>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

      </v-stepper-window>
    </v-stepper>

    <div class="d-flex justify-end gap-3 mt-2 mb-6">
      <v-btn v-if="step > 1" variant="text" @click="step--">Back</v-btn>
      <v-btn v-if="step < 4" color="primary" variant="flat" @click="step++">Next</v-btn>
      <v-btn v-else color="primary" variant="flat" @click="submit">Create Challenge</v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import {
  INHERITANCE_LAWS,
  BLOODLINE_LAWS,
  HEIR_LAWS,
  OCCULT_LAWS,
} from '@/data/challenge-constants.js';
import LogoPicker from '@/components/challenge/LogoPicker.vue';
import PackSelector from '@/components/challenge/PackSelector.vue';
import LawSection from '@/components/challenge/LawSection.vue';

const DIFFICULTIES = [
  { label: 'Easy', value: 'easy' },
  { label: 'Normal', value: 'normal' },
  { label: 'Extreme', value: 'extreme' },
];

const step = ref(1);
const openPanels = ref([]);

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
