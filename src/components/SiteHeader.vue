<template>
  <header class="landing-nav">
    <RouterLink class="brand" to="/" aria-label="Resumify home" @click="closeMenu">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M5 7h14a2 2 0 0 1 2 2v9H3V9a2 2 0 0 1 2-2Zm7 5v2m-6-2h12"
        />
      </svg>
      <span>Resumify</span>
    </RouterLink>

    <nav class="nav-links" aria-label="Primary navigation">
      <RouterLink to="/#preview">Resume builder</RouterLink>
      <RouterLink to="/#how-it-works">How it works</RouterLink>
      <button class="nav-auth" type="button" :disabled="authBusy" @click="toggleAuth">
        {{ authButtonLabel }}
      </button>
      <span v-if="authError" class="nav-auth-error" role="alert">{{ authError }}</span>
    </nav>

    <RouterLink class="nav-cta" to="/create-resume">Build my resume</RouterLink>
    <button
      class="menu-button"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="mobile-menu"
      :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
      @click="menuOpen = !menuOpen"
    >
      {{ menuOpen ? '×' : '☰' }}
    </button>
    <Transition name="menu">
      <nav v-if="menuOpen" id="mobile-menu" class="mobile-menu" aria-label="Mobile navigation">
        <RouterLink to="/#preview" @click="closeMenu">Resume builder</RouterLink>
        <RouterLink to="/#how-it-works" @click="closeMenu">How it works</RouterLink>
        <button class="mobile-menu-auth" type="button" :disabled="authBusy" @click="toggleAuth">
          {{ authButtonLabel }}
        </button>
        <span v-if="authError" class="nav-auth-error" role="alert">{{ authError }}</span>
        <RouterLink class="mobile-menu-cta" to="/create-resume" @click="closeMenu">
          Build my resume
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { getFirebaseAuth, signInWithGoogle, signOutFromGoogle } from '@/services/firebaseAuth'
import { isFirebaseConfigured } from '@/services/firebaseConfig'

const menuOpen = ref(false)
const authUser = ref<User | null>(null)
const authBusy = ref(false)
const authError = ref('')
const authButtonLabel = computed(() => {
  if (authBusy.value) return 'Please wait…'
  return authUser.value ? 'Sign out' : 'Sign in'
})
let unsubscribeAuth: (() => void) | undefined

onMounted(() => {
  if (!isFirebaseConfigured()) return

  try {
    unsubscribeAuth = onAuthStateChanged(getFirebaseAuth(), (user) => {
      authUser.value = user
      authError.value = ''
    })
  } catch (error) {
    console.error('Unable to initialize Firebase authentication in site menu.', error)
    authError.value = 'Google sign-in is currently unavailable.'
  }
})

onUnmounted(() => unsubscribeAuth?.())

function closeMenu() {
  menuOpen.value = false
}

async function toggleAuth() {
  if (authBusy.value) return

  authBusy.value = true
  authError.value = ''
  try {
    if (authUser.value) await signOutFromGoogle()
    else authUser.value = await signInWithGoogle()
    closeMenu()
  } catch (error) {
    console.error('Unable to complete Google sign-in action.', error)
    authError.value = 'Google sign-in failed. Please try again.'
  } finally {
    authBusy.value = false
  }
}
</script>
