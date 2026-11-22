<template>
  <div class="rb-skills-summary">
    <label class="rb-field full">
      <span>Professional summary</span>
      <textarea
        v-model="summary"
        rows="4"
        placeholder="Write 2–3 sentences about your experience, strengths, and what you’re looking for."
      ></textarea>
    </label>

    <section v-for="(group, index) in skills" :key="index" class="rb-repeat full">
      <div class="rb-repeat-head">
        <b>Skill group {{ index + 1 }}</b>
        <button class="rb-link" type="button" @click="removeGroup(index)">Remove</button>
      </div>
      <div class="rb-fields">
        <label class="rb-field">
          <span>Group title</span>
          <input v-model="group.title" placeholder="e.g. Languages" />
        </label>
        <label class="rb-field">
          <span>Skills</span>
          <textarea
            :value="skillInputValue(group)"
            rows="2"
            placeholder="e.g. Node.js, TypeScript, SQL"
            @input="updateSkills(index, $event)"
          ></textarea>
          <span class="rb-small">Separate skills with commas.</span>
        </label>
      </div>
    </section>

    <div class="rb-field full">
      <button class="rb-add" type="button" @click="addGroup">+ Add skill group</button>
    </div>
    <label class="rb-field full rb-checkbox">
      <input v-model="config.enableGridColumn" type="checkbox" />
      <span>Use a two-column skills layout in the resume</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import type { SkillGroup } from '@/types/builder'

const summary = defineModel<string>('summary', { required: true })
const skills = defineModel<SkillGroup[]>('skills', { required: true })
const config = defineModel<{ enableGridColumn: boolean }>('config', { required: true })

function addGroup() {
  skills.value.push({ title: '', skills: [''] })
}

function removeGroup(index: number) {
  skills.value.splice(index, 1)
}

const skillDrafts = new WeakMap<SkillGroup, string>()

function skillInputValue(group: SkillGroup) {
  return skillDrafts.get(group) ?? group.skills.join(', ')
}

function updateSkills(index: number, event: Event) {
  const group = skills.value[index]
  if (!group) return
  const value = (event.target as HTMLTextAreaElement).value
  skillDrafts.set(group, value)
  group.skills = value
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
}
</script>
