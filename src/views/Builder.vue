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

          <div v-if="step === 1" class="rb-fields">
            <label class="rb-field">
              <span>Full name</span>
              <input
                id="f-p-name"
                v-model="state.p.name"
                autocomplete="name"
                placeholder="e.g. Alex Morgan"
                :aria-invalid="showErrors && !state.p.name.trim()"
                aria-describedby="err-f-p-name"
                @keydown.enter.prevent="continueStep"
              />
              <span id="err-f-p-name" class="rb-err" role="alert">
                {{ showErrors && !state.p.name.trim() ? 'Please enter your name.' : '' }}
              </span>
            </label>
            <label class="rb-field">
              <span>Job title</span>
              <input v-model="state.p.title" placeholder="e.g. Product Designer" />
            </label>
            <label class="rb-field">
              <span>Email</span>
              <input
                id="f-p-email"
                v-model="state.p.email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                :aria-invalid="showErrors && !isEmailValid"
                aria-describedby="err-f-p-email"
                @keydown.enter.prevent="continueStep"
              />
              <span id="err-f-p-email" class="rb-err" role="alert">
                {{ showErrors ? emailError : '' }}
              </span>
            </label>
            <label class="rb-field">
              <span>Phone</span>
              <input
                v-model="state.p.phone"
                type="tel"
                autocomplete="tel"
                placeholder="+1 555 000 0000"
              />
            </label>
            <label class="rb-field">
              <span>Location</span>
              <input
                v-model="state.p.location"
                autocomplete="address-level2"
                placeholder="City, Country"
              />
            </label>
            <label class="rb-field">
              <span>Website or LinkedIn</span>
              <input v-model="state.p.website" placeholder="linkedin.com/in/yourname" />
            </label>
          </div>

          <div v-else-if="step === 2" class="rb-fields">
            <section
              v-for="(experience, index) in state.exp"
              :key="index"
              class="rb-repeat full"
            >
              <div class="rb-repeat-head">
                <b>Role {{ index + 1 }}</b>
                <button
                  v-if="state.exp.length > 1"
                  class="rb-link"
                  type="button"
                  @click="removeEntry('exp', index)"
                >
                  Remove
                </button>
              </div>
              <div class="rb-fields">
                <label class="rb-field">
                  <span>Job title</span>
                  <input v-model="experience.title" placeholder="e.g. Senior Designer" />
                </label>
                <label class="rb-field">
                  <span>Company</span>
                  <input v-model="experience.company" placeholder="e.g. Studio Labs" />
                </label>
                <label class="rb-field">
                  <span>Location</span>
                  <input v-model="experience.location" placeholder="City, Country" />
                </label>
                <label class="rb-field">
                  <span>Start date</span>
                  <input v-model="experience.start" placeholder="e.g. Jan 2022" />
                </label>
                <label class="rb-field">
                  <span>End date</span>
                  <input v-model="experience.end" placeholder="e.g. Dec 2024, or Present" />
                </label>
                <label class="rb-field full">
                  <span>What did you achieve?</span>
                  <textarea
                    v-model="experience.desc"
                    rows="4"
                    placeholder="Led a team of 4 designers. Improved onboarding completion by 32%."
                  ></textarea>
                </label>
              </div>
            </section>
            <div class="rb-field full">
              <button class="rb-add" type="button" @click="addEntry('exp')">
                + Add another role
              </button>
            </div>
          </div>

          <div v-else-if="step === 3" class="rb-fields">
            <section v-for="(education, index) in state.edu" :key="index" class="rb-repeat full">
              <div class="rb-repeat-head">
                <b>Education {{ index + 1 }}</b>
                <button
                  v-if="state.edu.length > 1"
                  class="rb-link"
                  type="button"
                  @click="removeEntry('edu', index)"
                >
                  Remove
                </button>
              </div>
              <div class="rb-fields">
                <label class="rb-field">
                  <span>Degree or course</span>
                  <input v-model="education.degree" placeholder="e.g. BFA, Interaction Design" />
                </label>
                <label class="rb-field">
                  <span>School</span>
                  <input
                    v-model="education.school"
                    placeholder="e.g. California College of the Arts"
                  />
                </label>
                <label class="rb-field">
                  <span>Start year</span>
                  <input v-model="education.start" placeholder="e.g. 2016" />
                </label>
                <label class="rb-field">
                  <span>End year</span>
                  <input v-model="education.end" placeholder="e.g. 2020, or Present" />
                </label>
              </div>
            </section>
            <div class="rb-field full">
              <button class="rb-add" type="button" @click="addEntry('edu')">+ Add another</button>
            </div>
          </div>

          <div v-else-if="step === 4" class="rb-fields">
            <label class="rb-field full">
              <span>Professional summary</span>
              <textarea
                v-model="state.summary"
                rows="4"
                placeholder="Write 2–3 sentences about your experience, strengths, and what you’re looking for."
              ></textarea>
            </label>
            <label class="rb-field full">
              <span>Skills</span>
              <textarea
                v-model="state.skills"
                rows="4"
                placeholder="e.g. Project management, Figma, Python, Communication"
              ></textarea>
            </label>
            <span class="rb-small full">Separate your skills with commas.</span>
          </div>

          <div v-else class="rb-preview">
            <div id="printArea" class="rb-paper">
              <h1>{{ state.p.name.trim() || 'Your name' }}</h1>
              <div v-if="state.p.title" class="rb-role">{{ state.p.title }}</div>
              <div v-if="contactDetails.length" class="rb-contact">
                {{ contactDetails.join('  ·  ') }}
              </div>

              <template v-if="state.summary.trim()">
                <h2>Profile</h2>
                <p class="rb-resume-copy">{{ state.summary.trim() }}</p>
              </template>

              <template v-if="completedExperience.length">
                <h2>Experience</h2>
                <template v-for="(experience, index) in completedExperience" :key="index">
                  <h3>{{ experience.title || experience.company }}</h3>
                  <div v-if="experienceMeta(experience)" class="rb-meta">
                    {{ experienceMeta(experience) }}
                  </div>
                  <p v-if="experience.desc.trim()">{{ experience.desc.trim() }}</p>
                </template>
              </template>

              <template v-if="completedEducation.length">
                <h2>Education</h2>
                <template v-for="(education, index) in completedEducation" :key="index">
                  <h3>{{ education.degree || education.school }}</h3>
                  <div v-if="educationMeta(education)" class="rb-meta">
                    {{ educationMeta(education) }}
                  </div>
                </template>
              </template>

              <template v-if="skillList.length">
                <h2>Skills</h2>
                <p class="rb-resume-copy">{{ skillList.join('  ·  ') }}</p>
              </template>
            </div>
            <div class="rb-done-tip">
              <span class="rb-small">Tip: in the print window, choose “Save as PDF” as the destination.</span>
              <button class="rb-link" type="button" @click="restart">Start over</button>
            </div>
          </div>

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
            <button class="rb-btn-primary" :type="step === 5 ? 'button' : 'submit'" @click="step === 5 && printResume()">
              {{ step === 4 ? 'Generate resume' : step === 5 ? 'Download PDF' : 'Continue' }}
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

