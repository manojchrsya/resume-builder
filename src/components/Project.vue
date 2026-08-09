<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="section">
    <div class="section-title-row">
      <div class="section-title">Key Projects</div>
      <button v-if="isEditing" class="btn tiny secondary" data-action="add-project" @click="addProject">+ Add Project</button>
    </div>
    <div id="projectsList">
      <div class="cert-entry" v-for="(data, index) in projects" :key="index">
        <button v-if="isEditing" class="remove-btn cert-remove" title="Remove project" @click="removeProject" :data-pi="index">×</button>
        <div>
          <div class="cert-name" :contenteditable="isEditing" @blur="updateProject" data-field="name">{{ data.name }}</div>
          <div class="cert-issuer" :contenteditable="isEditing" @blur="updateProject" data-field="description">
            {{ data.description }}
          </div>
          <div class="cert-issuer" :contenteditable="isEditing" @blur="updateProject" data-field="techStack">
            <strong>Tech Stack:</strong> {{ data.techStack.join(', ') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor';
import type { Project } from '@/types/common'
import { storeToRefs } from 'pinia';

const emit = defineEmits(['add:project', 'update:project']);
const editor = useEditorStore();
const { isEditing } = storeToRefs(editor);

const props = defineProps({
  projects: {
    type: Array as () => Project[],
    required: true,
  },
});
const { projects } = props;

function addProject() {
  emit('add:project', {
    name: 'New Project Title',
    description: "New Project Description",
    techStack: ["Backend", "API", "Development"]
  });
}

function updateProject(e: Event) {
  const target = e.target as HTMLElement;
  const field = target.dataset.field;
  if (!field) return true;

  const index = Array.from(target.parentElement?.parentElement?.parentElement?.children || []).indexOf(target.parentElement?.parentElement as Element);
  if (index === -1) return true;

  const updatedProjects = [...projects];
  const existingProject = updatedProjects[index];
  if (!existingProject) return true;

  const updatedProject: Project = { ...existingProject };
  if (field === 'name') {
    updatedProject.name = target.innerText;
  } else if (field === 'description') {
    updatedProject.description = target.innerText;
  } else if (field === 'techStack') {
    updatedProject.techStack = target.innerText.split(',').map(item => item.trim());
  }

  updatedProjects[index] = updatedProject;

  emit('update:project', updatedProjects);
  return true;
}

function removeProject(e: Event) {
  const target = e.target as HTMLElement;
  const index = Number(target.dataset.pi);
  if (isNaN(index)) return;

  const updatedProjects = [...projects];
  updatedProjects.splice(index, 1);
  emit('update:project', updatedProjects);
}

</script>
