export interface Header {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface Skills {
  title: string;
  skills: string[];
}

export interface Designation {
  title: string;
  duration: string;
  promoted: boolean;
  responsibilities: string[];
}

export interface Experience {
  company: string;
  location: string;
  duration: string;
  designations: Designation[];
}

export interface Project {  
  name: string;
  description: string;
  techStack: string[];
}

export interface Education {
  title: string;
  institution: string;
  location: string;
  year: string;
  percentage: string;
}