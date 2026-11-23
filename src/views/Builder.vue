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
          <div class="rb-progress-actions">
            <span>{{ progress }}% through the steps</span>
            <button
              class="rb-save-button"
              type="button"
              :disabled="saveBusy"
              :aria-label="saveButtonLabel"
              :title="saveButtonLabel"
              @click="saveResume"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 3h12l4 4v14H3V3h2Zm2 0v6h10V3M7 21v-7h10v7"
                />
              </svg>
              <span>{{ saveBusy ? 'Saving…' : 'Save' }}</span>
            </button>
          </div>
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

          <section v-if="syncConflict" class="rb-sync-conflict" aria-labelledby="sync-conflict-title">
            <h3 id="sync-conflict-title">Choose which resume to keep</h3>
            <p>
              Resume data exists on this device and in your Google account. Pull the cloud copy
              into this browser, or sync this device’s copy to your account?
            </p>
            <div class="rb-sync-conflict-actions">
              <button
                class="rb-btn-ghost"
                type="button"
                :disabled="conflictActionBusy"
                @click="resolveResumeConflict('cloud')"
              >
                Use Google account copy
              </button>
              <button
                class="rb-btn-primary"
                type="button"
                :disabled="conflictActionBusy"
                @click="resolveResumeConflict('local')"
              >
                Sync this device’s copy
              </button>
            </div>
          </section>

          <div v-if="saveStatus" class="rb-sync-note" role="status">
            {{ saveStatus }}
          </div>
          <div v-if="storageError" class="rb-storage-error" role="alert">
            {{ storageError }}
          </div>
          <div v-if="saveError" class="rb-storage-error" role="alert">
            {{ saveError }}
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
              :disabled="step === 6 && resumeLoadBusy"
              :type="step === 6 ? 'button' : 'submit'"
              @click="step === 6 && printResume()"
            >
              {{
                step === 6 && resumeLoadBusy
                  ? 'Loading saved resume…'
                  : step === 5
                    ? 'Generate resume'
                    : step === 6
                      ? 'Download PDF'
                      : 'Continue'
              }}
            </button>
          </div>
        </form>

        <div class="rb-foot-note">Your story. Your pace. A fresh start.</div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { onAuthStateChanged, type User } from 'firebase/auth'
import EducationStep from '@/components/builder/EducationStep.vue'
import ExperienceStep from '@/components/builder/ExperienceStep.vue'
import PersonalDetails from '@/components/builder/PersonalDetails.vue'
import ProjectStep from '@/components/builder/ProjectStep.vue'
import ResumePreview from '@/components/builder/ResumePreview.vue'
import SkillsSummary from '@/components/builder/SkillsSummary.vue'
import { getFirebaseAuth } from '@/services/firebaseAuth'
import { isFirebaseConfigured } from '@/services/firebaseConfig'
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

function parseResumeState(value: unknown): BuilderState {
  if (!isRecord(value)) throw new Error('Saved resume data is not an object.')

  const header = isRecord(value.header)
    ? value.header
    : isRecord(value.p)
      ? value.p
      : {}
  const experience = Array.isArray(value.experiences)
    ? value.experiences.map(readExperience)
    : Array.isArray(value.exp)
      ? value.exp.map(readExperience)
      : []
  const education = Array.isArray(value.educations) ? value.educations.map(readEducation) : []
  const skillGroups = Array.isArray(value.skills)
    ? value.skills.map(readSkillGroup)
    : text(value.skills).trim()
      ? [{ title: 'Skills', skills: text(value.skills).split(',').map((skill) => skill.trim()).filter(Boolean) }]
      : []
  const config = isRecord(value.config) ? value.config : {}
  const step = typeof value.step === 'number' && Number.isInteger(value.step)
    ? Math.min(6, Math.max(1, value.step))
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
    summary: text(value.summary),
    config: { enableGridColumn: config.enableGridColumn !== false },
    skills: skillGroups.length ? skillGroups : [{ title: '', skills: [''] }],
    experiences: experience.length ? experience : [blankExperience()],
    projects: Array.isArray(value.projects) && value.projects.length
      ? value.projects.map(readProject)
      : [blankProject()],
    educations: education.length ? education : [blankEducation()],
  }
}

function hasResumeContent(value: BuilderState) {
  return (
    Object.values(value.header).some((item) => item.trim()) ||
    value.summary.trim().length > 0 ||
    value.skills.some(
      (group) => group.title.trim() || group.skills.some((skill) => skill.trim()),
    ) ||
    value.experiences.some(
      (experience) =>
        experience.company.trim() ||
        experience.url.trim() ||
        experience.location.trim() ||
        experience.totalDuration.trim() ||
        experience.designations.some(
          (designation) =>
            designation.title.trim() ||
            designation.duration.trim() ||
            designation.responsibilities.some((item) => item.trim()),
        ),
    ) ||
    value.projects.some(
      (project) =>
        project.name.trim() ||
        project.description.trim() ||
        project.techStack.some((item) => item.trim()),
    ) ||
    value.educations.some(
      (education) =>
        education.title.trim() ||
        education.institution.trim() ||
        education.location.trim() ||
        education.year.trim() ||
        education.percentage.trim(),
    )
  )
}

