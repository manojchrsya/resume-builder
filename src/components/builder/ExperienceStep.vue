<template>
  <div class="rb-experience-list">
    <section v-for="(experience, index) in experiences" :key="index" class="rb-repeat full">
      <div class="rb-repeat-head">
        <b>Experience {{ index + 1 }}</b>
        <button
          v-if="experiences.length > 1"
          class="rb-link"
          type="button"
          @click="emit('remove', index)"
        >
          Remove
        </button>
      </div>
      <div class="rb-fields">
        <label class="rb-field">
          <span>Company</span>
          <input v-model="experience.company" placeholder="e.g. Acme Inc." />
        </label>
        <label class="rb-field">
          <span>Company website</span>
          <input v-model="experience.url" type="url" placeholder="https://example.com" />
        </label>
        <label class="rb-field">
          <span>Location</span>
          <input v-model="experience.location" placeholder="City, Country" />
        </label>
        <label class="rb-field">
          <span>Total duration</span>
          <input v-model="experience.totalDuration" placeholder="e.g. Jan 2021 — Present" />
        </label>
      </div>

      <section
        v-for="(designation, designationIndex) in experience.designations"
        :key="designationIndex"
        class="rb-designation"
      >
        <div class="rb-repeat-head">
          <b>Role {{ designationIndex + 1 }}</b>
          <button
            v-if="experience.designations.length > 1"
            class="rb-link"
            type="button"
            @click="removeDesignation(experience, designationIndex)"
          >
            Remove
          </button>
        </div>
        <div class="rb-fields">
          <label class="rb-field">
            <span>Job title</span>
            <input v-model="designation.title" placeholder="e.g. Engineering Manager" />
          </label>
          <label class="rb-field">
            <span>Duration</span>
            <input v-model="designation.duration" placeholder="e.g. Aug 2022 — Present" />
          </label>
          <label class="rb-field rb-checkbox">
            <input v-model="designation.current" type="checkbox" />
            <span>Current role</span>
          </label>
          <label class="rb-field rb-checkbox">
            <input v-model="designation.promoted" type="checkbox" />
            <span>Promoted to this role</span>
          </label>
          <label class="rb-field full">
            <span>Responsibilities (one per line)</span>
            <textarea
              :value="responsibilityInputValue(designation)"
              rows="4"
              placeholder="Led a team of engineers..."
              @input="updateResponsibilities(designation, $event)"
            ></textarea>
          </label>
        </div>
      </section>
      <button class="rb-add" type="button" @click="addDesignation(experience)">
        + Add another role at this company
      </button>
    </section>
    <button class="rb-add" type="button" @click="emit('add')">+ Add another experience</button>
  </div>
</template>

<script setup lang="ts">
import type { DesignationEntry, ExperienceEntry } from '@/types/builder'

const experiences = defineModel<ExperienceEntry[]>({ required: true })
const emit = defineEmits<{
  add: []
  remove: [index: number]
}>()

const responsibilityDrafts = new WeakMap<DesignationEntry, string>()

function blankDesignation(): DesignationEntry {
  return { title: '', current: false, promoted: false, duration: '', responsibilities: [''] }
}

function responsibilityInputValue(designation: DesignationEntry) {
  return responsibilityDrafts.get(designation) ?? designation.responsibilities.join('\n')
}

function addDesignation(experience: ExperienceEntry) {
  experience.designations.push(blankDesignation())
}

function removeDesignation(experience: ExperienceEntry, index: number) {
  experience.designations.splice(index, 1)
  if (!experience.designations.length) experience.designations.push(blankDesignation())
}

function updateResponsibilities(designation: DesignationEntry, event: Event) {
  const value = (event.target as HTMLTextAreaElement).value
  responsibilityDrafts.set(designation, value)
  designation.responsibilities = value
    .split('\n')
    .map((responsibility) => responsibility.trim())
    .filter(Boolean)
}
</script>
