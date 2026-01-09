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
  problems?: { id: string; name: string; isCompleted?: boolean }[];
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

export const operatingSystemData: Subject = {
  id: 'operating-system',
  title: 'Operating System',
  modules: [
    {
      id: 'basics-of-operating-systems',
      title: 'Basics of Operating Systems',
      problems: [
        { id: 'operating-system-introduction', name: 'Operating System Introduction', isCompleted: false },
        { id: 'process-program-thread', name: 'Process, Program, and Thread', isCompleted: false },
        { id: 'types-of-operating-system', name: 'Types of Operating System', isCompleted: false }
      ],
      topics: [
      ]
    },
    {
      id: 'process-management',
      title: 'Process Management',
      topics: [
        {
          id: 'batch-os-multiprogramming',
          title: 'Batch OS, Multiprogramming OS and Multitasking OS',
          status: 'not-started',
          duration: '20:15',
          slides: []
        },
        {
          id: 'multiprocessing-real-time',
          title: 'Multiprocessing OS and Real-time OS',
          status: 'not-started',
          duration: '16:30',
          slides: []
        }
      ]
    },
    {
      id: 'synchronization-and-concurrency',
      title: 'Synchronization and Concurrency',
      topics: [
        {
          id: 'distributed-clustered-embedded',
          title: 'Distributed, Clustered, Embedded OS',
          status: 'not-started',
          duration: '22:10',
          slides: []
        },
        {
          id: 'quiz-basics-operating-systems',
          title: 'Quiz Basics of Operating Systems',
          status: 'not-started',
          slides: []
        }
      ]
    }
  ]
};

export const findTopicByPath = (subjectId: string, moduleId: string, topicId: string): Topic | null => {
  if (subjectId === 'operating-system') {
    const module = operatingSystemData.modules.find(m => m.id === moduleId);
    if (module) {
      return module.topics.find(t => t.id === topicId) || null;
    }
  }
  return null;
};

export const findModuleByPath = (subjectId: string, moduleId: string): Module | null => {
  if (subjectId === 'operating-system') {
    return operatingSystemData.modules.find(m => m.id === moduleId) || null;
  }
  return null;
};
