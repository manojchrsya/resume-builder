<template>
  <main>
    <div class="page" id="page">
      <Header :header="profile.header" @update:header="onHeaderUpdated" />
      <div class="body">
        <!-- SUMMARY -->
        <Summary :summary="profile.summary" @update:summary="onSummaryUpdated" />
        <Skills :skills="skills"  @add:skill-group="onSkillGroupAdded"  @update:skill-group="onSkillGroupUpdated" />
        <Experience :experiences="profile.experiences" />
        <Project :projects="projects"  @add:project="onProjectAdded" @update:project="onProjectUpdated" />
        <Education :educations="educations"  @add:education="onEducationAdded" @update:education="onEducationUpdated" />
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

// import { header, summary, skills, experiences, projects, educations } from '../constant/data.json'
import { useProfileStore } from '@/stores/profile';
// import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
const store = useProfileStore();
const { profile } = storeToRefs(store);

const projects = reactive([...profile.value.projects]);
const educations = reactive([...profile.value.educations]);
const skills = reactive([...profile.value.skills]);

function onHeaderUpdated(updatedHeader: typeof profile.value.header) {
  Object.assign(profile.value.header, updatedHeader);
}

function onSummaryUpdated(updatedSummary: typeof profile.value.summary) {
  profile.value.summary = updatedSummary;
}

function onProjectUpdated(updatedProject: typeof profile.value.projects) {
  projects.splice(0, projects.length, ...updatedProject);
  profile.value.projects = projects;
}

function onProjectAdded(newProject: (typeof profile.value.projects)[number]) {
  projects.push(newProject);
  profile.value.projects = projects;
}

function onEducationAdded(newEducation: (typeof profile.value.educations)[number]) {
  educations.push(newEducation);
  profile.value.educations = educations;
}

function onEducationUpdated(updatedEducation: typeof profile.value.educations) {
  educations.splice(0, educations.length, ...updatedEducation);
  profile.value.educations = educations;
}

function onSkillGroupUpdated(updatedSkills: typeof profile.value.skills) {
  skills.splice(0, skills.length, ...updatedSkills);
  profile.value.skills = skills;
}

function onSkillGroupAdded(newSkill: (typeof profile.value.skills)[number]) {
  skills.push(newSkill);
  profile.value.skills = skills;
}

</script>
