export interface LogicalOption {
  id: string;
  text: string;
}

export interface LogicalQuestion {
  id: number;
  question: string;
  options: LogicalOption[];
  correctAnswer?: string;
}

export interface LogicalSubCategory {
  id: string;
  name: string;
  questions: LogicalQuestion[];
}

export interface LogicalCategory {
  id: string;
  name: string;
  subCategories: LogicalSubCategory[];
}

export const logicalReasoningCategories: LogicalCategory[] = [
  {
    id: 'series',
    name: 'Series Completion',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'analogies',
    name: 'Analogies',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'coding-decoding',
    name: 'Coding and Decoding',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'blood-relations',
    name: 'Blood Relations',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'direction-sense',
    name: 'Direction Sense',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'puzzles',
    name: 'Puzzles',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'syllogism',
    name: 'Syllogism',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'data-sufficiency',
    name: 'Data Sufficiency',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'seating-arrangement',
    name: 'Seating Arrangement',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'input-output',
    name: 'Input-Output',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'statement-assumptions',
    name: 'Statement and Assumptions',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'critical-reasoning',
    name: 'Critical Reasoning',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  },
  {
    id: 'calendar',
    name: 'Calendar',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: []
      }
    ]
  }
];
