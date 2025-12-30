export interface MockOption {
  id: string;
  text: string;
}

export interface MockQuestion {
  id: number;
  question: string;
  options: MockOption[];
  correctAnswer?: string;
}

export interface MockSubCategory {
  id: string;
  name: string;
  questions: MockQuestion[];
}

export interface MockCategory {
  id: string;
  name: string;
  subCategories: MockSubCategory[];
}

export const mockTestCategories: MockCategory[] = [
  {
    id: 'full-length',
    name: 'Full Length Mock Tests',
    subCategories: [
      {
        id: 'test-1',
        name: 'Mock Test 1',
        questions: []
      },
      {
        id: 'test-2',
        name: 'Mock Test 2',
        questions: []
      },
      {
        id: 'test-3',
        name: 'Mock Test 3',
        questions: []
      },
      {
        id: 'test-4',
        name: 'Mock Test 4',
        questions: []
      },
      {
        id: 'test-5',
        name: 'Mock Test 5',
        questions: []
      }
    ]
  },
  {
    id: 'sectional',
    name: 'Sectional Tests',
    subCategories: [
      {
        id: 'quant-1',
        name: 'Quantitative - Test 1',
        questions: []
      },
      {
        id: 'verbal-1',
        name: 'Verbal - Test 1',
        questions: []
      },
      {
        id: 'logical-1',
        name: 'Logical - Test 1',
        questions: []
      }
    ]
  },
  {
    id: 'topic-wise',
    name: 'Topic Wise Tests',
    subCategories: [
      {
        id: 'numbers',
        name: 'Numbers',
        questions: []
      },
      {
        id: 'percentages',
        name: 'Percentages',
        questions: []
      },
      {
        id: 'profit-loss',
        name: 'Profit and Loss',
        questions: []
      }
    ]
  },
  {
    id: 'previous-year',
    name: 'Previous Year Papers',
    subCategories: [
      {
        id: '2024',
        name: '2024',
        questions: []
      },
      {
        id: '2023',
        name: '2023',
        questions: []
      },
      {
        id: '2022',
        name: '2022',
        questions: []
      }
    ]
  },
  {
    id: 'company-specific',
    name: 'Company Specific Tests',
    subCategories: [
      {
        id: 'tcs',
        name: 'TCS NQT',
        questions: []
      },
      {
        id: 'infosys',
        name: 'Infosys',
        questions: []
      },
      {
        id: 'wipro',
        name: 'Wipro',
        questions: []
      },
      {
        id: 'cognizant',
        name: 'Cognizant',
        questions: []
      }
    ]
  },
  {
    id: 'difficulty-based',
    name: 'Difficulty Based',
    subCategories: [
      {
        id: 'easy',
        name: 'Easy',
        questions: []
      },
      {
        id: 'medium',
        name: 'Medium',
        questions: []
      },
      {
        id: 'hard',
        name: 'Hard',
        questions: []
      }
    ]
  }
];
