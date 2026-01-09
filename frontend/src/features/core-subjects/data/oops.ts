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

export const oopsData: Subject = {
  id: 'oops',
  title: 'OOPs',
  modules: [
    {
      id: 'fundamentals-of-oops',
      title: 'Fundamentals of OOPs',
      problems: [
        { id: 'introduction-to-oops', name: 'Introduction to OOPs', isCompleted: false },
        { id: 'classes-and-objects', name: 'Classes and Objects', isCompleted: false },
        { id: 'constructors-destructors', name: 'Constructors and Destructors', isCompleted: false }
      ],
      topics: []
    },
    {
      id: 'four-pillars',
      title: 'Four Pillars of OOPs',
      problems: [
        { id: 'encapsulation', name: 'Encapsulation', isCompleted: false },
        { id: 'abstraction', name: 'Abstraction', isCompleted: false },
        { id: 'inheritance', name: 'Inheritance', isCompleted: false },
        { id: 'polymorphism', name: 'Polymorphism', isCompleted: false }
      ],
      topics: []
    },
    {
      id: 'advanced-concepts',
      title: 'Advanced Concepts',
      problems: [
        { id: 'interfaces', name: 'Interfaces', isCompleted: false },
        { id: 'abstract-classes', name: 'Abstract Classes', isCompleted: false },
        { id: 'method-overloading', name: 'Method Overloading', isCompleted: false },
        { id: 'method-overriding', name: 'Method Overriding', isCompleted: false }
      ],
      topics: []
    },
    {
      id: 'design-principles',
      title: 'Design Principles',
      problems: [
        { id: 'solid-principles', name: 'SOLID Principles', isCompleted: false },
        { id: 'coupling-cohesion', name: 'Coupling and Cohesion', isCompleted: false },
        { id: 'composition-vs-inheritance', name: 'Composition vs Inheritance', isCompleted: false }
      ],
      topics: []
    }
  ]
};

export const findTopicByPath = (subjectId: string, moduleId: string, topicId: string): Topic | null => {
  if (subjectId === 'oops') {
    const module = oopsData.modules.find(m => m.id === moduleId);
    if (module) {
      return module.topics.find(t => t.id === topicId) || null;
    }
  }
  return null;
};

export const findModuleByPath = (subjectId: string, moduleId: string): Module | null => {
  if (subjectId === 'oops') {
    return oopsData.modules.find(m => m.id === moduleId) || null;
  }
  return null;
};
