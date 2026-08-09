<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header class="header" :header="header">
    <div class="header-name"  :contenteditable="isEditing" data-field="name" @blur="handleEditorInput">{{ header.name }}</div>
    <div class="header-title" :contenteditable="isEditing" data-field="title" @blur="handleEditorInput">{{ header.title }}</div>
    <div class="header-contact">
      <span>
        <svg viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        <span  :contenteditable="isEditing" data-field="email" @blur="handleEditorInput">{{ header.email }}</span>

        <svg viewBox="0 0 20 20">
          <path
            d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
          />
        </svg>
        <span  :contenteditable="isEditing" data-field="phone" @blur="handleEditorInput">{{ header.phone }}</span>
      </span>
      <span>
        <svg viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
          />
        </svg>
        <span  :contenteditable="isEditing" data-field="location" @blur="handleEditorInput">{{ header.location }}</span>
      </span>
      <span>
        <svg viewBox="0 0 24 24">
          <path
            d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.7A1.8 1.8 0 114.7 5a1.8 1.8 0 011.8 1.7zM20 19h-3v-5.6c0-1.3-.5-2.2-1.6-2.2a1.7 1.7 0 00-1.6 1.2 2.2 2.2 0 000 .8V19h-3V8h3v1.5a3.2 3.2 0 012.9-1.6c2.1 0 3.3 1.4 3.3 4.3V19z"
          />
        </svg>
        <span  :contenteditable="isEditing" data-field="linkedin" @blur="handleEditorInput">{{ header.linkedin }}</span>
      </span>
      <span>
        <svg viewBox="0 0 24 24">
          <path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"
          />
        </svg>
        <span  :contenteditable="isEditing" data-field="github" @blur="handleEditorInput">{{ header.github }}</span>
      </span>
    </div>
  </header>
</template>

<script lang="ts" setup>
import type { Header } from '@/types/common';
import { useEditorStore } from '@/stores/editor';
import { storeToRefs } from 'pinia';

const editor = useEditorStore();
const { isEditing } = storeToRefs(editor);

const emit = defineEmits(['update:header'])

const props = defineProps({
  header: {
    type: Object as () => Header,
    required: true,
  },
})

// watch(
//   () => props.header,
//   (newHeader) => {
//     console.log("Header updated", newHeader)
//   },
//   { deep: true }
// )

function handleEditorInput(e: Event) {
  const target = e.target as HTMLElement
  const field = target.dataset.field
  if (!field) return true;
  emit('update:header', { ...props.header, [field]: target.innerText })
  return true;
}

</script>
