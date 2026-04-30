<template>
  <main class="container mt-4">
    <div>
      <h2>Create a Legacy Challenge</h2>
      <hr>

      <form @submit.prevent="submitChallenge">

        <!-- ── Required Packs ────────────────────────────────────────── -->
        <h3>Required Packs:</h3>
        <span>Select which packs will be required for your challenge.</span>
        <div class="mt-3 ps-4 pe-4" id="pack-container">
          <template v-for="pack in PACKS" :key="pack.id">
            <input type="checkbox" :id="pack.id" :value="pack.id" v-model="selectedPacks">
            <label class="pack" :for="pack.id" :title="pack.name">
              <img :src="`/img/packs/${pack.img}`" :alt="`Sims 4 ${pack.name}`">
            </label>
          </template>
        </div>

        <!-- ── Overview ──────────────────────────────────────────────── -->
        <h3>Overview:</h3>
        <span>Provide basic information to help describe your challenge.</span>
        <div class="row justify-content-center">
          <div class="col-8 mt-3 mb-3 pe-5">
            <div class="row">
              <div class="w-50">
                <label class="visually-hidden" for="challenge-title">Title</label>
                <input type="text" class="form-control" id="challenge-title" placeholder="Challenge Title" v-model="title">
              </div>
              <div class="w-50">
                <label class="visually-hidden" for="challenge-difficulty">Difficulty</label>
                <select class="form-select" id="challenge-difficulty" v-model="difficulty">
                  <option value="" disabled>Select Difficulty...</option>
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>
            </div>
            <div class="mt-3">
              <label class="visually-hidden" for="challenge-description">Description</label>
              <textarea class="form-control input-group" id="challenge-description" placeholder="Challenge Description" v-model="description"></textarea>
            </div>
            <div class="mt-3">
              <label class="visually-hidden" for="challenge-tags">Tags</label>
              <div class="input-group">
                <div class="input-group-text">#</div>
                <input type="text" class="form-control" id="challenge-tags" placeholder="Tags" v-model="tagsInput" @keydown="handleTagKeydown">
              </div>
            </div>
          </div>

          <!-- Logo card -->
          <div class="col-3 d-flex">
            <div class="card mb-3 mt-3 p-2" id="logo-card" :class="{ 'logo-selected': logo }">
              <button type="button" class="btn btn-primary" id="logo-btn" @click="openLogoModal">
                Select a Logo
              </button>
              <img
                :src="logo ? `/img/logos/${logo}.png` : '/img/logos/empty.png'"
                id="logo-placeholder"
                alt="placeholder logo"
                :style="{ opacity: logo ? '100%' : '50%' }"
              >
            </div>
          </div>
        </div>

        <!-- Logo modal (Bootstrap JS API) -->
        <div class="modal fade" id="logoModal" tabindex="-1" ref="logoModalRef">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5">Challenge Logos</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body logo-container">
                <template v-for="l in LOGOS" :key="l">
                  <input type="radio" name="challenge-logo" :id="`logo-${l}`" :value="l" v-model="pendingLogo">
                  <label class="logo" :for="`logo-${l}`">
                    <img :src="`/img/logos/${l}.png`" :alt="`${l} logo`">
                  </label>
                </template>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="saveLogo">Save Changes</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Succession Laws ───────────────────────────────────────── -->
        <h3>Succession Laws:</h3>
        <span>Succession Laws decide which sim will take over as heir once the current generation ends.</span>
        <div class="row mt-3 mb-3 ps-5 pe-5 justify-content-between">

          <!-- Inheritance -->
          <div class="col-12 col-lg-6 pe-4">
            <div class="card mb-2">
              <div class="row">
                <template v-if="inheritanceLawData">
                  <div class="col-md-4 p-2 d-flex card-image">
                    <img :src="`/img/laws/${inheritanceLawData.img}`" class="rounded-start" style="width: 100px" :alt="inheritanceLawData.alt">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{{ inheritanceLawData.name }}</h5>
                      <p class="card-text small">{{ inheritanceLawData.description }}</p>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <LawPlaceholder />
                </template>
              </div>
            </div>
            <select class="form-select succession-laws" v-model="inheritanceLaw">
              <option :value="null" disabled>Inheritance Law</option>
              <option v-for="law in INHERITANCE_LAWS" :key="law.id" :value="law.id">{{ law.name }}</option>
            </select>
            <div class="form-check form-switch d-inline-block mt-1 mb-3">
              <input class="form-check-input" type="checkbox" role="switch" id="strict-inheritance" v-model="strictInheritance">
              <label class="form-check-label p-0" for="strict-inheritance">Make Strict</label>
            </div>
          </div>

          <!-- Bloodline -->
          <div class="col-12 col-lg-6 ps-4">
            <div class="card mb-2">
              <div class="row g-0">
                <template v-if="bloodlineLawData">
                  <div class="col-md-4 p-2 d-flex card-image">
                    <img :src="`/img/laws/${bloodlineLawData.img}`" class="rounded-start" style="width: 100px" :alt="bloodlineLawData.alt">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{{ bloodlineLawData.name }}</h5>
                      <p class="card-text small">{{ bloodlineLawData.description }}</p>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <LawPlaceholder />
                </template>
              </div>
            </div>
            <select class="form-select succession-laws" v-model="bloodlineLaw">
              <option :value="null" disabled>Bloodline Law</option>
              <option v-for="law in BLOODLINE_LAWS" :key="law.id" :value="law.id">{{ law.name }}</option>
            </select>
            <div class="form-check form-switch d-inline-block mt-1 mb-3">
              <input class="form-check-input" type="checkbox" role="switch" id="strict-bloodline" v-model="strictBloodline">
              <label class="form-check-label p-0" for="strict-bloodline">Make Strict</label>
            </div>
          </div>

          <!-- Occult -->
          <div class="col-12 col-lg-6 pe-4">
            <div class="card mb-2">
              <div class="row g-0">
                <template v-if="occultLawData">
                  <div class="col-md-4 p-2 d-flex card-image">
                    <img :src="`/img/laws/${occultLawData.img}`" class="rounded-start" style="width: 100px" :alt="occultLawData.alt">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{{ occultLawData.name }}</h5>
                      <p class="card-text small">{{ occultLawData.description }}</p>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <LawPlaceholder />
                </template>
              </div>
            </div>
            <div class="d-flex gap-2">
              <select class="form-select succession-laws" :class="{ 'w-50': showXenophobeSpecies }" v-model="occultLaw">
                <option :value="null" disabled>Occult Law</option>
                <option v-for="law in OCCULT_LAWS" :key="law.id" :value="law.id">{{ law.name }}</option>
              </select>
              <select v-if="showXenophobeSpecies" class="form-select w-50" v-model="xenophobeSpecies">
                <option value="" disabled>Select a Species</option>
                <option value="human">Human</option>
                <option v-for="s in unlockedSpecies" :key="s" :value="s.toLowerCase()">{{ s }}</option>
              </select>
            </div>
            <div class="form-check form-switch d-inline-block mt-1 mb-3">
              <input class="form-check-input" type="checkbox" role="switch" id="strict-occult" v-model="strictOccult">
              <label class="form-check-label p-0" for="strict-occult">Make Strict</label>
            </div>
          </div>

          <!-- Heir -->
          <div class="col-12 col-lg-6 ps-4">
            <div class="card mb-2">
              <div class="row g-0">
                <template v-if="heirLawData">
                  <div class="col-md-4 p-2 d-flex card-image">
                    <img :src="`/img/laws/${heirLawData.img}`" class="rounded-start" style="width: 100px" :alt="heirLawData.alt">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{{ heirLawData.name }}</h5>
                      <p class="card-text small">{{ heirLawData.description }}</p>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <LawPlaceholder />
                </template>
              </div>
            </div>
            <div class="d-flex gap-2">
              <select class="form-select succession-laws" :class="{ 'w-50': showExemplarTrait }" v-model="heirLaw">
                <option :value="null" disabled>Heir Law</option>
                <option v-for="law in HEIR_LAWS" :key="law.id" :value="law.id">{{ law.name }}</option>
              </select>
              <select v-if="showExemplarTrait" class="form-select w-50" v-model="exemplarTrait">
                <option value="" disabled>Select a Trait</option>
                <option
                  v-for="trait in TRAITS"
                  :key="trait.name"
                  :value="trait.name.toLowerCase()"
                  :disabled="!isTraitEnabled(trait)"
                >{{ trait.name }}</option>
              </select>
            </div>
            <div class="form-check form-switch d-inline-block mt-1 mb-3">
              <input class="form-check-input" type="checkbox" role="switch" id="strict-heir" v-model="strictHeir">
              <label class="form-check-label p-0" for="strict-heir">Make Strict</label>
            </div>
          </div>
        </div>

        <!-- ── Generations ───────────────────────────────────────────── -->
        <h3>Generations:</h3>
        <div class="d-flex justify-content-between align-items-start col-11">
          <span class="d-inline m-0">Specify the requirements and milestones for each generation.</span>
          <div id="gen-btn-div">
            <button
              v-for="(gen, index) in generations"
              :key="gen.number"
              type="button"
              class="btn btn-light btn-sm circle-btn ms-1 mb-1"
              :style="{ backgroundColor: gen.color, borderColor: '#969696' }"
              @click="toggleGen(index)"
            >{{ gen.number }}</button>
            <button
              type="button"
              class="btn btn-light btn-sm circle-btn ms-1 mb-1"
              id="add-gen"
              @click="addGeneration"
              :disabled="generations.length >= 12"
            >+</button>
          </div>
        </div>

        <div class="row d-flex justify-content-center">
          <div class="col-11 pb-3" id="gen-accordion">
            <div class="accordion" id="generations">
              <div v-for="(gen, index) in generations" :key="gen.number" class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
                    :class="{ collapsed: openGenIndex !== index }"
                    type="button"
                    :style="{ backgroundColor: gen.color }"
                    @click="toggleGen(index)"
                  >{{ gen.title || `Generation ${gen.number}` }}</button>
                </h2>
                <div
                  class="accordion-collapse collapse"
                  :class="{ show: openGenIndex === index }"
                >
                  <div class="accordion-body d-flex justify-content-center">
                    <div class="col-11 mt-3 d-flex flex-column">
                      <div class="row">
                        <div class="col-6">
                          <label class="visually-hidden" :for="`gen-${gen.number}-title`">Title</label>
                          <input
                            type="text"
                            class="form-control"
                            :id="`gen-${gen.number}-title`"
                            placeholder="Generation Title"
                            v-model="gen.title"
                          >
                        </div>
                        <div class="col-6 d-flex align-items-center gap-2">
                          <label class="visually-hidden" :for="`gen-${gen.number}-color`">Color</label>
                          <input
                            type="color"
                            :id="`gen-${gen.number}-color`"
                            v-model="gen.color"
                            class="form-control form-control-color"
                            style="width: 50px; height: 38px; padding: 2px;"
                          >
                          <input type="text" class="form-control" :value="gen.color" disabled>
                        </div>
                      </div>
                      <div class="col-12 mt-3">
                        <label class="visually-hidden" :for="`gen-${gen.number}-description`">Description</label>
                        <textarea
                          class="form-control input-group"
                          :id="`gen-${gen.number}-description`"
                          placeholder="Generation Description"
                          v-model="gen.description"
                        ></textarea>

                        <!-- Requirements -->
                        <div class="mt-1">
                          <button
                            type="button"
                            class="btn btn-light btn-sm circle-btn mb-3 mt-2"
                            @click="addField(gen, 'requirements')"
                            :disabled="gen.requirements.length >= 5"
                          >+</button>
                          <h4 class="d-inline ms-1 mt-2">Requirements</h4>
                          <div
                            v-for="(_, ri) in gen.requirements"
                            :key="ri"
                            class="input-group mb-2"
                          >
                            <div class="input-group-text number-list">{{ ri + 1 }}</div>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Enter a requirement..."
                              v-model="gen.requirements[ri]"
                            >
                            <button
                              v-if="ri > 0"
                              type="button"
                              class="input-group-text delete-field"
                              @click="removeField(gen, 'requirements', ri)"
                            ><i class="bi bi-trash3-fill"></i></button>
                          </div>
                        </div>

                        <!-- Milestones -->
                        <div>
                          <button
                            type="button"
                            class="btn btn-light btn-sm circle-btn mb-3 mt-2"
                            @click="addField(gen, 'milestones')"
                            :disabled="gen.milestones.length >= 5"
                          >+</button>
                          <h4 class="d-inline ms-1">Milestones</h4>
                          <div
                            v-for="(_, mi) in gen.milestones"
                            :key="mi"
                            class="input-group mb-2"
                          >
                            <div class="input-group-text number-list">{{ mi + 1 }}</div>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Enter a milestone..."
                              v-model="gen.milestones[mi]"
                            >
                            <button
                              v-if="mi > 0"
                              type="button"
                              class="input-group-text delete-field"
                              @click="removeField(gen, 'milestones', mi)"
                            ><i class="bi bi-trash3-fill"></i></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-success mb-3 mt-3" style="width: 100px">Submit</button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent } from 'vue';
