import { operatingSystemData } from './operatingSystem';
import { dbmsData } from './dbms';
import { computerNetworksData } from './computerNetworks';
import { oopsData } from './oops';
import { lowLevelDesignData } from './lowLevelDesign';

export interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface Topic {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'not-started';
  videoUrl?: string;
  duration?: string;
  slides: Slide[];
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
  problems?: { id: string; name: string; isCompleted?: boolean }[];
}

export interface Subject {
  id: string;
  title: string;
  modules: Module[];
}

export const subjectsData: Record<string, Subject> = {
  'operating-system': operatingSystemData,
  'dbms': dbmsData,
  'computer-networks': computerNetworksData,
  'oops': oopsData,
  'low-level-design': lowLevelDesignData,
};

export const getSubjectData = (subjectId: string): Subject | null => {
  return subjectsData[subjectId] || null;
};

export const findTopicByPath = (subjectId: string, moduleId: string, topicId: string): Topic | null => {
  const subject = getSubjectData(subjectId);
  if (subject) {
    const module = subject.modules.find(m => m.id === moduleId);
    if (module) {
      return module.topics.find(t => t.id === topicId) || null;
    }
  }
  return null;
};

export const findModuleByPath = (subjectId: string, moduleId: string): Module | null => {
  const subject = getSubjectData(subjectId);
  if (subject) {
    return subject.modules.find(m => m.id === moduleId) || null;
  }
  return null;
};

export const findProblemByPath = (subjectId: string, moduleId: string, problemId: string) => {
  const subject = getSubjectData(subjectId);
  if (subject) {
    const module = subject.modules.find(m => m.id === moduleId);
    if (module && module.problems) {
      return module.problems.find(p => p.id === problemId) || null;
    }
  }
  return null;
};

// Default routes for each subject
export const defaultRoutes: Record<string, { moduleId: string; topicId: string }> = {
  'operating-system': {
    moduleId: 'basics-of-operating-systems',
    topicId: 'operating-system-introduction'
  },
  'dbms': {
    moduleId: 'introduction-to-dbms',
    topicId: 'what-is-dbms'
  },
  'computer-networks': {
    moduleId: 'introduction-to-networks',
    topicId: 'what-is-computer-network'
  },
  'oops': {
    moduleId: 'fundamentals-of-oops',
    topicId: 'introduction-to-oops'
  },
  'low-level-design': {
    moduleId: 'introduction-to-lld',
    topicId: 'what-is-lld'
  }
};

export const getDefaultRoute = (subjectId: string) => {
  return defaultRoutes[subjectId] || null;
};
