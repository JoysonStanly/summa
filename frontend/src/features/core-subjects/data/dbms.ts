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

export const dbmsData: Subject = {
  id: 'dbms',
  title: 'DBMS',
  modules: [
    {
      id: 'introduction-to-dbms',
      title: 'Introduction to DBMS',
      problems: [
        { id: 'what-is-dbms', name: 'What is DBMS?', isCompleted: false },
        { id: 'relational-model', name: 'Relational Model', isCompleted: false },
        { id: 'er-diagrams', name: 'ER Diagrams', isCompleted: false }
      ],
      topics: [
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