import { Modal } from 'bootstrap';

// ─── Inline placeholder component ─────────────────────────────────────────────
const LawPlaceholder = defineComponent({
  template: `
    <div class="col-md-4 p-2 card-image">
      <img src="/img/plumbob.svg" class="rounded-start" style="width: 110px" alt="plumbob">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title placeholder-glow"><span class="placeholder col-6"></span></h5>
        <p class="card-text placeholder-glow">
          <span class="placeholder col-7"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-6"></span>
          <span class="placeholder col-8"></span>
        </p>
      </div>
    </div>`,
});

// ─── Static data ──────────────────────────────────────────────────────────────

const PACKS = [
  { id: 'EP12', name: 'High School Years',    img: 'EP12-96.png' },
  { id: 'EP11', name: 'Country Living',        img: 'EP11-96.png' },
  { id: 'EP10', name: 'Snowy Escape',          img: 'EP10-96.png' },
  { id: 'EP09', name: 'Eco Living',            img: 'EP09-96.png' },
  { id: 'EP08', name: 'Discover University',   img: 'EP08-96.png' },
  { id: 'EP07', name: 'Island Living',         img: 'EP07-96.png' },
  { id: 'EP06', name: 'Get Famous',            img: 'EP06-96.png' },
  { id: 'EP05', name: 'Seasons',               img: 'EP05.webp'   },
  { id: 'EP04', name: 'Cats & Dogs',           img: 'EP04-96.png' },
  { id: 'EP03', name: 'City Living',           img: 'EP03-96.png' },
  { id: 'EP02', name: 'Get Together',          img: 'EP02-96.png' },
  { id: 'EP01', name: 'Get to Work',           img: 'EP01.webp'   },
  { id: 'GP12', name: 'Werewolves',            img: 'GP12-96.png' },
  { id: 'GP09', name: 'Journey to Batuu',      img: 'GP09-96.png' },
  { id: 'GP08', name: 'Realm of Magic',        img: 'GP08-96.png' },
  { id: 'GP07', name: 'StrangerVille',         img: 'GP07-96.png' },
  { id: 'GP06', name: 'Jungle Adventure',      img: 'GP06-96.png' },
  { id: 'GP05', name: 'Parenthood',            img: 'GP05-96.png' },
  { id: 'GP04', name: 'Vampires',              img: 'GP04-96.png' },
  { id: 'GP02', name: 'Spa Day',               img: 'GP02-96.png' },
  { id: 'GP01', name: 'Outdoor Retreat',       img: 'GP01-96.png' },
];

