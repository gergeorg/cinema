<template>
  <button
    class="button"
    :class="buttonClasses"
    :type="type"
    :aria-label="ariaLabel"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <!-- Иконка слева -->
    <BaseIcon
      v-if="icon && iconPosition === 'left'"
      :name="icon"
      :size="iconSize"
      class="button__icon"
      :class="{ 'button__icon--active': active }"
    />

    <slot />

    <!-- Иконка справа -->
    <BaseIcon
      v-if="icon && iconPosition === 'right'"
      :name="icon"
      :size="iconSize"
      class="button__icon"
      :class="{ 'button__icon--active': active }"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'blue',
  },
  size: {
    type: String,
    default: 'big',
  },
  type: {
    type: String,
    default: 'button',
  },
  icon: {
    type: String,
    default: null,
  },
  iconPosition: {
    type: String,
    default: 'left',
  },
  iconSize: {
    type: [Number, String],
    default: 24,
  },
  ariaLabel: {
    type: String,
    default: null,
  },
  active: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])

const buttonClasses = computed(() => [
  `button--${props.variant}`,
  `button--${props.size}`,
  { 'button--active': props.active },
])
</script>

<style scoped lang="scss">
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  line-height: 133%;
  color: #fff;
  border-radius: 28px;
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out,
    border-color 0.3s ease-in-out;

  &--blue {
    border: 1px solid #67a5eb;
    background-color: #67a5eb;

    &:hover,
    &:focus-visible {
      border-color: #45526e;
      background-color: #45526e;
      color: rgba(255, 255, 255, 0.5);
    }

    &:focus-visible {
      outline: 1px solid #b4a9ff;
      outline-offset: 1px;
    }
  }

  &--dark {
    border: 1px solid rgba(0, 0, 0, 0.4);
    background-color: #393b3c;

    &:hover,
    &:focus-visible {
      border-color: rgba(0, 0, 0, 0.4);
      background-color: #747474;
      color: rgba(255, 255, 255, 0.5);
    }

    &:focus-visible {
      outline: 1px solid #b4a9ff;
      outline-offset: 1px;
    }
  }

  &--big {
    padding: 16px 48px;
  }

  &--small {
    padding: 16px 22px;
  }

  &__icon {
    display: inline-block;
    flex-shrink: 0;
    color: inherit;

    &--active {
      color: #b4a9ff;
    }

    &:not(:last-child) {
      margin-right: 8px;
    }
  }

  &:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
