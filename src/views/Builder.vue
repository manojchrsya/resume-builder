<template>
  <div class="resume-app">
    <section class="rb-intro">
      <div class="rb-kicker">YOUR NEXT OPPORTUNITY STARTS HERE</div>
      <h1>Great experience. Beautifully told.</h1>
      <p>A few simple steps to a professional resume that feels like you.</p>
    </section>

    <div ref="layout" class="rb-layout">
      <aside class="rb-sidebar">
        <div class="rb-sidebar-heading">BUILD YOUR RESUME</div>
        <nav class="rb-side-list" aria-label="Resume steps">
          <button
            v-for="(stepInfo, index) in steps"
            :key="stepInfo.label"
            class="rb-step-btn"
            :class="{
              'is-current': step === index + 1,
              'is-todo': step < index + 1,
              'is-done': step > index + 1,
            }"
            type="button"
            :aria-label="stepInfo.label"
            :aria-current="step === index + 1 ? 'step' : undefined"
            :title="stepInfo.label"
            @click="goToStep(index + 1)"
          >
            <span class="rb-step-num">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="rb-step-label">{{ stepInfo.label }}</span>
          </button>
        </nav>
        <div class="rb-aside-tip">
          <strong>A little detail goes a long way.</strong>
          <p>Keep your resume clear, relevant, and focused on what makes you, you.</p>
          <hr />
          <span class="rb-small">No signup. No watermarks.</span>
        </div>
      </aside>

      <main class="rb-main">
        <div class="rb-progress-meta">
          <span>STEP {{ step }} OF {{ steps.length }}</span>
          <span>{{ progress }}% through the steps</span>
        </div>
        <div
          class="rb-progress"
          role="progressbar"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`${progress}% through the steps`"
        >
          <div :style="{ width: `${progress}%` }"></div>
        </div>

        <form class="rb-card" novalidate @submit.prevent="continueStep">
          <div class="rb-card-kicker">{{ currentStep.kicker }}</div>
          <h2 ref="stepHeading" tabindex="-1">{{ currentStep.title }}</h2>
          <p class="rb-card-sub">{{ currentStep.sub }}</p>

          <PersonalDetails
            v-if="step === 1"
            v-model="state.header"
            :show-errors="showErrors"
            :is-email-valid="isEmailValid"
            :email-error="emailError"
          />
          <SkillsSummary
            v-else-if="step === 2"
            v-model:summary="state.summary"
            v-model:skills="state.skills"
            v-model:config="state.config"
          />
          <ExperienceStep
            v-else-if="step === 3"
            v-model="state.experiences"
            @add="addEntry('experience')"
            @remove="removeEntry('experience', $event)"
          />
          <ProjectStep
            v-else-if="step === 4"
            v-model="state.projects"
            @add="addEntry('project')"
            @remove="removeEntry('project', $event)"
          />
          <EducationStep
            v-else-if="step === 5"
            v-model="state.educations"
            @add="addEntry('education')"
            @remove="removeEntry('education', $event)"
          />
          <ResumePreview
            v-else
            :header="state.header"
            :experiences="state.experiences"
            :projects="state.projects"
            :educations="state.educations"
            :summary="state.summary"
            :skills="state.skills"
            :config="state.config"
            @restart="restart"
          />

          <div v-if="storageError" class="rb-storage-error" role="alert">
            {{ storageError }}
          </div>
          <div class="rb-actions">
            <button
              class="rb-btn-ghost"
              type="button"
              :style="{ visibility: step === 1 ? 'hidden' : 'visible' }"
              @click="goToStep(step - 1)"
            >
              Back
            </button>
            <button
              class="rb-btn-primary"
              :type="step === 6 ? 'button' : 'submit'"
              @click="step === 6 && printResume()"
            >
              {{ step === 5 ? 'Generate resume' : step === 6 ? 'Download PDF' : 'Continue' }}
            </button>
          </div>
        </form>

        <div class="rb-foot-note">Your story. Your pace. A fresh start.</div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import EducationStep from '@/components/builder/EducationStep.vue'
import ExperienceStep from '@/components/builder/ExperienceStep.vue'
import PersonalDetails from '@/components/builder/PersonalDetails.vue'
import ProjectStep from '@/components/builder/ProjectStep.vue'
import ResumePreview from '@/components/builder/ResumePreview.vue'
import SkillsSummary from '@/components/builder/SkillsSummary.vue'
import type {
  BuilderState,
  DesignationEntry,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  SkillGroup,
} from '@/types/builder'

