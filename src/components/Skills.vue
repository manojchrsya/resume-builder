<template>
  <div class="section">
    <div class="section-title-row">
      <div class="section-title">Skills</div>
      <button class="btn tiny secondary" @click="addSkillGroup" data-action="add-skill-group">
        + Add Group
      </button>
    </div>
    <div class="skills-grid" id="skillsGrid">
      <div class="skill-group" v-for="(data, index) in skills" :key="index">
        <div class="skill-group-name" contenteditable="true" :data.title>{{ data.title }}</div>
        <div class="skill-tags" v-if="data.skills.length > 0">
          <span class="skill-tag" v-for="(skill, skillIndex) in data.skills" :key="skillIndex">
            <span contenteditable="true" :skill>{{ skill }}</span>
            <button class="remove-btn" title="Remove skill">×</button>
          </span>
        </div>
        <div class="add-row">
          <button class="btn tiny secondary" data-action="add-skill" :data-gi="index">
            + Skill
          </button>
          &nbsp;<button class="btn tiny danger" data-action="remove-skill-group" :data-gi="index">
            Remove Group
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Skills } from '@/types/common'
const emit = defineEmits(['update:skill-group'])
defineProps({
  skills: {
    type: Array as () => Skills[],
    required: true,
  },
})

function addSkillGroup() {
  console.log(this.skills)
  // emit('update:user', { ...props.skills, name: 'Manoj'})
  // alert('Add Skill Group button clicked!');
  // this.skills.push({ title: 'New Group', skills: ["edit me!"] });
}
</script>