const LOGOS = [
  'alms', 'astrology', 'berries', 'best', 'black-widow', 'briefcase',
  'castle', 'catalonia', 'column', 'desert', 'dice', 'farm', 'home',
  'island', 'kiss', 'lake', 'lighthouse', 'money-bag', 'moon', 'pacifier',
  'sprout', 'sun', 'tent',
];

const INHERITANCE_LAWS = [
  { id: 0,  key: 'matriarchy', name: 'Matriarchy', img: 'pink-crown.png',  alt: 'pink crown',   description: 'The founder and all heirs must be female. If there are no eligible female heirs, the heir may be male.' },
  { id: 1,  key: 'patriarchy', name: 'Patriarchy', img: 'blue-crown.png',  alt: 'blue crown',   description: 'The founder and all heirs must be male. If there are no eligible male heirs, the heir may be female.' },
  { id: 2,  key: 'equality',   name: 'Equality',   img: 'green-crown.png', alt: 'green crown',  description: 'The founder and all heirs can be of either gender. There are no gender restrictions.' },
];

const BLOODLINE_LAWS = [
  { id: 3,  key: 'traditional', name: 'Traditional', img: 'genetic.png',   alt: 'dna',            description: 'Heirs should be direct descendants of the founder. Adopted children may become heir if there are no direct descendants.' },
  { id: 4,  key: 'foster',      name: 'Foster',      img: 'adoption.png',  alt: 'child adoption', description: 'Heirs should be adopted into the founder\'s family. Direct descendants may become heir if there are no adopted children.' },
  { id: 5,  key: 'modern',      name: 'Modern',      img: 'children.png',  alt: 'children',       description: 'The heirs may either be adopted or direct descendants. There are no bloodline restrictions.' },
];