defineOptions({ name: 'ResumeBuilder' })

interface PersonalDetails {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
}

interface Experience {
  title: string
  company: string
  location: string
  start: string
  end: string
  desc: string
}

interface Education {
  degree: string
  school: string
  start: string
  end: string
}

interface BuilderState {
  step: number
  p: PersonalDetails
  exp: Experience[]
  edu: Education[]
  summary: string
  skills: string
}

const storageKey = 'resumecraft.v1'
const steps = [
  {
    label: 'Personal details',
    kicker: 'Let’s start with you',
    title: 'Tell us who you are.',
    sub: 'Your name and contact details sit at the top of your resume.',
  },
  {
    label: 'Experience',
    kicker: 'Where you’ve been',
    title: 'Share your experience.',
    sub: 'Add your most recent role first and focus on what you achieved.',
  },
  {
    label: 'Education',
    kicker: 'Your foundation',
    title: 'Add your education.',
    sub: 'Degrees, courses and certifications that back up your story.',
  },
  {
    label: 'Skills & summary',
    kicker: 'The finishing touches',
    title: 'Show what sets you apart.',
    sub: 'Bring it together with your strengths and a short introduction.',
  },
  {
    label: 'Review & download',
    kicker: 'Almost there',
    title: 'Review and download.',
    sub: 'Check how it looks, then save it as a PDF.',
  },
]

function blankExperience(): Experience {
  return { title: '', company: '', location: '', start: '', end: '', desc: '' }
}

function blankEducation(): Education {
  return { degree: '', school: '', start: '', end: '' }
}

