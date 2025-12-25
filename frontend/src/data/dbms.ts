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

export const dbmsData: Subject = {
  id: 'dbms',
  title: 'Database Management System',
  modules: [
    {
      id: 'introduction-to-dbms',
      title: 'Introduction to DBMS',
      topics: [
        {
          id: 'what-is-dbms',
          title: 'What is DBMS?',
          status: 'current',
          videoUrl: '/videos/dbms-intro.mp4',
          duration: '16:30',
          slides: [
            {
              id: 'slide-1',
              title: 'Database Management System',
              content: 'A DBMS is software that manages databases, providing data storage, retrieval, and manipulation capabilities.',
            },
            {
              id: 'slide-2',
              title: 'Advantages of DBMS',
              content: 'Data independence, data integrity, security, backup and recovery',
            },
            {
              id: 'slide-3',
              title: 'Types of Databases',
              content: 'Relational, NoSQL, Hierarchical, Network databases',
            }
          ]
        },
        {
          id: 'relational-model',
          title: 'Relational Model',
          status: 'not-started',
          duration: '20:15',
          slides: []
        },
        {
          id: 'er-diagrams',
          title: 'ER Diagrams',
          status: 'not-started',
          duration: '22:30',
          slides: []
        }
      ]
    },
    {
      id: 'sql-basics',
      title: 'SQL Basics',
      topics: [
        {
          id: 'introduction-to-sql',
          title: 'Introduction to SQL',
          status: 'not-started',
          duration: '18:40',
          slides: []
        },
        {
          id: 'ddl-dml',
          title: 'DDL and DML Commands',
          status: 'not-started',
          duration: '25:20',
          slides: []
        },
        {
          id: 'joins',
          title: 'SQL Joins',
          status: 'not-started',
          duration: '28:15',
          slides: []
        }
      ]
    },
    {
      id: 'normalization',
      title: 'Normalization',
      topics: [
        {
          id: 'normal-forms',
          title: 'Normal Forms (1NF to BCNF)',
          status: 'not-started',
          duration: '30:45',
          slides: []
        },
        {
          id: 'transactions',
          title: 'Transactions and ACID Properties',
          status: 'not-started',
          duration: '22:30',
          slides: []
        }
      ]
    }
  ]
};
