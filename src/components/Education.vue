<template>
  <div class="section">
    <div class="section-title-row">
      <div class="section-title">Education</div>
      <button class="btn tiny secondary" data-action="add-education">+ Add Education</button>
    </div>
    <div id="educationList">
      <div class="edu-entry" v-for="(data, index) in educations" :key="index">
        <div class="edu-degree" :data.title>{{ data.title }}</div>
        <div class="edu-school" :data.institution>{{ data.institution }}</div>
        <div class="edu-meta">
          <span :data.location>{{ data.location }}</span>
          <span>{{ data.year }} &nbsp;·&nbsp; Scored {{ data.percentage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Education } from '@/types/common';
  const emit = defineEmits(['update:educations']);

  defineProps({
    educations: {
      type: Array as () => Education[],
      required: true
    },
  });

  function addEducation() {
    // console.log(this.educatations);
    // emit('update:educatations', { ...props.educatations, name: 'New Education'})
    // alert('Add Education button clicked!');
    // this.educatations.push({ name: 'New Education', description: "edit me!" });
  }
</script>