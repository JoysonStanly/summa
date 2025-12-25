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

export const oopsData: Subject = {
  id: 'oops',
  title: 'Object Oriented Programming',
  modules: [
    {
      id: 'basics-of-oop',
      title: 'Basics of OOP',
      topics: [
        {
          id: 'introduction-to-oop',
          title: 'Introduction to OOP',
          status: 'current',
          videoUrl: '/videos/oop-intro.mp4',
          duration: '20:30',
          slides: [
            {
              id: 'slide-1',
              title: 'What is Object-Oriented Programming?',
              content: 'OOP is a programming paradigm based on the concept of objects, which contain data and code.',
            },
            {
              id: 'slide-2',
              title: 'Benefits of OOP',
              content: 'Modularity, reusability, flexibility, and maintainability',
            },
            {
              id: 'slide-3',
              title: 'OOP vs Procedural Programming',
              content: 'Understanding the differences between paradigms',
            }
          ]
        },
        {
          id: 'classes-and-objects',
          title: 'Classes and Objects',
          status: 'not-started',
          duration: '22:15',
          slides: []
        },
        {
          id: 'constructors-destructors',
          title: 'Constructors and Destructors',
          status: 'not-started',
          duration: '18:40',
          slides: []
        }
      ]
    },
    {
      id: 'pillars-of-oop',
      title: 'Pillars of OOP',
      topics: [
        {
          id: 'encapsulation',
          title: 'Encapsulation',
          status: 'not-started',
          duration: '16:30',
          slides: []
        },
        {
          id: 'inheritance',
          title: 'Inheritance',
          status: 'not-started',
          duration: '24:20',
          slides: []
        },
        {
          id: 'polymorphism',
          title: 'Polymorphism',
          status: 'not-started',
          duration: '26:45',
          slides: []
        },
        {
          id: 'abstraction',
          title: 'Abstraction',
          status: 'not-started',
          duration: '19:15',
          slides: []
        }
      ]
    },
    {
      id: 'advanced-oop',
      title: 'Advanced OOP Concepts',
      topics: [
        {
          id: 'interfaces-abstract-classes',
          title: 'Interfaces and Abstract Classes',
          status: 'not-started',
          duration: '28:30',
          slides: []
        },
        {
          id: 'method-overloading-overriding',
          title: 'Method Overloading and Overriding',
          status: 'not-started',
          duration: '22:40',
          slides: []
        }
      ]
    }
  ]
};
