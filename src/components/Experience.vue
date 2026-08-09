<!-- eslint-disable vue/multi-word-component-names -->
<!-- EXPERIENCE -->
<template>
  <div class="section">
    <div class="section-title-row">
      <div class="section-title">Work Experience</div>
      <button class="btn tiny secondary" v-if="isEditing" data-action="add-experience" @click="addExperience">+ Add Company</button>
    </div>
    <div id="experienceList">
      <div class="entry" v-for="(data, index) in experiences" :key="index" :data-pi="index">
        <button class="remove-btn entry-remove" v-if="isEditing" title="Remove company" @click="removeExperience" :data-pi="index">×</button>
        <!-- Company header (shared) -->
        <div class="entry-header" style="margin-bottom: 6px">
          <div class="entry-org" style="font-style: normal; font-weight: 700; font-size: 13.5px; color: var(--text)">
            <a :href="data.url ? data.url : 'javascript:void(0)'" class="entry-org" :contenteditable="isEditing" data-field="company" @blur="updateExperience">{{ data.company }}</a>
            &nbsp;·&nbsp;
            <span style="font-weight: 400; font-size: 12px; color: var(--light)" :contenteditable="isEditing" data-field="location" @blur="updateExperience">{{ data.location }}</span>
          </div>
          <div class="entry-date" :contenteditable="isEditing" data-field="duration" @blur="updateExperience">{{ data.duration }}</div>
        </div>

        <!-- Role 2: Current (promoted) -->
        <div v-for="(designation, designationIndex) in data.designations" :key="designationIndex"
          :style="
            designation.current
              ? 'position:relative; padding-left:14px; border-left:2px solid var(--accent); margin-bottom:10px;'
              : 'position:relative; padding-left:14px; border-left:2px solid #d1d5db; margin-bottom:10px;'
          ">
          <button class="remove-btn" v-if="isEditing && data.designations.length > 1" style="position:absolute; top:0; right:-20px;" title="Remove role" @click="removeRole" :data-ei="index" :data-di="designationIndex">×</button>
          <div class="entry-header">
            <div style="display: flex; align-items: center; gap: 8px">
              <div class="entry-role" data-field="title" :contenteditable="isEditing" @blur="updateExperience" >{{ designation.title }}</div>
              <span v-if="designation.promoted" @click="promotionToggle" :data-ei="index" :data-di="designationIndex"
                style="
                  font-size: 10px;
                  font-weight: 700;
                  background: #e8f0fe;
                  color: #1a3a5c;
                  padding: 1px 7px;
                  border-radius: 3px;
                  letter-spacing: 0.5px;
                  text-transform: uppercase;
                "
                >Promoted</span
              >
              <button class="role-badge" v-if="isEditing && !designation.promoted" @click="promotionToggle" :data-ei="index" :data-di="designationIndex" title="Toggle promotion flag">+ Mark Promotion</button>
            </div>
            <div class="entry-date" data-field="duration" :contenteditable="isEditing" @blur="updateExperience">{{ designation.duration }}</div>
          </div>
          <ul >
            <li v-for="(responsibility, responsibilityIndex) in designation.responsibilities" :key="responsibilityIndex">
              <span class="li-text" data-field="responsibility" :contenteditable="isEditing" @blur="updateExperience">{{ responsibility }} </span>
              <button class="remove-btn" v-if="isEditing" title="Remove line" @click="removeResponsibility" :data-ei="index" :data-di="designationIndex" :data-ri="responsibilityIndex">×</button>
            </li>
          </ul>
          <div class="add-row">
            <button class="btn tiny secondary" v-if="isEditing" @click="addResponsibility" :data-ei="index" :data-di="designationIndex">+ Line</button>
          </div>
        </div>
        <div class="add-row">
          <button class="btn tiny secondary" v-if="isEditing" @click="addDesignation" :data-ei="index">+ Role at this company</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Experience } from '@/types/common'
import { useEditorStore } from '@/stores/editor';
import { storeToRefs } from 'pinia';
const editor = useEditorStore();
const { isEditing } = storeToRefs(editor);

const emit = defineEmits(['add:experience', 'update:experience']);