const HEIR_LAWS = [
  { id: 6,  key: 'first-born',          name: 'First Born',          img: 'teenager.png',       alt: 'teenager',          description: 'The first born eligible child of each generation is the heir by default.' },
  { id: 7,  key: 'last-born',           name: 'Last Born',           img: 'baby.png',            alt: 'baby',              description: 'The last born eligible child of each generation is heir by default.' },
  { id: 8,  key: 'living-will',         name: 'Living Will',         img: 'favorite-child.png',  alt: 'parent and child',  description: 'The sim with the highest relationship with the current heir will become the next heir.' },
  { id: 9,  key: 'merit',               name: 'Merit',               img: 'bar-chart.png',       alt: 'bar chart',         description: 'The sim with the most developed skills will be named heir.' },
  { id: 10, key: 'strength',            name: 'Strength',            img: 'boxing-gloves.png',   alt: 'boxing gloves',     description: 'The first born will be heir by default, but the title can be taken by challenging the current heir to a fight and winning.' },
  { id: 11, key: 'random',              name: 'Random',              img: 'dice.png',             alt: 'dice',              description: 'The heir will be chosen at random at the end of the generation.' },
  { id: 12, key: 'exemplar',            name: 'Exemplar',            img: 'fleur-de-lis.png',    alt: 'fleur de lis',      description: 'One of the founder\'s traits will be selected as the exemplar trait. A sim must possess this trait to be eligible for heir.' },
  { id: 13, key: 'democracy',           name: 'Democracy',           img: 'vote.png',             alt: 'vote sign',         description: 'The heir will be determined by popular vote.' },
  { id: 14, key: 'strongest-bloodline', name: 'Strongest Bloodline', img: 'blood.png',            alt: 'blood drop',        description: 'The heir with the strongest bloodline trait will become heir.' },
];