defineOptions({ name: 'ResumeBuilder' })

const storageKey = 'resumecraft.v1'
const steps = [
  {
    label: 'Personal details',
    kicker: 'Let’s start with you',
    title: 'Tell us who you are.',
    sub: 'Your name and contact details sit at the top of your resume.',
  },
  {
    label: 'Skills & summary',
    kicker: 'The finishing touches',
    title: 'Show what sets you apart.',
    sub: 'Bring it together with your strengths and a short introduction.',
  },
  {
    label: 'Experience',
    kicker: 'Where you’ve been',
    title: 'Share your experience.',
    sub: 'Add your most recent roles and focus on what you achieved.',
  },
  {
    label: 'Project',
    kicker: 'Work you’re proud of',
    title: 'Showcase your projects.',
    sub: 'Highlight the projects, contributions, and technologies that make your work stand out.',
  },
  {
    label: 'Education',
    kicker: 'Your foundation',
    title: 'Add your education.',
    sub: 'Include your institution, location, year, and results.',
  },
  {
    label: 'Review & download',
    kicker: 'Almost there',
    title: 'Review and download.',
    sub: 'Check how it looks, then save it as a PDF.',
  },
]

function blankDesignation(): DesignationEntry {
  return { title: '', current: false, promoted: false, duration: '', responsibilities: [''] }
}

function blankExperience(): ExperienceEntry {
  return {
    company: '',
    url: '',
    location: '',
    totalDuration: '',
    designations: [blankDesignation()],
  }
}

function blankProject(): ProjectEntry {
  return { name: '', description: '', techStack: [] }
}

function blankEducation(): EducationEntry {
  return { title: '', institution: '', location: '', year: '', percentage: '' }
}

function freshState(): BuilderState {
  return {
    step: 1,
    header: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '' },
    summary: '',
    config: { enableGridColumn: true },
    skills: [{ title: '', skills: [''] }],
    experiences: [blankExperience()],
    projects: [blankProject()],
    educations: [blankEducation()],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function textArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function readDesignation(value: unknown): DesignationEntry {
  const record = isRecord(value) ? value : {}
  return {
    title: text(record.title),
    current: record.current === true,
    promoted: record.promoted === true,
    duration: text(record.duration),
    responsibilities: textArray(record.responsibilities),
  }
}

function readExperience(value: unknown): ExperienceEntry {
  const record = isRecord(value) ? value : {}
  const designations = Array.isArray(record.designations) && record.designations.length
    ? record.designations.map(readDesignation)
    : [
        {
          ...blankDesignation(),
          title: text(record.title),
          duration: [text(record.start), text(record.end)].filter(Boolean).join(' – '),
          responsibilities: textArray(record.responsibilities).length
            ? textArray(record.responsibilities)
            : text(record.desc)
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean),
        },
      ]
  return {
    company: text(record.company),
    url: text(record.url),
    location: text(record.location),
    totalDuration: text(record.totalDuration),
    designations,
  }
}

function readEducation(value: unknown): EducationEntry {
  const record = isRecord(value) ? value : {}
  return {
    title: text(record.title) || text(record.degree),
    institution: text(record.institution) || text(record.school),
    location: text(record.location),
    year:
      text(record.year) ||
      [text(record.start), text(record.end)].filter(Boolean).join(' – '),
    percentage: text(record.percentage),
  }
}

function readSkillGroup(value: unknown): SkillGroup {
  const record = isRecord(value) ? value : {}
  return { title: text(record.title), skills: textArray(record.skills) }
}

function readProject(value: unknown): ProjectEntry {
  const record = isRecord(value) ? value : {}
  return {
    name: text(record.name),
    description: text(record.description),
    techStack: textArray(record.techStack),
  }
}

const storageError = ref('')