function freshState(): BuilderState {
  return {
    step: 1,
    p: { name: '', title: '', email: '', phone: '', location: '', website: '' },
    exp: [blankExperience()],
    edu: [blankEducation()],
    summary: '',
    skills: '',
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function readExperience(value: unknown): Experience {
  const record = isRecord(value) ? value : {}
  return {
    title: text(record.title),
    company: text(record.company),
    location: text(record.location),
    start: text(record.start),
    end: text(record.end),
    desc: text(record.desc),
  }
}

function readEducation(value: unknown): Education {
  const record = isRecord(value) ? value : {}
  return {
    degree: text(record.degree),
    school: text(record.school),
    start: text(record.start),
    end: text(record.end),
  }
}

const storageError = ref('')

function loadState(): BuilderState {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return freshState()

    const parsed: unknown = JSON.parse(saved)
    if (!isRecord(parsed)) throw new Error('Saved resume data is not an object.')

    const personal = isRecord(parsed.p) ? parsed.p : {}
    const experience = Array.isArray(parsed.exp) ? parsed.exp.map(readExperience) : []
    const education = Array.isArray(parsed.edu) ? parsed.edu.map(readEducation) : []
    const step = typeof parsed.step === 'number' && Number.isInteger(parsed.step)
      ? Math.min(5, Math.max(1, parsed.step))
      : 1

    return {
      step,
      p: {
        name: text(personal.name),
        title: text(personal.title),
        email: text(personal.email),
        phone: text(personal.phone),
        location: text(personal.location),
        website: text(personal.website),
      },
      exp: experience.length ? experience : [blankExperience()],
      edu: education.length ? education : [blankEducation()],
      summary: text(parsed.summary),
      skills: text(parsed.skills),
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
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.p.email.trim()))
const emailError = computed(() => {
  if (!state.p.email.trim()) return 'Please enter your email.'
  return isEmailValid.value ? '' : 'That email doesn’t look right.'
})
const showErrors = ref(false)
const stepHeading = ref<HTMLHeadingElement | null>(null)

const contactDetails = computed(() =>
  [state.p.location, state.p.email, state.p.phone, state.p.website]
    .map((item) => item.trim())
    .filter(Boolean),
)
const completedExperience = computed(() =>
  state.exp.filter((entry) => entry.title.trim() || entry.company.trim() || entry.desc.trim()),
)
const completedEducation = computed(() =>
  state.edu.filter((entry) => entry.degree.trim() || entry.school.trim()),
)
const skillList = computed(() =>
  state.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
)

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
  if (nextStep > 1 && (!state.p.name.trim() || !isEmailValid.value)) {
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
  if (state.step === 1 && (!state.p.name.trim() || !isEmailValid.value)) {
    showErrors.value = true
    void focusFirstInvalidField()
    return
  }
  if (state.step < steps.length) void goToStep(state.step + 1)
}

function addEntry(kind: 'exp' | 'edu') {
  if (kind === 'exp') state.exp.push(blankExperience())
  else state.edu.push(blankEducation())
  void nextTick(() => {
    const groups = document.querySelectorAll<HTMLElement>('.rb-repeat')
    groups.item(groups.length - 1)?.querySelector('input')?.focus()
  })
}

function removeEntry(kind: 'exp' | 'edu', index: number) {
  if (kind === 'exp') {
    state.exp.splice(index, 1)
    if (!state.exp.length) state.exp.push(blankExperience())
  } else {
    state.edu.splice(index, 1)
    if (!state.edu.length) state.edu.push(blankEducation())
  }
}

function joinNonEmpty(values: string[], separator: string) {
  return values.map((value) => value.trim()).filter(Boolean).join(separator)
}

function experienceMeta(entry: Experience) {
  const organization = joinNonEmpty([entry.company, entry.location], ' · ')
  const dates = joinNonEmpty([entry.start, entry.end], ' – ')
  return joinNonEmpty([organization, dates], '   |   ')
}

function educationMeta(entry: Education) {
  const years = joinNonEmpty([entry.start, entry.end], ' – ')
  return joinNonEmpty([entry.school, years], '   |   ')
}

function restart() {
  if (!window.confirm('Start over? This clears everything you’ve entered.')) return
  Object.assign(state, freshState())
  showErrors.value = false
}

function printResume() {
  const previousTitle = document.title
  document.title = `${state.p.name.trim() || 'Resume'} – Resume`
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
