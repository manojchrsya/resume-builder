// stores/profile.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as data from '../constant/data.json';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(getProfile());

  function getProfile() {
    const stored = localStorage.getItem('profile');
    return stored ? JSON.parse(stored) : data;
  }

  function saveToStorage() {
    localStorage.setItem('profile', JSON.stringify(profile.value));
  }

  function resetProfile() {
    localStorage.removeItem('profile');
    profile.value = data;
  }

  return {
    profile,
    saveToStorage,
    resetProfile
  };
});
