<template>
  <div class="rb-project-list">
    <section v-for="(project, index) in projects" :key="index" class="rb-repeat full">
      <div class="rb-repeat-head">
        <b>Project {{ index + 1 }}</b>
        <button
          v-if="projects.length > 1"
          class="rb-link"
          type="button"
          @click="emit('remove', index)"
        >
          Remove
        </button>
      </div>
      <div class="rb-fields">
        <label class="rb-field full">
          <span>Project name</span>
          <input v-model="project.name" placeholder="e.g. Customer onboarding platform" />
        </label>
        <label class="rb-field full">
          <span>Description</span>
          <textarea
            v-model="project.description"
            rows="4"
            placeholder="Describe the project, your contribution, and its impact."
          ></textarea>
        </label>
        <label class="rb-field full">
          <span>Technology stack</span>
          <textarea
            :value="project.techStack.join(', ')"
            rows="2"
            placeholder="e.g. Node.js, PostgreSQL, AWS"
            @input="updateTechStack(project, $event)"
          ></textarea>
          <span class="rb-small">Separate technologies with commas.</span>
        </label>
      </div>
    </section>
    <button class="rb-add" type="button" @click="emit('add')">+ Add another project</button>
  </div>
</template>

<script setup lang="ts">
import type { ProjectEntry } from '@/types/builder'

const projects = defineModel<ProjectEntry[]>({ required: true })
const emit = defineEmits<{
  add: []
  remove: [index: number]
}>()

function updateTechStack(project: ProjectEntry, event: Event) {
  project.techStack = (event.target as HTMLTextAreaElement).value
    .split(',')
    .map((technology) => technology.trim())
    .filter(Boolean)
}
</script>
