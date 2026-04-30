<template>
  <v-app>
    <v-app-bar flat border="b" color="surface">
      <div class="nav-inner">

        <!-- Left: logo + site name -->
        <RouterLink to="/" class="nav-left text-decoration-none">
          <img src="/img/plumbob.svg" alt="plumbob" style="width: 34px;">
          <span class="text-h6 font-weight-medium text-high-emphasis ml-2">Sims Legacies</span>
        </RouterLink>

        <!-- Center: nav links -->
        <div class="nav-center">
          <v-btn variant="text" to="/" exact>Home</v-btn>
          <v-btn variant="text" to="/challenges/create">Create</v-btn>
          <v-btn variant="text" to="/challenges">Browse</v-btn>
        </div>

        <!-- Right: auth -->
        <div class="nav-right">
          <template v-if="currentUser">
            <v-menu>
              <template #activator="{ props }">
                <div v-bind="props" class="nav-profile">
                  <v-avatar size="32" color="primary">
                    <v-img v-if="currentUser.profilePictureUrl" :src="currentUser.profilePictureUrl" />
                    <v-icon v-else color="white">mdi-account</v-icon>
                  </v-avatar>
                  <span class="ml-2 text-body-2 font-weight-medium">{{ currentUser.username }}</span>
                  <v-icon size="18" class="ml-1">mdi-chevron-down</v-icon>
                </div>
              </template>
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-account-outline" title="Profile" />
                <v-list-item prepend-icon="mdi-cog-outline" title="Settings" />
                <v-divider />
                <v-list-item prepend-icon="mdi-logout" title="Sign out" />
              </v-list>
            </v-menu>
          </template>
          <template v-else>
            <v-btn variant="text" to="/login">Log in</v-btn>
            <v-btn variant="flat" color="primary" to="/register" class="ml-2">Sign up</v-btn>
          </template>
        </div>

      </div>
    </v-app-bar>

    <v-main>
      <v-container style="max-width: 960px;">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const currentUser = null;
</script>

<style scoped>
.nav-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  padding: 0 12px;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-center {
  display: flex;
  align-items: center;
}

.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.nav-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
}

.nav-profile:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
