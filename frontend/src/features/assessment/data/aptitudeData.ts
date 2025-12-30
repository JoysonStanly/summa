export interface AptitudeOption {
  id: string;
  text: string;
}

export interface AptitudeQuestion {
  id: number;
  question: string;
  options: AptitudeOption[];
  correctAnswer?: string;
}

export interface AptitudeSubCategory {
  id: string;
  name: string;
  questions: AptitudeQuestion[];
}

export interface AptitudeCategory {
  id: string;
  name: string;
  subCategories: AptitudeSubCategory[];
}

export const aptitudeCategories: AptitudeCategory[] = [
  {
    id: 'numbers',
    name: 'Numbers',
    subCategories: [
      {
        id: 'basic',
        name: 'Basic',
        questions: [
      {
        id: 1,
        question: 'Find the next term in the series: 2, 4, 6, 8, ?',
        options: [
          { id: 'a', text: '8' },
          { id: 'b', text: '10' },
          { id: 'c', text: '12' },
          { id: 'd', text: '14' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 2,
        question: 'Find the next term in the series: 3, 6, 12, 24, ?',
        options: [
          { id: 'a', text: '36' },
          { id: 'b', text: '48' },
          { id: 'c', text: '54' },
          { id: 'd', text: '72' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 3,
        question: 'Find the next term in the series: 1, 4, 9, 16, ?',
        options: [
          { id: 'a', text: '20' },
          { id: 'b', text: '21' },
          { id: 'c', text: '24' },
          { id: 'd', text: '25' }
        ],
        correctAnswer: 'd'
      },
      {
        id: 4,
        question: 'Find the next term in the series: 5, 9, 13, 17, ?',
        options: [
          { id: 'a', text: '20' },
          { id: 'b', text: '21' },
          { id: 'c', text: '23' },
          { id: 'd', text: '25' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 5,
        question: 'Find the next term in the series: 2, 5, 8, 11, ?',
        options: [
          { id: 'a', text: '13' },
          { id: 'b', text: '14' },
          { id: 'c', text: '15' },
          { id: 'd', text: '16' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 6,
        question: 'Find the next prime in the series: 2, 3, 5, 7, 11, ?',
        options: [
          { id: 'a', text: '12' },
          { id: 'b', text: '13' },
          { id: 'c', text: '14' },
          { id: 'd', text: '15' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 7,
        question: 'Find the next term in the factorial sequence: 1, 2, 6, 24, 120, ?',
        options: [
          { id: 'a', text: '240' },
          { id: 'b', text: '360' },
          { id: 'c', text: '720' },
          { id: 'd', text: '600' }
        ],
        correctAnswer: 'c'
      },
      {
        id: 8,
        question: 'Find the next term in the series: 0, 1, 1, 2, 3, 5, 8, ?',
        options: [
          { id: 'a', text: '11' },
          { id: 'b', text: '12' },
          { id: 'c', text: '13' },
          { id: 'd', text: '15' }
        ],
        correctAnswer: 'c'
      },
      {
        id: 9,
        question: 'Find the next term in the series: 13, 9, 5, 1, -3, ?',
        options: [
          { id: 'a', text: '-4' },
          { id: 'b', text: '-5' },
          { id: 'c', text: '-6' },
          { id: 'd', text: '-7' }
        ],
        correctAnswer: 'd'
      },
      {
        id: 10,
        question: 'Find the next term in the series: 1, 3, 6, 10, 15, ?',
        options: [
          { id: 'a', text: '20' },
          { id: 'b', text: '21' },
          { id: 'c', text: '22' },
          { id: 'd', text: '24' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 11,
        question: 'Find the next term in the series: 4, 10, 18, 28, 40, ?',
        options: [
          { id: 'a', text: '52' },
          { id: 'b', text: '54' },
          { id: 'c', text: '56' },
          { id: 'd', text: '58' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 12,
        question: 'Find the next term in the series: 3, 5, 12, 24, 33, ?',
        options: [
          { id: 'a', text: '43' },
          { id: 'b', text: '47' },
          { id: 'c', text: '50' },
          { id: 'd', text: '54' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 13,
        question: 'Find the next term in the series: 6, 9, 8, 13, 10, 17, 12, ?',
        options: [
          { id: 'a', text: '20' },
          { id: 'b', text: '21' },
          { id: 'c', text: '22' },
          { id: 'd', text: '24' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 14,
        question: 'Find the next term in the series: 2, 4, 8, 16, 30, ?',
        options: [
          { id: 'a', text: '60' },
          { id: 'b', text: '62' },
          { id: 'c', text: '64' },
          { id: 'd', text: '66' }
        ],
        correctAnswer: 'a'
      },
      {
        id: 15,
        question: 'Find the next term in the series: 2, 3, 5, 9, 17, ?',
        options: [
          { id: 'a', text: '31' },
          { id: 'b', text: '32' },
          { id: 'c', text: '33' },
          { id: 'd', text: '34' }
        ],
        correctAnswer: 'c'
      },
      {
        id: 16,
        question: 'Find the next term in the series: 2, 6, 12, 20, 30, ?',
        options: [
          { id: 'a', text: '36' },
          { id: 'b', text: '42' },
          { id: 'c', text: '48' },
          { id: 'd', text: '56' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 17,
        question: 'Find the next term in the series: 1, 4, 13, 40, ?',
        options: [
          { id: 'a', text: '120' },
          { id: 'b', text: '121' },
          { id: 'c', text: '122' },
          { id: 'd', text: '130' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 18,
        question: 'Find the next term in the series: 9, 9, 18, 6, 24, 0, 30, ?',
        options: [
          { id: 'a', text: '-6' },
          { id: 'b', text: '36' },
          { id: 'c', text: '42' },
          { id: 'd', text: '-12' }
        ],
        correctAnswer: 'a'
      },
      {
        id: 19,
        question: 'Find the next term in the series: 2, 9, 28, 65, 126, ?',
        options: [
          { id: 'a', text: '216' },
          { id: 'b', text: '217' },
          { id: 'c', text: '218' },
          { id: 'd', text: '225' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 20,
        question: 'Find the next digit in the alphabetical sequence: 8, 5, 4, 9, 1, 7, 6, ?',
        options: [
          { id: 'a', text: '2' },
          { id: 'b', text: '3' },
          { id: 'c', text: '0' },
          { id: 'd', text: '10' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 21,
        question: 'Find the next term in the series: 144, 169, 196, 225, ?',
        options: [
          { id: 'a', text: '252' },
          { id: 'b', text: '256' },
          { id: 'c', text: '262' },
          { id: 'd', text: '272' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 22,
        question: 'Find the next term in the series: 1, 11, 111, 1111, ?',
        options: [
          { id: 'a', text: '1112' },
          { id: 'b', text: '11111' },
          { id: 'c', text: '11122' },
          { id: 'd', text: '111111' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 23,
        question: 'Find the next term in the series: 2, 8, 18, 32, 50, ?',
        options: [
          { id: 'a', text: '64' },
          { id: 'b', text: '72' },
          { id: 'c', text: '78' },
          { id: 'd', text: '88' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 24,
        question: 'Find the next term in the series: 1, 5, 14, 30, 55, ?',
        options: [
          { id: 'a', text: '85' },
          { id: 'b', text: '90' },
          { id: 'c', text: '91' },
          { id: 'd', text: '96' }
        ],
        correctAnswer: 'c'
      },
      {
        id: 25,
        question: 'Find the next term in the series: 3, 14, 39, 84, ?',
        options: [
          { id: 'a', text: '145' },
          { id: 'b', text: '155' },
          { id: 'c', text: '165' },
          { id: 'd', text: '175' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 26,
        question: 'Find the next term in the series: 1, 3, 6, 11, 20, 37, ?',
        options: [
          { id: 'a', text: '57' },
          { id: 'b', text: '58' },
          { id: 'c', text: '70' },
          { id: 'd', text: '71' }
        ],
        correctAnswer: 'c'
      },
      {
        id: 27,
        question: 'Find the next term in the series: 10, 9, 18, 16, 32, 30, 60, ?',
        options: [
          { id: 'a', text: '58' },
          { id: 'b', text: '62' },
          { id: 'c', text: '64' },
          { id: 'd', text: '66' }
        ],
        correctAnswer: 'a'
      },
      {
        id: 28,
        question: 'Find the next prime in the series: 11, 13, 17, 19, 23, ?',
        options: [
          { id: 'a', text: '25' },
          { id: 'b', text: '27' },
          { id: 'c', text: '29' },
          { id: 'd', text: '31' }
        ],
        correctAnswer: 'c'
      },
      {
        id: 29,
        question: 'Find the next term in the series: 4, 5, 10, 60, 65, 130, ?',
        options: [
          { id: 'a', text: '135' },
          { id: 'b', text: '195' },
          { id: 'c', text: '390' },
          { id: 'd', text: '780' }
        ],
        correctAnswer: 'd'
      },
      {
        id: 30,
        question: 'Find the next perfect number in the series: 6, 28, 496, ?',
        options: [
          { id: 'a', text: '2016' },
          { id: 'b', text: '8000' },
          { id: 'c', text: '8128' },
          { id: 'd', text: '8125' }
        ],
        correctAnswer: 'c'
      }
    ]
      },
      {
        id: 'advance',
        name: 'Advance',
        questions: []
      }
    ]
  },
  {
    id: 'lcm-hcf',
    name: 'LCM and HCF',
    subCategories: []
  },
  {
    id: 'work-wages',
    name: 'Work and Wages',
    subCategories: []
  },
  {
    id: 'pipes-cisterns',
    name: 'Pipes and Cisterns',
    subCategories: []
  },
  {
    id: 'time-speed-distance',
    name: 'Time, Speed and Distance',
    subCategories: []
  },
  {
    id: 'trains-boats',
    name: 'Trains, Boats and Streams',
    subCategories: []
  },
  {
    id: 'percentage',
    name: 'Percentage',
    subCategories: []
  },
  {
    id: 'ratio-proportion',
    name: 'Ratio and Proportion',
    subCategories: []
  },
  {
    id: 'partnership',
    name: 'Partnership',
    subCategories: []
  },
  {
    id: 'mixtures-alligation',
    name: 'Mixtures and Alligation',
    subCategories: []
  },
  {
    id: 'algebra',
    name: 'Algebra',
    subCategories: []
  },
  {
    id: 'average',
    name: 'Average',
    subCategories: []
  },
  {
    id: 'age',
    name: 'Age',
    subCategories: []
  },
  {
    id: 'profit-loss',
    name: 'Profit and Loss',
    subCategories: []
  },
  {
    id: 'simple-interest',
    name: 'Simple Interest',
    subCategories: []
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    subCategories: []
  },
  {
    id: 'mensuration-2d',
    name: 'Mensuration 2D',
    subCategories: []
  },
  {
    id: 'trigonometry',
    name: 'Trigonometry & Height and Distances',
    subCategories: []
  },
  {
    id: 'progressions',
    name: 'Progressions',
    subCategories: []
  },
  {
    id: 'logarithms',
    name: 'Logarithms',
    subCategories: []
  },
  {
    id: 'permutation-combination',
    name: 'Permutation and Combination',
    subCategories: []
  },
  {
    id: 'probability',
    name: 'Probability',
    subCategories: []
  },
  {
    id: 'geometry',
    name: 'Geometry',
    subCategories: []
  },
  {
    id: 'race',
    name: 'Race',
    subCategories: []
  },
  {
    id: 'simplification',
    name: 'Simplification and Approximation',
    subCategories: []
  }
];
