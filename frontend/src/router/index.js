import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/challenges/create',
    name: 'challenge-create',
    component: () => import('../views/CreateChallengeView.vue'),
  },
  {
    path: '/challenges',
    name: 'challenges-browse',
    component: () => import('../views/BrowseChallengesView.vue'),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
