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

export const lowLevelDesignData: Subject = {
  id: 'low-level-design',
  title: 'Low Level Design',
  modules: [
    {
      id: 'design-principles',
      title: 'Design Principles',
      topics: [
        {
          id: 'solid-principles',
          title: 'SOLID Principles',
          status: 'current',
          videoUrl: '/videos/lld-solid.mp4',
          duration: '35:20',
          slides: [
            {
              id: 'slide-1',
              title: 'SOLID Principles Overview',
              content: 'Five fundamental principles for object-oriented design: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
            },
            {
              id: 'slide-2',
              title: 'Single Responsibility Principle',
              content: 'A class should have only one reason to change',
            },
            {
              id: 'slide-3',
              title: 'Open/Closed Principle',
              content: 'Software entities should be open for extension but closed for modification',
            }
          ]
        },
        {
          id: 'dry-kiss',
          title: 'DRY and KISS Principles',
          status: 'not-started',
          duration: '15:30',
          slides: []
        },
        {
          id: 'design-smells',
          title: 'Design Smells',
          status: 'not-started',
          duration: '18:45',
          slides: []
        }
      ]
    },
    {
      id: 'design-patterns',
      title: 'Design Patterns',
      topics: [
        {
          id: 'creational-patterns',
          title: 'Creational Design Patterns',
          status: 'not-started',
          duration: '40:15',
          slides: []
        },
        {
          id: 'structural-patterns',
          title: 'Structural Design Patterns',
          status: 'not-started',
          duration: '38:30',
          slides: []
        },
        {
          id: 'behavioral-patterns',
          title: 'Behavioral Design Patterns',
          status: 'not-started',
          duration: '42:20',
          slides: []
        }
      ]
    },
    {
      id: 'system-design-problems',
      title: 'System Design Problems',
      topics: [
        {
          id: 'parking-lot',
          title: 'Design Parking Lot',
          status: 'not-started',
          duration: '45:30',
          slides: []
        },
        {
          id: 'library-management',
          title: 'Design Library Management System',
          status: 'not-started',
          duration: '50:15',
          slides: []
        }
      ]
    }
  ]
};