const OCCULT_LAWS = [
  { id: 15, key: 'xenocracy',   name: 'Xenocracy',   img: 'different-people.png', alt: 'two people',              description: 'Heirs must alternate between different species (ie; human, vampire, werewolf, alien, or spellcaster).' },
  { id: 16, key: 'xenophobic',  name: 'Xenophobe',   img: 'one-person.png',       alt: 'one person with checkmark', description: 'Heirs may only be the same species as the founder.' },
  { id: 17, key: 'brood',       name: 'Brood',       img: 'group.png',             alt: 'group of people',         description: 'Heirs may be any species, but must be carried in a pregnancy by the previous heir. Regardless of gender.' },
  { id: 18, key: 'tolerant',    name: 'Tolerant',    img: 'people.png',            alt: 'group of different people', description: 'The species of a sim has no impact on eligibility for heir. There are no restrictions on species.' },
];

const ALL_LAWS = [...INHERITANCE_LAWS, ...BLOODLINE_LAWS, ...HEIR_LAWS, ...OCCULT_LAWS];

const PACK_CONTENT = {
  EP01: { species: 'Alien',       traits: [] },
  EP02: { species: null,          traits: ['Dance Machine', 'Insider'] },
  EP03: { species: null,          traits: ['Unflirty'] },
  EP04: { species: null,          traits: ['Cat Lover', 'Dog Lover'] },
  EP05: { species: null,          traits: [] },
  EP06: { species: null,          traits: ['Self-absorbed'] },
  EP07: { species: 'Mermaid',     traits: ['Child of the Islands', 'Child of the Ocean'] },
  EP08: { species: null,          traits: [] },
  EP09: { species: null,          traits: ['Freegan', 'Green Fiend', 'Maker', 'Recycle Disciple'] },
  EP10: { species: null,          traits: ['Adventurous', 'Proper'] },
  EP11: { species: null,          traits: ['Animal Enthusiast', 'Lactose Intolerant'] },
  EP12: { species: null,          traits: ['Overachiever', 'Party Animal', 'Socially Awkward'] },
  GP01: { species: null,          traits: ['Squeamish'] },
  GP02: { species: null,          traits: ['High Maintenance'] },
  GP04: { species: 'Vampire',     traits: [] },
  GP05: { species: null,          traits: [] },
  GP06: { species: null,          traits: [] },
  GP07: { species: null,          traits: ['Paranoid'] },
  GP08: { species: 'Spellcaster', traits: [] },
  GP09: { species: null,          traits: [] },
  GP12: { species: 'Werewolf',    traits: [] },
};

