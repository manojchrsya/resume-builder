<template>
  <div class="section">
    <div class="section-title-row">
      <div class="section-title">Key Projects</div>
      <button class="btn tiny secondary" data-action="add-project">+ Add Project</button>
    </div>
    <div id="projectsList">
      <div class="cert-entry" v-for="(data, index) in projects" :key="index">
        <div>
          <div class="cert-name" :data.name>{{ data.name }}</div>
          <div class="cert-issuer" :data.description>
            {{ data.description }}
            <span><br /><strong>Tech Stack:</strong> {{ data.techStack.join(', ') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Project } from '@/types/common'
const emit = defineEmits(['update:projects'])

defineProps({
  projects: {
    type: Array as () => Project[],
    required: true,
  },
})

function addProject() {
  // console.log(this.projects);
  // emit('update:projects', { ...props.projects, name: 'New Project'})
  // alert('Add Project button clicked!');
  // this.projects.push({ name: 'New Project', description: "edit me!" });
}
</script>