const props = defineProps({
  experiences: {
    type: Array as () => Experience[],
    required: true,
  },
})
const { experiences } = props;

function removeExperience(event: Event) {
  const index = Number((event.currentTarget as HTMLElement).dataset.pi);
  console.log('Removing experience at index:', index);
  const updatedExperiences = [...experiences];
  updatedExperiences.splice(index, 1);
  emit('update:experience', updatedExperiences);
}

function addExperience() {
  const newExperience: Experience = {
    company: 'New Company',
    url: '',
    location: 'Mumbai, India',
    duration: 'October 2023 - September 2024',
    designations: [
      {
        title: 'New Role',
        current: false,
        promoted: false,
        duration: '',
        responsibilities: ["New responsibility 1", "New responsibility 2"],
      },
    ],
  };
  emit('add:experience', newExperience);
}

function removeRole(event: Event) {
  const target = event.currentTarget as HTMLElement;
  const experienceIndex = Number(target.dataset.ei);
  const designationIndex = Number(target.dataset.di);

  if (isNaN(experienceIndex) || isNaN(designationIndex)) return;

  const updatedExperiences = [...experiences];
  const experience = updatedExperiences[experienceIndex];
  if (!experience) return;

  experience.designations.splice(designationIndex, 1);
  emit('update:experience', updatedExperiences);
}

function updateExperience(event: Event) {
  const target = event.currentTarget as HTMLElement;
  const field = target.dataset.field as keyof Experience;
  const entry = target.closest('.entry');
  const index = entry instanceof HTMLElement ? Number(entry.dataset.pi) : -1;
  if (index !== undefined && field) {
    const updatedExperience = { ...experiences[index], [field]: target.innerText };
    emit('update:experience', experiences.map((exp, i) => i === index ? updatedExperience : exp));
  }
}

function removeResponsibility(event: Event) {
  const target = event.currentTarget as HTMLElement;
  const experienceIndex = Number(target.dataset.ei);
  const designationIndex = Number(target.dataset.di);
  const responsibilityIndex = Number(target.dataset.ri);

  if (isNaN(experienceIndex) || isNaN(designationIndex) || isNaN(responsibilityIndex)) return;

  const updatedExperiences = [...experiences];
  const experience = updatedExperiences[experienceIndex];
  if (!experience) return;

  const designation = experience.designations[designationIndex];
  if (!designation) return;

  designation.responsibilities.splice(responsibilityIndex, 1);
  emit('update:experience', updatedExperiences);
}

function addResponsibility(event: Event) {
  const target = event.currentTarget as HTMLElement;
  const experienceIndex = Number(target.dataset.ei);
  const designationIndex = Number(target.dataset.di);

  if (isNaN(experienceIndex) || isNaN(designationIndex)) return;

  const updatedExperiences = [...experiences];
  const experience = updatedExperiences[experienceIndex];
  if (!experience) return;

  const designation = experience.designations[designationIndex];
  if (!designation) return;

  designation.responsibilities.push("New responsibility");
  emit('update:experience', updatedExperiences);
}

function addDesignation(event: Event) {
  const target = event.currentTarget as HTMLElement;
  const experienceIndex = Number(target.dataset.ei);

  if (isNaN(experienceIndex)) return;

  const updatedExperiences = [...experiences];
  const experience = updatedExperiences[experienceIndex];
  if (!experience) return;

  experience.designations.push({
    title: 'New Role',
    current: false,
    promoted: false,
    duration: 'January 2024 - Present',
    responsibilities: ["New responsibility 1", "New responsibility 2"],
  });
  emit('update:experience', updatedExperiences);
}

function promotionToggle(event: Event) {
  if (!isEditing.value) return;

  const target = event.currentTarget as HTMLElement;
  const experienceIndex = Number(target.dataset.ei);
  const designationIndex = Number(target.dataset.di);

  if (isNaN(experienceIndex) || isNaN(designationIndex)) return;

  const updatedExperiences = [...experiences];
  const experience = updatedExperiences[experienceIndex];
  if (!experience) return;

  const designation = experience.designations[designationIndex];
  if (!designation) return;

  designation.promoted = !designation.promoted;
  emit('update:experience', updatedExperiences);
}

</script>
