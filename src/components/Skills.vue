<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="section">
    <div class="section-title-row">
      <div class="section-title">Skills</div>
      <button class="btn tiny secondary" v-if="isEditing" @click="addSkillGroup" data-action="add-skill-group">
        + Add Group
      </button>
    </div>
    <div class="skills-grid" id="skillsGrid">
      <div class="skill-group" v-for="(data, index) in skills" :key="index">
        <div class="skill-group-name" :contenteditable="isEditing" @input="updateSkillGroup" data-field="title">{{ data.title }}</div>
        <div class="skill-tags" v-if="data.skills.length > 0">
          <span class="skill-tag" v-for="(skill, skillIndex) in data.skills" :key="skillIndex">
            <span :contenteditable="isEditing" :data-gi="index" :data-si="skillIndex">{{ skill }}</span>
            <button v-if="isEditing" class="remove-btn" @click="removeSkill" title="Remove skill" :data-gi="index" :data-si="skillIndex">×</button>
          </span>
        </div>
        <div class="add-row">
          <button v-if="isEditing" class="btn tiny secondary" @click="addSkill" data-action="add-skill" :data-gi="index">+ Skill</button>
          &nbsp;<button  v-if="isEditing" class="btn tiny danger" @click="removeSkillGroup" data-action="remove-skill-group" :data-gi="index">
            Remove Group
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor';
import type { Skills } from '@/types/common'
const editor = useEditorStore();
import { storeToRefs } from 'pinia';
const { isEditing } = storeToRefs(editor);
const emit = defineEmits(['add:skill-group', 'add:skill', 'update:skill', 'update:skill-group']);

const props = defineProps({
  skills: {
    type: Array as () => Skills[],
    required: true,
  },
})

function addSkillGroup() {
  emit('add:skill-group', {
    title: 'New Group',
    skills: ["edit me!"]
  });
}

function updateSkillGroup(event: Event) {
  const target = event.currentTarget as HTMLElement;
  const field = target.dataset.field as keyof Skills;
  const entry = target.closest('.skill-group');
  const index = entry instanceof HTMLElement ? Number(entry.dataset.gi) : -1;
  if (index !== undefined && field) {
    const updatedSkillGroup = { ...props.skills[index], [field]: target.innerText };
    emit('update:skill-group', props.skills.map((skillGroup, i) => i === index ? updatedSkillGroup : skillGroup));
  }
}

function removeSkillGroup(e: Event) {
  const target = e.target as HTMLElement;
  const index = Number(target.dataset.gi);
  if (isNaN(index)) return;

  const updatedSkills = [...props.skills];
  updatedSkills.splice(index, 1);
  emit('update:skill-group', updatedSkills);
}

function removeSkill(e: Event) {
  const target = e.target as HTMLElement;
  const groupIndex = Number(target.dataset.gi);
  const skillIndex = Number(target.dataset.si);
  if (isNaN(groupIndex) || isNaN(skillIndex)) return;

  const updatedSkills = [...props.skills];
  const group = updatedSkills[groupIndex];
  if (!group) return;
  group.skills.splice(skillIndex, 1);
  emit('update:skill', updatedSkills);
}

function addSkill(e: Event) {
  const target = e.target as HTMLElement;
  const groupIndex = Number(target.dataset.gi);
  console.log("Adding skill to group index:", groupIndex);
  if (isNaN(groupIndex)) return;

  const updatedSkills = [...props.skills];
  const group = updatedSkills[groupIndex];
  if (!group) return;
  group.skills.push("New Skill");
  emit('update:skill', updatedSkills);
}

</script>