function loadState(): BuilderState {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return freshState()

    const parsed: unknown = JSON.parse(saved)
    if (!isRecord(parsed)) throw new Error('Saved resume data is not an object.')

    const header = isRecord(parsed.header)
      ? parsed.header
      : isRecord(parsed.p)
        ? parsed.p
        : {}
    const experience = Array.isArray(parsed.experiences)
      ? parsed.experiences.map(readExperience)
      : Array.isArray(parsed.exp)
        ? parsed.exp.map(readExperience)
        : []
    const education = Array.isArray(parsed.educations) ? parsed.educations.map(readEducation) : []
    const skillGroups = Array.isArray(parsed.skills)
      ? parsed.skills.map(readSkillGroup)
      : text(parsed.skills).trim()
        ? [{ title: 'Skills', skills: text(parsed.skills).split(',').map((skill) => skill.trim()).filter(Boolean) }]
        : []
    const config = isRecord(parsed.config) ? parsed.config : {}
    const step = typeof parsed.step === 'number' && Number.isInteger(parsed.step)
      ? Math.min(6, Math.max(1, parsed.step))
      : 1

    return {
      step,
      header: {
        name: text(header.name),
        title: text(header.title),
        email: text(header.email),
        phone: text(header.phone),
        location: text(header.location),
        linkedin: text(header.linkedin) || text(header.website),
        github: text(header.github),
      },
      summary: text(parsed.summary),
      config: { enableGridColumn: config.enableGridColumn !== false },
      skills: skillGroups.length ? skillGroups : [{ title: '', skills: [''] }],
      experiences: experience.length ? experience : [blankExperience()],
      projects: Array.isArray(parsed.projects) && parsed.projects.length
        ? parsed.projects.map(readProject)
        : [blankProject()],
      educations: education.length ? education : [blankEducation()],
    }
  } catch (error) {
    console.error('Unable to load saved resume data.', error)
    storageError.value = 'Saved resume data could not be loaded. Your new changes will still be saved.'
    return freshState()
  }
}

const state = reactive(loadState())
const step = computed(() => state.step)
const currentStep = computed(() => steps[state.step - 1]!)
const progress = computed(() => Math.round(((state.step - 1) / (steps.length - 1)) * 100))
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.header.email.trim()))
const emailError = computed(() => {
  if (!state.header.email.trim()) return 'Please enter your email.'
  return isEmailValid.value ? '' : 'That email doesn’t look right.'
})
const showErrors = ref(false)
const stepHeading = ref<HTMLHeadingElement | null>(null)

watch(
  state,
  () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
      storageError.value = ''
    } catch (error) {
      console.error('Unable to save resume data.', error)
      storageError.value = 'Your changes could not be saved in this browser.'
    }
  },
  { deep: true },
)

async function goToStep(target: number) {
  const nextStep = Math.min(steps.length, Math.max(1, target))
  if (nextStep > 1 && (!state.header.name.trim() || !isEmailValid.value)) {
    state.step = 1
    showErrors.value = true
    await focusFirstInvalidField()
    return
  }

  state.step = nextStep
  showErrors.value = false
  await nextTick()
  stepHeading.value?.focus()
  document.querySelector('.rb-layout')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

async function focusFirstInvalidField() {
  await nextTick()
  document.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()
}

function continueStep() {
  if (state.step === 1 && (!state.header.name.trim() || !isEmailValid.value)) {
    showErrors.value = true
    void focusFirstInvalidField()
    return
  }
  if (state.step < steps.length) void goToStep(state.step + 1)
}

type EntryKind = 'experience' | 'project' | 'education'

function addEntry(kind: EntryKind) {
  if (kind === 'experience') state.experiences.push(blankExperience())
  else if (kind === 'project') state.projects.push(blankProject())
  else state.educations.push(blankEducation())
  void nextTick(() => {
    const groups = document.querySelectorAll<HTMLElement>('.rb-repeat')
    groups.item(groups.length - 1)?.querySelector('input')?.focus()
  })
}

function removeEntry(kind: EntryKind, index: number) {
  if (kind === 'experience') {
    state.experiences.splice(index, 1)
    if (!state.experiences.length) state.experiences.push(blankExperience())
  } else if (kind === 'project') {
    state.projects.splice(index, 1)
    if (!state.projects.length) state.projects.push(blankProject())
  } else {
    state.educations.splice(index, 1)
    if (!state.educations.length) state.educations.push(blankEducation())
  }
}

function restart() {
  if (!window.confirm('Start over? This clears everything you’ve entered.')) return
  Object.assign(state, freshState())
  showErrors.value = false
}

function printResume() {
  const previousTitle = document.title
  document.title = `${state.header.name.trim() || 'Resume'} – Resume`
  const restoreTitle = () => {
    document.title = previousTitle
    window.removeEventListener('afterprint', restoreTitle)
    window.clearTimeout(restoreTimer)
  }
  const restoreTimer = window.setTimeout(restoreTitle, 1000)
  window.addEventListener('afterprint', restoreTitle, { once: true })
  window.print()
}
</script>

<style src="../assets/builder.css"></style>
