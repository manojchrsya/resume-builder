// stores/editor.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useProfileStore } from './profile';



export const useEditorStore = defineStore('editor', () => {
  // The global flag
  const isEditing = ref(false);

  const enableEdit = () => {
    isEditing.value = true;
  };

  const disableEdit = () => {
    isEditing.value = false;
    const profileStore = useProfileStore();
    profileStore.saveToStorage();
  };

  const toggleEdit = () => {
    isEditing.value = !isEditing.value;
  };

  const resetEdit = () => {
    isEditing.value = false;
    const profileStore = useProfileStore();
    profileStore.resetProfile();
    location.reload();
  };

  return {
    isEditing,
    enableEdit,
    disableEdit,
    toggleEdit,
    resetEdit
  };
});
