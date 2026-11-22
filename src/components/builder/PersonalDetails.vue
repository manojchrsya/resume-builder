<template>
  <div class="rb-fields">
    <label class="rb-field">
      <span>Full name</span>
      <input
        id="f-p-name"
        v-model="details.name"
        autocomplete="name"
        placeholder="e.g. Alex Morgan"
        :aria-invalid="showErrors && !details.name.trim()"
        aria-describedby="err-f-p-name"
      />
      <span id="err-f-p-name" class="rb-err" role="alert">
        {{ showErrors && !details.name.trim() ? 'Please enter your name.' : '' }}
      </span>
    </label>
    <label class="rb-field">
      <span>Job title</span>
      <input v-model="details.title" placeholder="e.g. Product Designer" />
    </label>
    <label class="rb-field">
      <span>Email</span>
      <input
        id="f-p-email"
        v-model="details.email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :aria-invalid="showErrors && !isEmailValid"
        aria-describedby="err-f-p-email"
      />
      <span id="err-f-p-email" class="rb-err" role="alert">
        {{ showErrors ? emailError : '' }}
      </span>
    </label>
    <label class="rb-field">
      <span>Phone</span>
      <input v-model="details.phone" type="tel" autocomplete="tel" placeholder="+1 555 000 0000" />
    </label>
    <label class="rb-field">
      <span>Location</span>
      <input
        v-model="details.location"
        autocomplete="address-level2"
        placeholder="City, Country"
      />
    </label>
    <label class="rb-field">
      <span>LinkedIn</span>
      <input v-model="details.linkedin" placeholder="https://linkedin.com/in/yourname" />
    </label>
    <label class="rb-field">
      <span>GitHub</span>
      <input v-model="details.github" placeholder="https://github.com/yourname" />
    </label>
  </div>
</template>

<script setup lang="ts">
import type { HeaderDetails } from '@/types/builder'

defineProps<{
  showErrors: boolean
  isEmailValid: boolean
  emailError: string
}>()

const details = defineModel<HeaderDetails>({ required: true })
</script>
