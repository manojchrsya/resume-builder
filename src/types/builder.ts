export interface HeaderDetails {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
}

export interface SkillGroup {
  title: string
  skills: string[]
}

export interface DesignationEntry {
  title: string
  current: boolean
  promoted: boolean
  duration: string
  responsibilities: string[]
}

export interface ExperienceEntry {
  company: string
  url: string
  location: string
  totalDuration: string
  designations: DesignationEntry[]
}

export interface ProjectEntry {
  name: string
  description: string
  techStack: string[]
}

export interface EducationEntry {
  title: string
  institution: string
  location: string
  year: string
  percentage: string
}

export interface BuilderState {
  step: number
  header: HeaderDetails
  summary: string
  config: {
    enableGridColumn: boolean
  }
  skills: SkillGroup[]
  experiences: ExperienceEntry[]
  projects: ProjectEntry[]
  educations: EducationEntry[]
}
