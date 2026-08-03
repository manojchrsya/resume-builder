<!-- eslint-disable vue/multi-word-component-names -->
<!-- EXPERIENCE -->
<template>
  <div class="section">
    <div class="section-title-row">
      <div class="section-title">Work Experience</div>
      <button class="btn tiny secondary" data-action="add-experience">+ Add Company</button>
    </div>
    <div id="experienceList">
      <div class="entry" v-for="(data, index) in experiences" :key="index">
        <!-- Company header (shared) -->
        <div class="entry-header" style="margin-bottom: 6px">
          <div
            class="entry-org"
            style="font-style: normal; font-weight: 700; font-size: 13.5px; color: var(--text)"
          >
            <a :href="data.url ? data.url : '#'" class="entry-org" target="_blank">{{
              data.company
            }}</a>
            &nbsp;·&nbsp;
            <span style="font-weight: 400; font-size: 12px; color: var(--light)">{{
              data.location
            }}</span>
          </div>
          <div class="entry-date">{{ data.duration }}</div>
        </div>

        <!-- Role 2: Current (promoted) -->
        <div
          v-for="(designation, designationIndex) in data.designations"
          :key="designationIndex"
          :style="
            designation.current
              ? 'padding-left:14px; border-left:2px solid var(--accent); margin-bottom:10px;'
              : 'padding-left:14px; border-left:2px solid #d1d5db; margin-bottom:10px;'
          "
        >
          <div class="entry-header">
            <div style="display: flex; align-items: center; gap: 8px">
              <div class="entry-role">{{ designation.title }}</div>
              <span
                v-if="designation.promoted"
                style="
                  font-size: 10px;
                  font-weight: 700;
                  background: #e8f0fe;
                  color: #1a3a5c;
                  padding: 1px 7px;
                  border-radius: 3px;
                  letter-spacing: 0.5px;
                  text-transform: uppercase;
                "
                >Promoted</span
              >
            </div>
            <div class="entry-date">{{ designation.duration }}</div>
          </div>
          <ul>
            <li
              v-for="(responsibility, responsibilityIndex) in designation.responsibilities"
              :key="responsibilityIndex"
            >
              {{ responsibility }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Experience } from '@/types/common'
// const emit = defineEmits(['update:experiences'])
defineProps({
  experiences: {
    type: Array as () => Experience[],
    required: true,
  },
})

// function addExperience() {
//   // console.log(this.experiences);
//   // emit('update:experiences', { ...props.experiences, name: 'Manoj'})
//   // alert('Add Experience button clicked!');
//   // this.experiences.push({ company: 'New Company', role: "edit me!" });
// }
</script>