const TRAITS = [
  { name: 'Active',                pack: null   },
  { name: 'Adventurous',           pack: 'EP10' },
  { name: 'Ambitious',             pack: null   },
  { name: 'Animal Enthusiast',     pack: 'EP11' },
  { name: 'Art Lover',             pack: null   },
  { name: 'Bookworm',              pack: null   },
  { name: 'Bro',                   pack: null   },
  { name: 'Cat Lover',             pack: 'EP04' },
  { name: 'Cheerful',              pack: null   },
  { name: 'Child of the Islands',  pack: 'EP07' },
  { name: 'Child of the Ocean',    pack: 'EP07' },
  { name: 'Childish',              pack: null   },
  { name: 'Clumsy',                pack: null   },
  { name: 'Creative',              pack: null   },
  { name: 'Dance Machine',         pack: 'EP02' },
  { name: 'Dog Lover',             pack: 'EP04' },
  { name: 'Erratic',               pack: null   },
  { name: 'Evil',                  pack: null   },
  { name: 'Family-oriented',       pack: null   },
  { name: 'Foodie',                pack: null   },
  { name: 'Freegan',               pack: 'EP09' },
  { name: 'Geek',                  pack: null   },
  { name: 'Genius',                pack: null   },
  { name: 'Gloomy',                pack: null   },
  { name: 'Glutton',               pack: null   },
  { name: 'Good',                  pack: null   },
  { name: 'Goofball',              pack: null   },
  { name: 'Green Fiend',           pack: 'EP09' },
  { name: 'Hates Children',        pack: null   },
  { name: 'High Maintenance',      pack: 'GP02' },
  { name: 'Hot-headed',            pack: null   },
  { name: 'Insider',               pack: 'EP02' },
  { name: 'Jealous',               pack: null   },
  { name: 'Kleptomaniac',          pack: null   },
  { name: 'Lactose Intolerant',    pack: 'EP11' },
  { name: 'Lazy',                  pack: null   },
  { name: 'Loner',                 pack: null   },
  { name: 'Loves Outdoors',        pack: null   },
  { name: 'Maker',                 pack: 'EP09' },
  { name: 'Materialistic',         pack: null   },
  { name: 'Mean',                  pack: null   },
  { name: 'Music Lover',           pack: null   },
  { name: 'Neat',                  pack: null   },
  { name: 'Noncommittal',          pack: null   },
  { name: 'Outgoing',              pack: null   },
  { name: 'Overachiever',          pack: 'EP12' },
  { name: 'Paranoid',              pack: 'GP07' },
  { name: 'Party Animal',          pack: 'EP12' },
  { name: 'Perfectionist',         pack: null   },
  { name: 'Proper',                pack: 'EP10' },
  { name: 'Recycle Disciple',      pack: 'EP09' },
  { name: 'Romantic',              pack: null   },
  { name: 'Self-absorbed',         pack: 'EP06' },
  { name: 'Self-assured',          pack: null   },
  { name: 'Slob',                  pack: null   },
  { name: 'Snob',                  pack: null   },
  { name: 'Socially Awkward',      pack: 'EP12' },
  { name: 'Squeamish',             pack: 'GP01' },
  { name: 'Unflirty',              pack: 'EP03' },
  { name: 'Vegetarian',            pack: null   },
];

// ─── Form state ───────────────────────────────────────────────────────────────

const selectedPacks   = ref([]);
const logo            = ref('');
const pendingLogo     = ref('');
const title           = ref('');
const difficulty      = ref('');
const description     = ref('');
const tagsInput       = ref('');

const inheritanceLaw  = ref(null);
const bloodlineLaw    = ref(null);
const heirLaw         = ref(null);
const occultLaw       = ref(null);
const strictInheritance = ref(false);
const strictBloodline   = ref(false);
const strictHeir        = ref(false);
const strictOccult      = ref(false);
const exemplarTrait     = ref('');
const xenophobeSpecies  = ref('');

