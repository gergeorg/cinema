import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GenresView from '@/views/GenresView.vue'
import GenreView from '@/views/GenreView.vue'
import MovieView from '@/views/MovieView.vue'
import AccountView from '@/views/AccountView.vue'

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
      path: '/genres/:genre',
      name: 'genre',
      component: GenreView,
      props: true,
    },
    {
      path: '/movies/:id',
      name: 'movie',
      component: MovieView,
      props: true,
    },
    {
      path: '/profile',
      name: 'profile',
      component: AccountView,
      props: true,
    },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
