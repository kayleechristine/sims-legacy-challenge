<template>
  <v-app>
    <v-app-bar flat border="b" color="surface">
      <template #prepend>
        <RouterLink to="/" class="d-flex align-center ml-2">
          <img src="/img/plumbob.svg" alt="plumbob" style="width: 36px;">
        </RouterLink>
      </template>

      <v-app-bar-title>
        <RouterLink to="/" class="text-decoration-none text-high-emphasis">
          Sims Legacies
        </RouterLink>
      </v-app-bar-title>

      <template #append>
        <v-btn variant="text" to="/">Home</v-btn>
        <v-btn variant="text" to="/challenges/create">Create</v-btn>
        <v-btn variant="text" to="/challenges">Browse</v-btn>
        <v-text-field
          variant="outlined"
          density="compact"
          placeholder="Search"
          hide-details
          class="mx-3"
          style="max-width: 200px;"
          prepend-inner-icon="mdi-magnify"
        />
      </template>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