const openGenIndex = ref(null);
const generations  = ref([
  { number: 1, title: '', color: '#d9d9d9', description: '', requirements: [''], milestones: [''] },
  { number: 2, title: '', color: '#d9d9d9', description: '', requirements: [''], milestones: [''] },
  { number: 3, title: '', color: '#d9d9d9', description: '', requirements: [''], milestones: [''] },
]);

// ─── Logo modal ───────────────────────────────────────────────────────────────

const logoModalRef = ref(null);
let bsModal = null;

onMounted(() => {
  bsModal = new Modal(logoModalRef.value);
});

function openLogoModal() {
  pendingLogo.value = logo.value;
  bsModal.show();
}

function saveLogo() {
  logo.value = pendingLogo.value;
  bsModal.hide();
}

// ─── Computed ─────────────────────────────────────────────────────────────────

const inheritanceLawData = computed(() => ALL_LAWS.find(l => l.id === inheritanceLaw.value) ?? null);
const bloodlineLawData   = computed(() => ALL_LAWS.find(l => l.id === bloodlineLaw.value)   ?? null);
const heirLawData        = computed(() => ALL_LAWS.find(l => l.id === heirLaw.value)        ?? null);
const occultLawData      = computed(() => ALL_LAWS.find(l => l.id === occultLaw.value)      ?? null);

const showExemplarTrait    = computed(() => heirLaw.value === 12);
const showXenophobeSpecies = computed(() => occultLaw.value === 16);

const unlockedSpecies = computed(() => {
  const species = [];
  selectedPacks.value.forEach(id => {
    const s = PACK_CONTENT[id]?.species;
    if (s) species.push(s);
  });
  return species;
});

const unlockedTraitNames = computed(() => {
  const traits = new Set();
  selectedPacks.value.forEach(id => {
    PACK_CONTENT[id]?.traits?.forEach(t => traits.add(t));
  });
  return traits;
});

// ─── Methods ──────────────────────────────────────────────────────────────────

function handleTagKeydown(e) {
  if (!tagsInput.value.length) {
    if (e.key === ' ') e.preventDefault();
    tagsInput.value = '#';
  } else if (e.key === ' ') {
    e.preventDefault();
    if (tagsInput.value.slice(-1) !== '#') tagsInput.value += ' #';
  }
}

function toggleGen(index) {
  openGenIndex.value = openGenIndex.value === index ? null : index;
}

function addGeneration() {
  if (generations.value.length >= 12) return;
  const n = generations.value.length + 1;
  generations.value.push({ number: n, title: '', color: '#d9d9d9', description: '', requirements: [''], milestones: [''] });
  openGenIndex.value = n - 1;
}

function addField(gen, field) {
  if (gen[field].length < 5) gen[field].push('');
}

function removeField(gen, field, index) {
  gen[field].splice(index, 1);
}

function isTraitEnabled(trait) {
  return !trait.pack || unlockedTraitNames.value.has(trait.name);
}

function submitChallenge() {
  const tags = tagsInput.value
    .split(' ')
    .filter(t => t.startsWith('#'))
    .map(t => t.slice(1))
    .filter(Boolean);

  const payload = {
    title:       title.value,
    logo:        logo.value,
    difficulty:  difficulty.value,
    description: description.value,
    tags,
    packs: selectedPacks.value,
    succession_laws: {
      inheritance: { law: inheritanceLawData.value?.key ?? null, strict: strictInheritance.value },
      bloodline:   { law: bloodlineLawData.value?.key   ?? null, strict: strictBloodline.value },
      heir: {
        law:           heirLawData.value?.key ?? null,
        strict:        strictHeir.value,
        exemplar_trait: exemplarTrait.value || null,
      },
      occult: {
        law:    occultLawData.value?.key ?? null,
        strict: strictOccult.value,
        occult: xenophobeSpecies.value || null,
      },
    },
    generations: generations.value.map(g => ({
      number:       g.number,
      title:        g.title,
      color:        g.color,
      description:  g.description,
      requirements: g.requirements.filter(Boolean),
      milestones:   g.milestones.filter(Boolean),
    })),
  };

  console.log(payload);
  // TODO: axios.post('/api/challenges', payload).then(...)
}
</script>

<style scoped>
#logo-card {
  position: relative;
}

#logo-card.logo-selected #logo-btn {
  opacity: 0;
  transition: opacity 0.5s;
}

#logo-card.logo-selected:hover #logo-btn {
  opacity: 1;
}
</style>
