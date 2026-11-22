<template>
  <div class="rb-education-list">
    <section v-for="(education, index) in educations" :key="index" class="rb-repeat full">
      <div class="rb-repeat-head">
        <b>Education {{ index + 1 }}</b>
        <button
          v-if="educations.length > 1"
          class="rb-link"
          type="button"
          @click="emit('remove', index)"
        >
          Remove
        </button>
      </div>
      <div class="rb-fields">
        <label class="rb-field">
          <span>Degree or course</span>
          <input v-model="education.title" placeholder="e.g. B.E. — Computer Science" />
        </label>
        <label class="rb-field">
          <span>School</span>
          <input v-model="education.institution" placeholder="e.g. University of Mumbai" />
        </label>
        <label class="rb-field">
          <span>Location</span>
          <input v-model="education.location" placeholder="City, Country" />
        </label>
        <label class="rb-field">
          <span>Year</span>
          <input v-model="education.year" placeholder="e.g. Graduated May 2020" />
        </label>
        <label class="rb-field">
          <span>Percentage or grade</span>
          <input v-model="education.percentage" placeholder="e.g. 85%" />
        </label>
      </div>
    </section>
    <div class="rb-field full">
      <button class="rb-add" type="button" @click="emit('add')">+ Add another</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EducationEntry } from '@/types/builder'

const educations = defineModel<EducationEntry[]>({ required: true })
const emit = defineEmits<{
  add: []
  remove: [index: number]
}>()
</script>
