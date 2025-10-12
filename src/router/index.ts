import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GenresView from '@/views/GenresView.vue'
import MovieView from '@/views/MovieView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/genres',
      name: 'genres',
      component: GenresView,
    },
    {
      path: '/movies/:id',
      name: 'movie',
      component: MovieView,
      props: true,
    },
  ],
})

export default router
