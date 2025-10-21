import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import TopFilm from '@/components/TopFilm.vue'
import TheError from '@/components/TheError.vue'
import TopFilmSkeleton from '@/components/TopFilmSkeleton.vue'
import BaseButton from '@/components/ui/BaseButton.vue'


const fetchAllMovies = vi.fn()
const fetchRandomMovie = vi.fn()
const fetchMovieById = vi.fn()
const fetchFavorites = vi.fn()
const toggleFavorite = vi.fn()

let moviesStore: any
let favoritesStore: any
let authStore: any

vi.mock('@/stores/useMoviesStore', () => ({
  useMoviesStore: () => moviesStore,
}))
vi.mock('@/stores/useFavoritesStore', () => ({
  useFavoritesStore: () => favoritesStore,
}))
vi.mock('@/stores/useAuthStore', () => ({
  useAuthStore: () => authStore,
}))

const pushMock = vi.fn()
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useRouter: () => ({ push: pushMock }),
    RouterLink: { template: '<a><slot /></a>' },
  }
})


const mountTopFilm = (options = {}) => {
  return mount(TopFilm, {
    global: {
      stubs: {
        TheRating: true,
        BaseButton,
        TopFilmSkeleton,
        TheError,
      },
    },
    ...options,
  })
}

describe('TopFilm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    moviesStore = {
      allMovies: [],
      fetchAllMovies,
      fetchRandomMovie,
      fetchMovieById,
      randomMovie: ref(null),
      selectedMovie: ref(null),
      loadingRandom: ref(false),
      loadingSelected: ref(false),
      errorRandom: ref(''),
    }

    favoritesStore = {
      favorites: ref([]),
      fetchFavorites,
      toggleFavorite,
    }

    authStore = {
      isAuthenticated: false,
    }
  })

  it('показывает ошибку, если errorRandom существует', async () => {
    moviesStore.errorRandom.value = 'Ошибка загрузки'
    const wrapper = mountTopFilm()

    await wrapper.vm.$nextTick()
    const error = wrapper.findComponent(TheError)
    expect(error.exists()).toBe(true)
  })

  it('показывает skeleton, если loading = true', async () => {
    moviesStore.loadingRandom.value = true
    const wrapper = mountTopFilm()

    await wrapper.vm.$nextTick()
    const skeleton = wrapper.findComponent(TopFilmSkeleton)
    expect(skeleton.exists()).toBe(true)
  })

  it('рендерит фильм, если данные загружены', async () => {
    moviesStore.randomMovie.value = {
      id: 1,
      title: 'Interstellar',
      releaseYear: 2014,
      genres: ['Sci-Fi'],
      runtime: 169,
      plot: 'Space travel.',
      tmdbRating: 8.6,
    }

    const wrapper = mountTopFilm()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.top-film__name').exists()).toBe(true)
    expect(wrapper.text()).toContain('Interstellar')
    expect(wrapper.text()).toContain('2014')
  })

  it('форматирует продолжительность фильма корректно', async () => {
    moviesStore.randomMovie.value = {
      id: 1,
      title: 'Test',
      runtime: 125,
      releaseYear: 2014,
      genres: ['Drama'],
    }

    const wrapper = mountTopFilm()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('2 ч 5 мин')
  })

  it('при клике на кнопку "Трейлер" вызывает событие open-trailer', async () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
    moviesStore.randomMovie.value = {
      id: 1,
      title: 'Film',
      trailerUrl: 'https://youtube.com/trailer',
    }

    const wrapper = mountTopFilm()
    await wrapper.vm.$nextTick()

    const button = wrapper.findAllComponents(BaseButton)[0]
    await button.trigger('click')

    expect(dispatchSpy).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        type: 'open-trailer',
        detail: 'https://youtube.com/trailer',
      }),
    )
  })

  it('при клике на кнопку "О фильме" вызывает router.push', async () => {
    moviesStore.randomMovie.value = { id: 1, title: 'Film' }
    const wrapper = mountTopFilm()
    await wrapper.vm.$nextTick()

    const button = wrapper.findAllComponents(BaseButton).find((b) => b.text() === 'О фильме')
    expect(button).toBeTruthy()

    await button!.trigger('click')
    expect(pushMock).toHaveBeenCalledExactlyOnceWith('/movies/1')
  })

  it('при клике на "избранное" без авторизации вызывает open-auth', async () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
    moviesStore.randomMovie.value = { id: 1, title: 'Film' }
    authStore.isAuthenticated = false

    const wrapper = mountTopFilm()
    await wrapper.vm.$nextTick()

    const favoriteBtn = wrapper.findAllComponents(BaseButton).at(2)
    await favoriteBtn!.trigger('click')

    expect(dispatchSpy).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ type: 'open-auth' }),
    )
  })
})
