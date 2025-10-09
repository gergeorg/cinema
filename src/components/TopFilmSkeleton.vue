<template>
  <div class="container top-film__container">
    <div class="top-film__info">
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--text"></div>
      <div class="skeleton skeleton--text short"></div>
      <div class="skeleton skeleton--buttons">
        <div class="skeleton skeleton--btn"></div>
        <div class="skeleton skeleton--btn"></div>
        <div class="skeleton skeleton--btn small"></div>
        <div class="skeleton skeleton--btn small"></div>
      </div>
    </div>

    <div class="top-film__poster">
      <div class="skeleton skeleton--poster"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  margin-bottom: 12px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -150px;
    height: 100%;
    width: 150px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 1.2s infinite;
  }

  &--title {
    width: 80%;
    height: 48px;
    margin: 16px 0;
  }

  &--text {
    width: 100%;
    height: 20px;

    &.short {
      width: 60%;
    }
  }

  &--buttons {
    display: flex;
    gap: 16px;
    margin-top: 40px;
    background-color: transparent;
  }

  &--btn {
    width: 140px;
    height: 48px;
    border-radius: 12px;

    &.small {
      width: 48px;
      height: 48px;
    }
  }

  &--poster {
    width: 100%;
    height: 552px;
    border-radius: 16px;
  }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>

<script setup lang="ts"></script>
