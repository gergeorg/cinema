# 🎬 VK Маруся — Онлайн-платформа для поиска и оценки фильмов

> Финальный проект курса **Skillbox — Frontend-разработчик (Vue)**  
> Разработка бета-версии стримингового сервиса **VK Маруся** по макетам от партнёров VK.  
> Приложение создано с использованием **Vue 3**, **TypeScript**, **Pinia**, **Axios**, **Swiper.js** и **Vue Router**.

---

## 🌐 Демо проекта

🚀 Готовая версия доступна по ссылке:  
👉 **[https://cinema-awhv.onrender.com/](https://cinema-awhv.onrender.com/)**

---

## 🚀 О проекте

**VK Маруся** — это онлайн-платформа, где пользователи могут:

- искать фильмы по названию,
- просматривать топ-10 фильмов,
- смотреть трейлеры,
- добавлять фильмы в избранное,
- управлять своим аккаунтом.

Проект разработан по макетам от **VK** и имитирует реальный поток работы стримингового сервиса.

---

## 🧭 Основной функционал

### 🏠 Главная страница

- 🎲 Случайный фильм с возможностью перегенерации
- ⭐ Топ-10 фильмов
- 🔍 Поиск фильмов в модальном окне
- 🌀 Используется **Swiper.js** для слайдера фильмов и адаптивных каруселей

### 🎞 Раздел «Жанры»

- Категории фильмов в виде карточек
- Просмотр фильмов выбранного жанра

### 🎬 Страница фильма

- Подробная информация о фильме
- ▶️ Просмотр трейлера (модальное окно)
- 💖 Добавление или удаление фильма из избранного (только авторизованные пользователи)

### 👤 Аккаунт пользователя

- Отображение личных данных
- Список избранных фильмов
- Кнопка выхода из профиля

### 🔐 Авторизация / Регистрация

- Модальные формы входа и регистрации
- Подсветка ошибок валидации
- Сохранение сессии через cookie

---

## ⚙️ Технологический стек

| Технология                  | Назначение                    |
| --------------------------- | ----------------------------- |
| **Vue 3**                   | Основной фреймворк            |
| **TypeScript**              | Типизация кода                |
| **Pinia**                   | Управление состоянием         |
| **Axios**                   | Работа с API                  |
| **Vue Router**              | Маршрутизация                 |
| **Swiper.js**               | Слайдер и карусели            |
| **SASS (SCSS)**             | Препроцессор стилей           |
| **Vitest + Vue Test Utils** | Unit-тестирование             |
| **ESLint + Prettier**       | Форматирование и линтинг кода |
| **Vite**                    | Сборка и dev-сервер           |

---

## 📁 Структура проекта

```
cinema/
├── 📘 README.md                 # Документация проекта
├── ⚙️  env.d.ts                 # Типизация для окружения
├── 🧩 eslint.config.ts          # Конфигурация ESLint
├── 🌐 index.html                # Основной HTML-файл приложения
├── 📦 package.json              # Скрипты и зависимости проекта
├── 🔒 package-lock.json         # Версии зависимостей
├── ⚙️  vite.config.ts           # Конфигурация Vite
├── 🧪 vitest.config.ts          # Конфигурация Vitest
├── 🧠 tsconfig.json             # Базовая конфигурация TypeScript
├── 🧠 tsconfig.app.json         # TS-конфиг для приложения
├── 🧠 tsconfig.node.json        # TS-конфиг для Node.js
├── 🧠 tsconfig.vitest.json      # TS-конфиг для тестов

│
├── 🏛 public/                   # Публичные ресурсы
│   └── 🖼 favicon.ico           # Иконка сайта

│
├── 💻 src/                      # Исходный код приложения
│   ├── 🧩 App.vue               # Корневой компонент приложения
│   ├── 🚀 main.ts               # Точка входа (инициализация Vue, Pinia, Router)

│
│   ├── 🔗 api/                  # Работа с API
│   │   └── api.ts               # Настройка Axios и эндпоинтов

│
│   ├── 🎨 assets/               # Ресурсы: изображения, шрифты, стили
│   │   ├── base.css
│   │   ├── fonts.css
│   │   ├── variables.css
│   │   ├── main.css
│   │   ├── 🖼 genres/           # Изображения для жанров
│   │   ├── logo.png
│   │   ├── small_logo.png
│   │   ├── no-poster.png
│   │   └── sprite.svg

│
│   ├── 🧱 components/           # Компоненты приложения
│   │   ├── AccountFavorites.vue
│   │   ├── AccountSettings.vue
│   │   ├── FilmCard.vue
│   │   ├── FilmCardSkeleton.vue
│   │   ├── LoginModal.vue
│   │   ├── RegisterModal.vue
│   │   ├── ModalSuccess.vue
│   │   ├── MovieAboutSkeleton.vue
│   │   ├── TheError.vue
│   │   ├── TheFooter.vue
│   │   ├── TheHeader.vue
│   │   ├── TheNav.vue
│   │   ├── TopFilm.vue
│   │   ├── TopFilmSkeleton.vue
│   │   ├── TopList.vue
│   │   │
│   │   ├── 🧪 __tests__/         # Юнит-тесты для компонентов
│   │   │   ├── BaseButton.spec.ts
│   │   │   ├── BaseIcon.spec.ts
│   │   │   ├── BaseInput.spec.ts
│   │   │   ├── BaseModal.spec.ts
│   │   │   ├── FilmCard.spec.ts
│   │   │   ├── TopFilm.spec.ts
│   │   │   ├── TrailerModal.spec.ts
│   │   │   └── ...
│   │   │
│   │   └── 🧩 ui/               # Базовые UI-компоненты
│   │       ├── BaseButton.vue
│   │       ├── BaseIcon.vue
│   │       ├── BaseInput.vue
│   │       ├── BaseModal.vue
│   │       ├── MovieParamItem.vue
│   │       ├── SearchDropdown.vue
│   │       ├── SearchForm.vue
│   │       ├── TheRating.vue
│   │       └── TrailerModal.vue

│
│   ├── 🧭 router/               # Маршрутизация
│   │   └── index.ts             # Определение маршрутов Vue Router

│
│   ├── 🧰 stores/               # Состояние приложения (Pinia)
│   │   ├── useAuthStore.ts
│   │   ├── useFavoritesStore.ts
│   │   ├── useMoviesStore.ts
│   │   │
│   │   └── 🧪 __tests__/         # Тесты для Pinia-хранилищ
│   │       ├── useAuthStore.spec.ts
│   │       ├── useFavoritesStore.spec.ts
│   │       └── useMoviesStore.spec.ts

│
│   ├── 🧩 types/                # Общие интерфейсы и типы TypeScript
│   │   └── index.ts

│
│   └── 📄 views/                # Основные страницы (роуты)
│       ├── HomeView.vue         # Главная страница
│       ├── GenresView.vue       # Список жанров
│       ├── GenreView.vue        # Просмотр фильмов по жанру
│       ├── MovieView.vue        # Страница конкретного фильма
│       └── AccountView.vue      # Аккаунт пользователя
```

## 🧩 Работа с API

Документация: [https://cinemaguide.skillbox.cc/docs/](https://cinemaguide.skillbox.cc/docs/)

**Особенности:**

- Авторизация через cookie (`withCredentials: true`)
- Автоматическое завершение сессии при истечении cookie
- Обработка ошибок с уведомлениями пользователю
- Загрузка данных фильмов и жанров с API Skillbox

---

## 🧪 Тестирование и покрытие

Проект покрыт unit-тестами с помощью **Vitest**.  
Проверяются ключевые компоненты, хранилища и бизнес-логика.

### 📊 Отчёт о покрытии (V8 Coverage Report)

| Метрика        | Покрытие  |
| -------------- | --------- |
| **Statements** | 🟢 79.52% |
| **Branches**   | 🟢 80%    |
| **Functions**  | 🟡 75.55% |
| **Lines**      | 🟢 79.52% |

> 💬 Основные файлы логики и хранилищ (`src/stores`, `src/api`, `src/components`) покрыты на **90–100%**, что свидетельствует о высоком качестве кода и тестируемости приложения.  
> Некоторые файлы представляют UI-слой без бизнес-логики и тесты для них минимальны.

📘 Команда для запуска тестов:

```bash
npm run test:unit
```

---

## 💾 Установка и запуск

```bash
git clone https://github.com/gergeorg/cinema.git
cd cinema
npm install
npm run dev
```
