<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <RouterLink class="navbar-brand me-1" to="/">
        <img src="/img/plumbob.svg" alt="plumbob" style="width: 45px; margin: -5px;">
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" active-class="active">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/challenges/create" active-class="active">Create</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/challenges" active-class="active">Browse</RouterLink>
          </li>
        </ul>
        <form class="d-flex" role="search" @submit.prevent>
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>
