export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  explanation: string;
}

export interface Category {
  id: string;
  name: string;
  isExpanded?: boolean;
  isActive?: boolean;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  isActive?: boolean;
}

export const quantitativeCategories: Category[] = [
  {
    id: 'numbers',
    name: 'Numbers',
    isExpanded: true,
    subCategories: [
      { id: 'basic', name: 'Basic', isActive: true },
      { id: 'advance', name: 'Advance' }
    ]
  },
  { id: 'lcm-hcf', name: 'LCM and HCF' },
  { id: 'work-wages', name: 'Work and Wages' },
  { id: 'pipes-cisterns', name: 'Pipes and Cisterns' },
  { id: 'time-speed', name: 'Time, Speed and Distance' },
  { id: 'trains-boats', name: 'Trains, Boats and Streams' },
  { id: 'percentage', name: 'Percentage' },
  { id: 'ratio-proportion', name: 'Ratio and Proportion' },
  { id: 'partnership', name: 'Partnership' },
  { id: 'mixtures-alligation', name: 'Mixtures and Alligation' },
  { id: 'algebra', name: 'Algebra' },
  { id: 'average', name: 'Average' },
  { id: 'age', name: 'Age' }
];

export const questions: Question[] = [
  {
    id: 1,
    question: 'What is the difference between the square of 15 and the square of 10?',
    options: [
      { text: '100', isCorrect: false },
      { text: '125', isCorrect: true },
      { text: '150', isCorrect: false },
      { text: '175', isCorrect: false }
    ],
    explanation: '15² = 225 and 10² = 100, so the difference is 225 - 100 = 125.'
  },
  {
    id: 2,
    question: 'What is the sum of the first 5 even numbers?',
    options: [
      { text: '20', isCorrect: false },
      { text: '25', isCorrect: false },
      { text: '30', isCorrect: true },
      { text: '35', isCorrect: false }
    ],
    explanation: 'First 5 even numbers are 2+4+6+8+10 = 30.'
  }
];
