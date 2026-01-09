import type { AptitudeQuestion } from '../../../types';

export const basicQuestions: AptitudeQuestion[] = [
  {
    id: 1,
    question: 'Pointing to a photograph, a man said, "She is the daughter of my grandfather\'s only son." How is the woman related to the man?',
    options: [
      { id: 'a', text: 'Sister' },
      { id: 'b', text: 'Daughter' },
      { id: 'c', text: 'Mother' },
      { id: 'd', text: 'Wife' }
    ],
    correctAnswer: 'a',
    explanation: 'My grandfather\'s only son = My father. So, the woman is the daughter of my father = My sister.'
  },
  {
    id: 2,
    question: 'A is B\'s sister. C is B\'s mother. D is C\'s father. E is D\'s mother. How is A related to D?',
    options: [
      { id: 'a', text: 'Grandmother' },
      { id: 'b', text: 'Granddaughter' },
      { id: 'c', text: 'Daughter' },
      { id: 'd', text: 'Sister' }
    ],
    correctAnswer: 'b',
    explanation: 'A is B\'s sister and C is B\'s mother, so A is C\'s daughter. D is C\'s father, making A the granddaughter of D.'
  },
  {
    id: 3,
    question: 'If A + B means A is the father of B; A - B means A is the brother of B; A × B means A is the wife of B; then which of the following shows that M is the maternal uncle of N? N × L + M - K',
    options: [
      { id: 'a', text: 'N × L + M - K' },
      { id: 'b', text: 'M - K + L × N' },
      { id: 'c', text: 'N - L + M × K' },
      { id: 'd', text: 'M + K - L × N' }
    ],
    correctAnswer: 'b',
    explanation: 'M - K means M is brother of K; K + L means K is father of L; L × N means L is wife of N. So M is the brother of K (father of L who is wife of N), making M the maternal uncle of N.'
  },
  {
    id: 4,
    question: 'Pointing to a man, a woman said, "His mother is the only daughter of my mother." How is the woman related to the man?',
    options: [
      { id: 'a', text: 'Mother' },
      { id: 'b', text: 'Sister' },
      { id: 'c', text: 'Aunt' },
      { id: 'd', text: 'Daughter' }
    ],
    correctAnswer: 'a',
    explanation: 'Only daughter of my mother = Myself. So, the man\'s mother is the woman herself. Therefore, the woman is the mother of the man.'
  },
  {
    id: 5,
    question: 'A is the son of B. C, B\'s sister has a son D and a daughter E. F is the maternal uncle of D. How is F related to A?',
    options: [
      { id: 'a', text: 'Brother' },
      { id: 'b', text: 'Uncle' },
      { id: 'c', text: 'Cousin' },
      { id: 'd', text: 'Father' }
    ],
    correctAnswer: 'b',
    explanation: 'F is the maternal uncle of D, which means F is the brother of C (D\'s mother). C is B\'s sister. So F is also B\'s brother-in-law or brother, making F the uncle of A (B\'s son).'
  },
  {
    id: 6,
    question: 'Introducing a man, a woman said, "He is the only son of my mother\'s mother." How is the woman related to the man?',
    options: [
      { id: 'a', text: 'Mother' },
      { id: 'b', text: 'Niece' },
      { id: 'c', text: 'Sister' },
      { id: 'd', text: 'Aunt' }
    ],
    correctAnswer: 'b',
    explanation: 'Mother\'s mother = Grandmother. Only son of grandmother = Mother\'s brother = Maternal uncle. So the woman is the niece of the man.'
  },
  {
    id: 7,
    question: 'A and B are brothers. C and D are sisters. A\'s son is D\'s brother. How is B related to C?',
    options: [
      { id: 'a', text: 'Father' },
      { id: 'b', text: 'Brother' },
      { id: 'c', text: 'Uncle' },
      { id: 'd', text: 'Grandfather' }
    ],
    correctAnswer: 'c',
    explanation: 'A\'s son is D\'s brother, meaning A is the father of D. Since C and D are sisters, A is also C\'s father. A and B are brothers, so B is the uncle of C.'
  },
  {
    id: 8,
    question: 'P is the brother of Q and R. S is R\'s mother. T is P\'s father. Which of the following statements cannot be definitely true?',
    options: [
      { id: 'a', text: 'T is Q\'s father' },
      { id: 'b', text: 'S is P\'s mother' },
      { id: 'c', text: 'Q is T\'s son' },
      { id: 'd', text: 'P is S\'s son' }
    ],
    correctAnswer: 'c',
    explanation: 'Q can be either son or daughter of T. Since the gender of Q is not specified, we cannot definitely say Q is T\'s son. Q could be T\'s daughter.'
  },
  {
    id: 9,
    question: 'Looking at a portrait, Aditi said, "Aniket is the father of my grandmother\'s daughter\'s niece. My grandfather had only two kids." How is Aniket related to Aditi?',
    options: [
      { id: 'a', text: 'Father' },
      { id: 'b', text: 'Uncle' },
      { id: 'c', text: 'Brother' },
      { id: 'd', text: 'Cousin' }
    ],
    correctAnswer: 'a',
    explanation: 'Grandmother\'s daughter = Mother or Aunt. Niece of mother/aunt = Aditi herself (since grandfather had only two kids: Aditi\'s mother and uncle/aunt). Aniket is the father of Aditi\'s niece means he\'s Aditi\'s father.'
  },
  {
    id: 10,
    question: 'M is the son of P. Q is the granddaughter of O who is the husband of P. How is M related to O?',
    options: [
      { id: 'a', text: 'Son' },
      { id: 'b', text: 'Grandson' },
      { id: 'c', text: 'Brother' },
      { id: 'd', text: 'Father' }
    ],
    correctAnswer: 'a',
    explanation: 'O is the husband of P, and M is the son of P. Therefore, M is the son of O.'
  },
  {
    id: 11,
    question: 'A woman introduces a man as the son of the brother of her mother. How is the man related to the woman?',
    options: [
      { id: 'a', text: 'Nephew' },
      { id: 'b', text: 'Son' },
      { id: 'c', text: 'Cousin' },
      { id: 'd', text: 'Uncle' }
    ],
    correctAnswer: 'c',
    explanation: 'Brother of her mother = Maternal uncle. Son of maternal uncle = Cousin. Therefore, the man is the cousin of the woman.'
  },
  {
    id: 12,
    question: 'If P $ Q means P is the father of Q; P # Q means P is the mother of Q; P @ Q means P is the husband of Q; then which shows that I is the grandmother of K?',
    options: [
      { id: 'a', text: 'I # J $ K' },
      { id: 'b', text: 'I @ J $ K' },
      { id: 'c', text: 'K $ J # I' },
      { id: 'd', text: 'J $ K @ I' }
    ],
    correctAnswer: 'a',
    explanation: 'I # J means I is the mother of J; J $ K means J is the father of K. Therefore, I is the grandmother of K.'
  },
  {
    id: 13,
    question: 'A is B\'s brother. C is A\'s mother. D is C\'s father. E is B\'s son. How is D related to E?',
    options: [
      { id: 'a', text: 'Grandfather' },
      { id: 'b', text: 'Great-grandfather' },
      { id: 'c', text: 'Father' },
      { id: 'd', text: 'Uncle' }
    ],
    correctAnswer: 'b',
    explanation: 'D is C\'s father (E\'s great-grandfather through: D → C (father-daughter) → B (mother-son) → E (father-son). D is the great-grandfather of E.'
  },
  {
    id: 14,
    question: 'Pointing towards a person, a man said to a woman, "His mother is the only daughter of your father." How is the woman related to that person?',
    options: [
      { id: 'a', text: 'Daughter' },
      { id: 'b', text: 'Sister' },
      { id: 'c', text: 'Mother' },
      { id: 'd', text: 'Wife' }
    ],
    correctAnswer: 'c',
    explanation: 'Only daughter of your father = You (the woman). His mother = the woman. Therefore, the woman is the mother of that person.'
  },
  {
    id: 15,
    question: 'A is father of C and D is son of B. E is brother of A. If C is sister of D, how is B related to E?',
    options: [
      { id: 'a', text: 'Daughter' },
      { id: 'b', text: 'Sister-in-law' },
      { id: 'c', text: 'Brother' },
      { id: 'd', text: 'Wife' }
    ],
    correctAnswer: 'b',
    explanation: 'A is father of C, and D is son of B. Since C is sister of D, both have the same parents. So A and B are married. E is brother of A, making B the sister-in-law of E.'
  },
  {
    id: 16,
    question: 'X introduces Y saying, "He is the husband of the granddaughter of the father of my father." How is Y related to X?',
    options: [
      { id: 'a', text: 'Brother' },
      { id: 'b', text: 'Son' },
      { id: 'c', text: 'Brother-in-law' },
      { id: 'd', text: 'Nephew' }
    ],
    correctAnswer: 'c',
    explanation: 'Father of my father = Grandfather. Granddaughter of grandfather = Sister or Cousin. Husband of sister = Brother-in-law. Therefore, Y is X\'s brother-in-law.'
  },
  {
    id: 17,
    question: 'A and B are sisters. R and S are brothers. A\'s daughter is R\'s sister. What is B\'s relation to S?',
    options: [
      { id: 'a', text: 'Mother' },
      { id: 'b', text: 'Sister' },
      { id: 'c', text: 'Aunt' },
      { id: 'd', text: 'Grandmother' }
    ],
    correctAnswer: 'c',
    explanation: 'A\'s daughter is R\'s sister, so A is the mother of R. Since R and S are brothers, A is the mother of S too. A and B are sisters, so B is the aunt of S.'
  },
  {
    id: 18,
    question: 'Pointing to a lady, a man said, "The son of her only brother is the brother of my wife." How is the lady related to the man?',
    options: [
      { id: 'a', text: 'Mother\'s sister' },
      { id: 'b', text: 'Grandmother' },
      { id: 'c', text: 'Mother-in-law' },
      { id: 'd', text: 'Sister of father-in-law' }
    ],
    correctAnswer: 'd',
    explanation: 'Brother of my wife = Brother-in-law. Son of her only brother = Her nephew who is brother-in-law. So, her brother is father-in-law. The lady is the sister of father-in-law.'
  },
  {
    id: 19,
    question: 'A is the uncle of B, who is the daughter of C and C is the daughter-in-law of P. How is A related to P?',
    options: [
      { id: 'a', text: 'Son' },
      { id: 'b', text: 'Son-in-law' },
      { id: 'c', text: 'Brother' },
      { id: 'd', text: 'Data inadequate' }
    ],
    correctAnswer: 'a',
    explanation: 'B is the daughter of C, and A is the uncle of B. C is the daughter-in-law of P. A (being brother of C\'s husband or C\'s brother) is the son of P.'
  },
  {
    id: 20,
    question: 'In a family, there are six members P, Q, R, S, T, and U. P and Q are a married couple. R is the brother of S. S is the daughter of Q. T is the sister of P. U is the father of R. How many male members are there in the family?',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '3' },
      { id: 'c', text: '4' },
      { id: 'd', text: '1' }
    ],
    correctAnswer: 'b',
    explanation: 'Males: P (husband), R (brother of S, son of Q and P), U (father of R = grandfather). Females: Q (wife/mother), S (daughter), T (sister of P). Total males = 3.'
  }
];
