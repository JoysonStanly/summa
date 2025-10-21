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

export const operatingSystemData: Subject = {
  id: 'operating-system',
  title: 'Operating System',
  modules: [
    {
      id: 'basics-of-operating-systems',
      title: 'Basics of Operating Systems',
      topics: [
        {
          id: 'operating-system-introduction',
          title: 'Operating System Introduction',
          status: 'current',
          videoUrl: '/videos/os-intro.mp4',
          duration: '15:30',
          slides: [
            {
              id: 'slide-1',
              title: 'Operating System & Why it\'s Important',
              content: 'An operating system (OS) is the core software that connects computer\'s hardware & software resources and its user.',
              imageUrl: '/images/os-introduction-slide1.png'
            },
            {
              id: 'slide-2',
              title: 'Functions of Operating System',
              content: 'Resource Management, Process Scheduling, Memory Management, File System Management',
            },
            {
              id: 'slide-3',
              title: 'Types of Operating Systems',
              content: 'Batch OS, Time-sharing OS, Distributed OS, Real-time OS, Embedded OS',
            },
            {
              id: 'slide-4',
              title: 'Operating System Structure',
              content: 'Kernel, System Calls, Device Drivers, File System',
            },
            {
              id: 'slide-5',
              title: 'Process Management',
              content: 'Process creation, scheduling, synchronization, and termination',
            },
            {
              id: 'slide-6',
              title: 'Memory Management',
              content: 'Virtual memory, paging, segmentation, and memory allocation',
            },
            {
              id: 'slide-7',
              title: 'File System',
              content: 'File organization, directory structure, and file operations',
            },
            {
              id: 'slide-8',
              title: 'Summary & Next Steps',
              content: 'Review key concepts and prepare for next topic on Process Management',
            }
          ]
        },
        {
          id: 'process-program-thread',
          title: 'Process, Program, and Thread',
          status: 'completed',
          duration: '12:45',
          slides: []
        },
        {
          id: 'types-of-operating-system',
          title: 'Types of Operating System',
          status: 'completed',
          duration: '18:20',
          slides: []
        }
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
