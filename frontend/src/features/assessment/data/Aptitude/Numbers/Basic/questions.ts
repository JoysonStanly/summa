import type { AptitudeQuestion } from '../../../types';

export const basicQuestions: AptitudeQuestion[] = [
  {
    id: 1,
    question: 'Find the next term in the series: 2, 4, 6, 8, ?',
    options: [
      { id: 'a', text: '8' },
      { id: 'b', text: '10' },
      { id: 'c', text: '12' },
      { id: 'd', text: '14' }
    ],
    correctAnswer: 'b',
    explanation: 'This is an arithmetic progression with a common difference of 2. Each term increases by 2: 2+2=4, 4+2=6, 6+2=8, 8+2=10.'
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
    correctAnswer: 'b',
    explanation: 'This is a geometric progression where each term is multiplied by 2: 3×2=6, 6×2=12, 12×2=24, 24×2=48.'
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
    correctAnswer: 'd',
    explanation: 'This series represents perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25.'
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
    correctAnswer: 'b',
    explanation: 'This is an arithmetic progression with a common difference of 4: 5+4=9, 9+4=13, 13+4=17, 17+4=21.'
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
    correctAnswer: 'b',
    explanation: 'This is an arithmetic progression with a common difference of 3: 2+3=5, 5+3=8, 8+3=11, 11+3=14.'
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
    correctAnswer: 'b',
    explanation: 'This is a series of prime numbers. The next prime number after 11 is 13 (numbers divisible only by 1 and themselves).'
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
    correctAnswer: 'c',
    explanation: 'This is a factorial sequence: 1!=1, 2!=2, 3!=6, 4!=24, 5!=120, 6!=720. Each term is n! where n increases by 1.'
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
    correctAnswer: 'c',
    explanation: 'This is the Fibonacci sequence where each term is the sum of the two preceding terms: 0+1=1, 1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13.'
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
    correctAnswer: 'd',
    explanation: 'This is an arithmetic progression with a common difference of -4: 13-4=9, 9-4=5, 5-4=1, 1-4=-3, -3-4=-7.'
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
    correctAnswer: 'b',
    explanation: 'This is a triangular number sequence. The differences are 2, 3, 4, 5... increasing by 1. So 15+6=21. Formula: n(n+1)/2.'
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
    correctAnswer: 'b',
    explanation: 'Pattern: n²+3n. For n=1,2,3,4,5,6: 1²+3=4, 4+6=10, 9+9=18, 16+12=28, 25+15=40, 36+18=54.'
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
    correctAnswer: 'b',
    explanation: 'The differences are: 2, 7, 12, 9, 14. Alternating pattern of adding ~7-12 and ~9-14. Following the pattern: 33+14=47.'
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
    correctAnswer: 'b',
    explanation: 'Two alternating patterns: (6, 8, 10, 12) increases by 2, and (9, 13, 17, ?) increases by 4. Next: 17+4=21.'
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
    correctAnswer: 'a',
    explanation: 'Pattern: double and add 0, 0, 0, -2, 0. Or differences: 2, 4, 8, 14, 30. Next difference is 30, so 30+30=60.'
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
    correctAnswer: 'c',
    explanation: 'Pattern: 2×n-1. So 2→3 (2×2-1), 3→5 (3×2-1), 5→9 (5×2-1), 9→17 (9×2-1), 17→33 (17×2-1).'
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
    correctAnswer: 'b',
    explanation: 'Pattern: n(n+1). For n=1,2,3,4,5,6: 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.'
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
    correctAnswer: 'b',
    explanation: 'Pattern: n×3+1. So 1×3+1=4, 4×3+1=13, 13×3+1=40, 40×3+1=121.'
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
    correctAnswer: 'a',
    explanation: 'Two alternating patterns: (9, 18, 24, 30) increases by 6, and (9, 6, 0, ?) decreases by 3 then 6. Next: 0-6=-6.'
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
    correctAnswer: 'b',
    explanation: 'Pattern: n³+1. For n=1,2,3,4,5,6: 1³+1=2, 2³+1=9, 3³+1=28, 4³+1=65, 5³+1=126, 6³+1=217.'
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
    correctAnswer: 'b',
    explanation: 'Numbers sorted alphabetically: Eight, Five, Four, Nine, One, Seven, Six, Three. So the next number is 3.'
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
    correctAnswer: 'b',
    explanation: 'Perfect squares: 12²=144, 13²=169, 14²=196, 15²=225, 16²=256.'
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
    correctAnswer: 'b',
    explanation: 'Pattern of repeating 1s. Each term adds one more 1: 1, 11, 111, 1111, 11111 (five 1s).'
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
    correctAnswer: 'b',
    explanation: 'Pattern: 2n². For n=1,2,3,4,5,6: 2×1²=2, 2×2²=8, 2×3²=18, 2×4²=32, 2×5²=50, 2×6²=72.'
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
    correctAnswer: 'c',
    explanation: 'Pattern: n(n+1)(n+2)/3. For n=1,2,3,4,5,6: 1×2×3/3=2 (err), actually differences: 4, 9, 16, 25, 36 (squares). 55+36=91.'
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
    correctAnswer: 'b',
    explanation: 'Pattern: n³+n²+n. For n=1,2,3,4,5: 1+1+1=3, 8+4+2=14, 27+9+3=39, 64+16+4=84, 125+25+5=155.'
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
    correctAnswer: 'c',
    explanation: 'Each term is sum of previous two terms plus increasing number: 1+3-1=3, 3+6-3=6, 6+11-6=11, 11+20-11=20, 20+37-17=37. Pattern: 37+20+13=70.'
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
    correctAnswer: 'a',
    explanation: 'Alternating pattern: subtract 1 (10→10, 18→16, 32→30, 60→58) and double (9×2=18, 16×2=32, 30×2=60). Next: 60-2=58.'
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
    correctAnswer: 'c',
    explanation: 'Series of consecutive prime numbers. The next prime after 23 is 29 (not divisible by any number except 1 and itself).'
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
    correctAnswer: 'd',
    explanation: 'Alternating operations: add 1 (4→5, 10→11, 60→65, 130→135) and multiply by 2 (5×2=10, 65×2=130). Next: 130×6=780.'
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
    correctAnswer: 'c',
    explanation: 'Perfect numbers are numbers equal to the sum of their proper divisors. After 496, the next perfect number is 8128 (1+2+4+8+16+32+64+127+254+508+1016+2032+4064=8128).'
  }
];
