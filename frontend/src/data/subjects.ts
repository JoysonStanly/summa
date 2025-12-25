import { operatingSystemData } from './operatingSystem';
import { computerNetworkData } from './computerNetwork';
import { dbmsData } from './dbms';
import { lowLevelDesignData } from './lowLevelDesign';
import { oopsData } from './oops';

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
}

export interface Subject {
  id: string;
  title: string;
  modules: Module[];
}

export const subjectsData: Record<string, Subject> = {
  'operating-system': operatingSystemData,
  'computer-network': computerNetworkData,
  'dbms': dbmsData,
  'low-level-design': lowLevelDesignData,
  'oops': oopsData,
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

// Default routes for each subject
export const defaultRoutes: Record<string, { moduleId: string; topicId: string }> = {
  'operating-system': {
    moduleId: 'basics-of-operating-systems',
    topicId: 'operating-system-introduction'
  },
  'computer-network': {
    moduleId: 'basics-of-networking',
    topicId: 'introduction-to-networks'
  },
  'dbms': {
    moduleId: 'introduction-to-dbms',
    topicId: 'what-is-dbms'
  },
  'low-level-design': {
    moduleId: 'design-principles',
    topicId: 'solid-principles'
  },
  'oops': {
    moduleId: 'basics-of-oop',
    topicId: 'introduction-to-oop'
  }
};

export const getDefaultRoute = (subjectId: string) => {
  return defaultRoutes[subjectId] || null;
};
