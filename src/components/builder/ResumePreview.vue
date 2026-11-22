<template>
  <div class="rb-preview">
    <div id="printArea" class="rb-paper">
      <h1>{{ header.name.trim() || 'Your name' }}</h1>
      <div v-if="header.title" class="rb-role">{{ header.title }}</div>
      <div v-if="contactDetails.length" class="rb-contact">{{ contactDetails.join('  ·  ') }}</div>
      <div v-if="header.linkedin.trim()" class="rb-contact rb-contact--social">
        LinkedIn: {{ header.linkedin.trim() }}
      </div>
      <div v-if="header.github.trim()" class="rb-contact rb-contact--social">
        GitHub: {{ header.github.trim() }}
      </div>

      <template v-if="summary.trim()">
        <h2>Summary</h2>
        <p class="rb-resume-copy">{{ summary.trim() }}</p>
      </template>

      <template v-if="visibleSkills.length">
        <h2>Skills</h2>
        <div class="rb-skill-groups" :class="{ 'rb-skill-groups--columns': config.enableGridColumn }">
          <div v-for="(group, index) in visibleSkills" :key="index">
            <h3>{{ group.title }}</h3>
            <p class="rb-resume-copy">{{ group.skills.join('  ·  ') }}</p>
          </div>
        </div>
      </template>

      <template v-if="visibleExperiences.length">
        <h2>Experience</h2>
        <section
          v-for="(experience, index) in visibleExperiences"
          :key="index"
          class="rb-resume-entry"
        >
          <div class="rb-experience-header">
            <div class="rb-experience-company">
              <h3 v-if="experience.company.trim()">{{ experience.company.trim() }}</h3>
              <span v-if="experience.location.trim()" class="rb-experience-location">
                {{ experience.company.trim() ? '·' : '' }}
                {{ experience.location.trim() }}
              </span>
            </div>
            <div v-if="experience.totalDuration.trim()" class="rb-experience-duration">
              {{ experience.totalDuration.trim() }}
            </div>
          </div>
          <template v-for="(designation, roleIndex) in visibleDesignations(experience)" :key="roleIndex">
            <div class="rb-designation-header">
              <h4 v-if="designation.title.trim()">{{ designation.title.trim() }}</h4>
              <div v-if="designation.duration.trim()" class="rb-designation-duration">
                {{ designation.duration.trim() }}
              </div>
            </div>
            <ul v-if="designation.responsibilities.length">
              <li v-for="(responsibility, itemIndex) in designation.responsibilities" :key="itemIndex">
                {{ responsibility }}
              </li>
            </ul>
          </template>
        </section>
      </template>

      <template v-if="visibleProjects.length">
        <h2>Projects</h2>
        <template v-for="(project, index) in visibleProjects" :key="index">
          <h3>{{ project.name }}</h3>
          <p v-if="project.description.trim()">{{ project.description.trim() }}</p>
          <div v-if="project.techStack.length" class="rb-meta">
            <strong>Tech Stack:</strong> {{ project.techStack.join(' · ') }}
          </div>
        </template>
      </template>

      <template v-if="visibleEducations.length">
        <h2>Education</h2>
        <template v-for="(education, index) in visibleEducations" :key="index">
          <h3 v-if="education.title.trim()">{{ education.title.trim() }}</h3>
          <div v-if="education.institution.trim()" class="rb-meta">
            {{ education.institution.trim() }}
          </div>
          <div
            v-if="education.location.trim() || education.year.trim() || education.percentage.trim()"
            class="rb-education-footer"
          >
            <span v-if="education.location.trim()" class="rb-education-location">
              {{ education.location.trim() }}
            </span>
            <span
              v-if="education.year.trim() || education.percentage.trim()"
              class="rb-education-details"
            >
              {{ joinNonEmpty([education.year, education.percentage], ' · ') }}
            </span>
          </div>
        </template>
      </template>
    </div>
    <div class="rb-done-tip">
      <span class="rb-small">Tip: in the print window, choose “Save as PDF” as the destination.</span>
      <button class="rb-link" type="button" @click="emit('restart')">Start over</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  BuilderState,
  EducationEntry,
  ExperienceEntry,
  HeaderDetails,
  ProjectEntry,
  SkillGroup,
} from '@/types/builder'

const props = defineProps<{
  header: HeaderDetails
  experiences: ExperienceEntry[]
  projects: ProjectEntry[]
  educations: EducationEntry[]
  summary: string
  skills: SkillGroup[]
  config: BuilderState['config']
}>()

const emit = defineEmits<{
  restart: []
}>()

const contactDetails = computed(() =>
  [
    props.header.location,
    props.header.email,
    props.header.phone,
  ]
    .map((item) => item.trim())
    .filter(Boolean),
)

const visibleSkills = computed(() =>
  props.skills.filter((group) => group.title.trim() || group.skills.some((skill) => skill.trim())),
)
const visibleExperiences = computed(() =>
  props.experiences.filter(
    (experience) =>
      experience.company.trim() ||
      experience.designations.some(
        (designation) => designation.title.trim() || designation.responsibilities.some(Boolean),
      ),
  ),
)
const visibleProjects = computed(() =>
  props.projects.filter(
    (project) => project.name.trim() || project.description.trim() || project.techStack.length,
  ),
)
const visibleEducations = computed(() =>
  props.educations.filter(
    (education) =>
      education.title.trim() ||
      education.institution.trim() ||
      education.location.trim() ||
      education.year.trim() ||
      education.percentage.trim(),
  ),
)

function visibleDesignations(experience: ExperienceEntry) {
  return experience.designations.filter(
    (designation) =>
      designation.title.trim() || designation.responsibilities.some((item) => item.trim()),
  )
}

function joinNonEmpty(values: string[], separator: string) {
  return values.map((value) => value.trim()).filter(Boolean).join(separator)
}

</script>