function loadState(): BuilderState {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return freshState()

    return parseResumeState(JSON.parse(saved))
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
const signedInUser = ref<User | null>(null)
const saveBusy = ref(false)
const saveStatus = ref('')
const saveError = ref('')
const resumeLoadBusy = ref(false)
const syncConflict = ref(false)
const conflictActionBusy = ref(false)
const pendingCloudResume = ref<BuilderState | null>(null)
const saveButtonLabel = computed(() =>
  signedInUser.value ? 'Save locally and sync to your Google account' : 'Save resume in this browser',
)

let unsubscribeAuth: (() => void) | undefined
let resumeLoadRequest = 0

onMounted(() => {
  if (!isFirebaseConfigured()) return

  try {
    resumeLoadBusy.value = true
    unsubscribeAuth = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      const requestId = ++resumeLoadRequest
      signedInUser.value = user
      pendingCloudResume.value = null
      syncConflict.value = false
      saveStatus.value = ''
      saveError.value = ''
      if (!user) {
        resumeLoadBusy.value = false
        return
      }

      try {
        const { loadResumeForUser, saveResumeForUser } = await import('@/services/firebase')
        const savedResume = await loadResumeForUser(user)
        if (
          requestId !== resumeLoadRequest ||
          getFirebaseAuth().currentUser?.uid !== user.uid
        ) {
          return
        }

        const cloudState = savedResume === null ? null : parseResumeState(savedResume)
        const localExists = hasResumeContent(state)
        const cloudExists = cloudState !== null && hasResumeContent(cloudState)

        if (localExists && cloudExists) {
          pendingCloudResume.value = { ...cloudState, step: steps.length }
          syncConflict.value = true
          saveStatus.value = 'Choose which resume copy you want to keep.'
          return
        }

        if (!cloudExists) {
          if (localExists) {
            await saveResumeForUser(user, state)
            if (getFirebaseAuth().currentUser?.uid !== user.uid) return
            saveStatus.value =
              'No cloud resume existed, so your current draft was synced to your Google account.'
          } else {
            saveStatus.value = 'Signed in. No cloud resume was found; your current draft is ready.'
          }
          return
        }

        await useCloudResume({ ...cloudState, step: steps.length })
      } catch (error) {
        if (requestId !== resumeLoadRequest) return
        console.error('Unable to load resume from Firestore.', error)
        saveError.value = getSaveErrorMessage(error)
      } finally {
        if (requestId === resumeLoadRequest) resumeLoadBusy.value = false
      }
    })
  } catch (error) {
    console.error('Unable to initialize Firebase authentication.', error)
    resumeLoadBusy.value = false
  }
})

onUnmounted(() => {
  unsubscribeAuth?.()
})

watch(
  state,
  () => {
    saveStatus.value = ''
    saveError.value = ''
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

async function useCloudResume(cloudResume: BuilderState) {
  const restoredState = { ...cloudResume, step: steps.length }
  Object.assign(state, restoredState)
  showErrors.value = false
  syncConflict.value = false
  pendingCloudResume.value = null

  try {
    localStorage.setItem(storageKey, JSON.stringify(restoredState))
    storageError.value = ''
  } catch (error) {
    console.error('Unable to replace the local resume with cloud data.', error)
    storageError.value =
      'Your cloud resume was loaded, but could not replace the saved copy in this browser.'
  }

  await nextTick()
  saveStatus.value = 'Your resume was loaded from your Google account. You can review or download it now.'
}

async function resolveResumeConflict(source: 'cloud' | 'local') {
  if (conflictActionBusy.value || !signedInUser.value) return

  conflictActionBusy.value = true
  saveError.value = ''
  const user = signedInUser.value

  try {
    if (source === 'cloud') {
      if (!pendingCloudResume.value) {
        throw new Error('The pending cloud resume is unavailable.')
      }
      await useCloudResume(pendingCloudResume.value)
      return
    }

    await saveResumeForSignedInUser(user)
    syncConflict.value = false
    pendingCloudResume.value = null
    saveStatus.value = 'This device’s resume was synced to your Google account.'
  } catch (error) {
    console.error('Unable to resolve local and cloud resume conflict.', error)
    saveError.value = getSaveErrorMessage(error)
  } finally {
    conflictActionBusy.value = false
  }
}

async function saveResumeForSignedInUser(user: User) {
  const { saveResumeForUser } = await import('@/services/firebase')
  await saveResumeForUser(user, state)
}

async function saveResume() {
  if (saveBusy.value) return

  saveBusy.value = true
  saveError.value = ''
  saveStatus.value = ''

  try {
    localStorage.setItem(storageKey, JSON.stringify(state))
    storageError.value = ''
  } catch (error) {
    console.error('Unable to save resume data locally.', error)
    storageError.value = 'Your changes could not be saved in this browser.'
    saveBusy.value = false
    return
  }

  const user = signedInUser.value
  if (!user) {
    saveStatus.value = 'Saved on this device. Sign in with Google from the menu to sync it to Firestore.'
    saveBusy.value = false
    return
  }

  try {
    await saveResumeForSignedInUser(user)
    saveStatus.value = 'Saved on this device and synced to your Google account.'
  } catch (error) {
    console.error('Unable to sync resume to Firestore.', error)
    saveError.value = getSaveErrorMessage(error)
    saveStatus.value = 'Saved on this device, but cloud sync failed.'
  } finally {
    saveBusy.value = false
  }
}

function getSaveErrorMessage(error: unknown) {
  const code =
    typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined

  if (code === 'permission-denied') {
    return 'Firebase denied access to your resume. Please check the Firestore security rules.'
  }
  if (code === 'unavailable') {
    return 'Firebase is temporarily unavailable. Please try syncing again.'
  }
  return 'Your resume could not be synced to Firebase. It is still saved in this browser; please retry.'
}

</script>

<style src="../assets/builder.css"></style>
