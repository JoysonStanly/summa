export interface VerbalOption {
  id: string;
  text: string;
}

export interface VerbalQuestion {
  id: number;
  question: string;
  options: VerbalOption[];
  correctAnswer?: string;
}

export interface VerbalSubCategory {
  id: string;
  name: string;
  questions: VerbalQuestion[];
}

export interface VerbalCategory {
  id: string;
  name: string;
  subCategories: VerbalSubCategory[];
}

export const verbalAbilityCategories: VerbalCategory[] = [
  {
    id: 'synonyms',
    name: 'Synonyms',
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
    id: 'antonyms',
    name: 'Antonyms',
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
    id: 'sentence-completion',
    name: 'Sentence Completion',
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
    id: 'reading-comprehension',
    name: 'Reading Comprehension',
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
    id: 'para-jumbles',
    name: 'Para Jumbles',
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
    id: 'cloze-test',
    name: 'Cloze Test',
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
    id: 'spotting-errors',
    name: 'Spotting Errors',
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
    id: 'sentence-improvement',
    name: 'Sentence Improvement',
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
    id: 'idioms-phrases',
    name: 'Idioms and Phrases',
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
    id: 'one-word-substitution',
    name: 'One Word Substitution',
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
    id: 'fill-blanks',
    name: 'Fill in the Blanks',
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
    id: 'voice-change',
    name: 'Active and Passive Voice',
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
    id: 'direct-indirect',
    name: 'Direct and Indirect Speech',
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
    id: 'verbal-analogies',
    name: 'Verbal Analogies',
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
    id: 'sentence-rearrangement',
    name: 'Sentence Rearrangement',
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
    id: 'comprehension',
    name: 'Comprehension',
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
    id: 'grammar',
    name: 'Grammar',
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
    id: 'vocabulary',
    name: 'Vocabulary',
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
    id: 'word-formation',
    name: 'Word Formation',
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
    id: 'sentence-connectors',
    name: 'Sentence Connectors',
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
