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

export const lowLevelDesignData: Subject = {
  id: 'low-level-design',
  title: 'Low Level Design',
  modules: [
    {
      id: 'introduction-to-lld',
      title: 'Introduction to LLD',
      problems: [
        { id: 'what-is-lld', name: 'What is Low Level Design?', isCompleted: false },
        { id: 'uml-diagrams', name: 'UML Diagrams', isCompleted: false },
        { id: 'class-diagrams', name: 'Class Diagrams', isCompleted: false }
      ],
      topics: []
    },
    {
      id: 'design-patterns',
      title: 'Design Patterns',
      problems: [
        { id: 'creational-patterns', name: 'Creational Patterns', isCompleted: false },
        { id: 'structural-patterns', name: 'Structural Patterns', isCompleted: false },
        { id: 'behavioral-patterns', name: 'Behavioral Patterns', isCompleted: false }
      ],
      topics: []
    },
    {
      id: 'specific-patterns',
      title: 'Specific Design Patterns',
      problems: [
        { id: 'singleton-pattern', name: 'Singleton Pattern', isCompleted: false },
        { id: 'factory-pattern', name: 'Factory Pattern', isCompleted: false },
        { id: 'observer-pattern', name: 'Observer Pattern', isCompleted: false },
        { id: 'strategy-pattern', name: 'Strategy Pattern', isCompleted: false }
      ],
      topics: []
    },
    {
      id: 'case-studies',
      title: 'LLD Case Studies',
      problems: [
        { id: 'parking-lot', name: 'Design Parking Lot', isCompleted: false },
        { id: 'elevator-system', name: 'Design Elevator System', isCompleted: false },
        { id: 'library-management', name: 'Design Library Management', isCompleted: false }
      ],
      topics: []
    }
  ]
};

export const findTopicByPath = (subjectId: string, moduleId: string, topicId: string): Topic | null => {
  if (subjectId === 'low-level-design') {
    const module = lowLevelDesignData.modules.find(m => m.id === moduleId);
    if (module) {
      return module.topics.find(t => t.id === topicId) || null;
    }
  }
  return null;
};

export const findModuleByPath = (subjectId: string, moduleId: string): Module | null => {
  if (subjectId === 'low-level-design') {
    return lowLevelDesignData.modules.find(m => m.id === moduleId) || null;
  }
  return null;
};
