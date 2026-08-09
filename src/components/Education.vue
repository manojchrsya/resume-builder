<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="section">
    <div class="section-title-row">
      <div class="section-title">Education</div>
      <button v-if="isEditing" class="btn tiny secondary" data-action="add-education" @click="addEducation">+ Add Education</button>
    </div>
    <div id="educationList">
      <div class="edu-entry" v-for="(data, index) in educations" :key="index" :data-pi="index">
        <button v-if="isEditing" class="remove-btn cert-remove" title="Remove education" @click="removeEducation" :data-pi="index">×</button>
        <div class="edu-degree" :contenteditable="isEditing" @blur="updateEducation" data-field="title">{{ data.title }}</div>
        <div class="edu-school" :contenteditable="isEditing" @blur="updateEducation" data-field="institution">{{ data.institution }}</div>
        <div class="edu-meta">
          <span :contenteditable="isEditing" @blur="updateEducation" data-field="location">{{ data.location }}</span>
          <span>
            <span :contenteditable="isEditing" @blur="updateEducation" data-field="year">{{ data.year }}</span> &nbsp;|&nbsp;
            <span :contenteditable="isEditing" @blur="updateEducation" data-field="percentage">{{ data.percentage }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor';
import type { Education } from '@/types/common'
import { storeToRefs } from 'pinia';
const emit = defineEmits(['add:education', 'update:education']);
const editor = useEditorStore();
const { isEditing } = storeToRefs(editor);

function removeEducation(event: Event) {
  const index = Number((event.currentTarget as HTMLElement).dataset.pi);
  const updatedEducations = [...educations];
  updatedEducations.splice(index, 1);
  emit('update:education', updatedEducations);
}

function updateEducation(event: Event) {
  const target = event.currentTarget as HTMLElement;
  const field = target.dataset.field as keyof Education;
  const entry = target.closest('.edu-entry');
  const index = entry instanceof HTMLElement ? Number(entry.dataset.pi) : -1;
  if (index !== undefined && field) {
    const updatedEducation = { ...educations[index], [field]: target.innerText };
    emit('update:education', educations.map((edu, i) => i === index ? updatedEducation : edu));
  }
}

const props = defineProps({
  educations: {
    type: Array as () => Education[],
    required: true,
  },
})

const { educations } = props;

function addEducation() {
  emit('add:education', {
    title: 'New Education Title',
    institution: 'New Institution',
    location: 'New Location',
    year: 'New Year',
    percentage: 'New Percentage'
  });
}

</script>
