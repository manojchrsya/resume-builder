<template>
  <main>
    <div class="page" id="page">
      <Header :header="header" @update:header="onHeaderUpdated" />
      <div class="body">
        <!-- SUMMARY -->
        <Summary :summary="summary" />
        <Skills :skills="skills" />
        <Experience :experiences="normalizedExperiences" />
        <Project :projects="projects" />
        <Education :educations="educations" />
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue'
import Summary from '../components/Summary.vue'
import Skills from '../components/Skills.vue'
import Experience from '../components/Experience.vue'
import Project from '../components/Project.vue'
import Education from '../components/Education.vue'

import { header, summary, skills, experiences, projects, educations } from '../constant/data.json'

const normalizedExperiences = experiences.map((experience) => ({
  ...experience,
  designations: experience.designations.map((designation) => ({
    duration: '',
    ...designation,
  })),
}))

function onHeaderUpdated(updatedHeader: typeof header) {
  Object.assign(header, updatedHeader);
  console.log('Header Updated', header)
}



</script>
