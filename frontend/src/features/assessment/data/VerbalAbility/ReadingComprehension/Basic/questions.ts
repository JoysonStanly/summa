import type { AptitudeQuestion } from '../../../types';

export const basicQuestions: AptitudeQuestion[] = [
  {
    id: 1,
    question: "Read the passage: 'The sun rises in the east and sets in the west. This happens every day because Earth rotates on its axis.' What causes the sun to appear to rise and set?",
    options: [
      { id: 'a', text: "The sun moves around Earth" },
      { id: 'b', text: "Earth rotates on its axis" },
      { id: 'c', text: "The moon blocks the sun" },
      { id: 'd', text: "Clouds cover the sun" }
    ],
    correctAnswer: 'b',
    explanation: "The passage explicitly states that the sun rises and sets 'because Earth rotates on its axis.' This rotation causes the apparent movement of the sun across the sky."
  },
  {
    id: 2,
    question: "Read the passage: 'Maria loves reading books. She visits the library every weekend and borrows three books at a time. Her favorite genre is mystery novels.' How many books does Maria borrow each time?",
    options: [
      { id: 'a', text: "One book" },
      { id: 'b', text: "Two books" },
      { id: 'c', text: "Three books" },
      { id: 'd', text: "Five books" }
    ],
    correctAnswer: 'c',
    explanation: "The passage clearly states 'she visits the library every weekend and borrows three books at a time.'"
  },
  {
    id: 3,
    question: "Read the passage: 'Dogs are loyal animals. They protect their owners and are often called man's best friend. Dogs need regular exercise and a healthy diet to stay fit.' What is the main idea of this passage?",
    options: [
      { id: 'a', text: "Dogs need exercise" },
      { id: 'b', text: "Dogs eat healthy food" },
      { id: 'c', text: "Dogs are loyal animals" },
      { id: 'd', text: "Dogs are expensive pets" }
    ],
    correctAnswer: 'c',
    explanation: "The main idea is stated in the first sentence: 'Dogs are loyal animals.' The rest of the passage supports this main point with additional details."
  },
  {
    id: 4,
    question: "Read the passage: 'The library will be closed next Monday for maintenance work. It will reopen on Tuesday at 9 AM. All borrowed books can be returned on Tuesday.' When will the library reopen?",
    options: [
      { id: 'a', text: "Monday at 9 AM" },
      { id: 'b', text: "Tuesday at 9 AM" },
      { id: 'c', text: "Wednesday at 9 AM" },
      { id: 'd', text: "Next Monday" }
    ],
    correctAnswer: 'b',
    explanation: "The passage states: 'It will reopen on Tuesday at 9 AM.'"
  },
  {
    id: 5,
    question: "Read the passage: 'Plants need sunlight, water, and nutrients to grow. Without these three things, plants cannot survive. Photosynthesis is the process plants use to convert sunlight into energy.' What do plants need to survive?",
    options: [
      { id: 'a', text: "Only water" },
      { id: 'b', text: "Only sunlight" },
      { id: 'c', text: "Sunlight, water, and nutrients" },
      { id: 'd', text: "Only nutrients" }
    ],
    correctAnswer: 'c',
    explanation: "The passage explicitly states: 'Plants need sunlight, water, and nutrients to grow. Without these three things, plants cannot survive.'"
  },
  {
    id: 6,
    question: "Read the passage: 'John woke up late and missed his bus. He had to walk to school, which took 30 minutes. He arrived just as the bell rang.' Why did John walk to school?",
    options: [
      { id: 'a', text: "He wanted exercise" },
      { id: 'b', text: "He missed his bus" },
      { id: 'c', text: "The bus was cancelled" },
      { id: 'd', text: "He lost his bus pass" }
    ],
    correctAnswer: 'b',
    explanation: "The passage states: 'John woke up late and missed his bus. He had to walk to school.' The cause-and-effect relationship is clear."
  },
  {
    id: 7,
    question: "Read the passage: 'Recycling helps protect the environment. When we recycle paper, plastic, and glass, we reduce waste. This saves natural resources and keeps our planet clean.' What is one benefit of recycling?",
    options: [
      { id: 'a', text: "It makes money" },
      { id: 'b', text: "It reduces waste" },
      { id: 'c', text: "It creates jobs" },
      { id: 'd', text: "It is fun" }
    ],
    correctAnswer: 'b',
    explanation: "The passage states: 'When we recycle paper, plastic, and glass, we reduce waste.' This is explicitly mentioned as a benefit of recycling."
  },
  {
    id: 8,
    question: "Read the passage: 'The school cafeteria serves lunch from 12 PM to 1 PM. Students can choose between two main dishes, a salad, and a dessert. Drinks are included with every meal.' What time does lunch end?",
    options: [
      { id: 'a', text: "11 AM" },
      { id: 'b', text: "12 PM" },
      { id: 'c', text: "1 PM" },
      { id: 'd', text: "2 PM" }
    ],
    correctAnswer: 'c',
    explanation: "The passage states the cafeteria 'serves lunch from 12 PM to 1 PM,' meaning lunch ends at 1 PM."
  },
  {
    id: 9,
    question: "Read the passage: 'Sarah is training for a marathon. She runs five miles every morning before work. On weekends, she runs ten miles. She has been training for three months.' How far does Sarah run on weekends?",
    options: [
      { id: 'a', text: "Five miles" },
      { id: 'b', text: "Ten miles" },
      { id: 'c', text: "Fifteen miles" },
      { id: 'd', text: "Twenty miles" }
    ],
    correctAnswer: 'b',
    explanation: "The passage clearly states: 'On weekends, she runs ten miles.'"
  },
  {
    id: 10,
    question: "Read the passage: 'Water exists in three states: solid (ice), liquid (water), and gas (steam). When water freezes, it becomes ice. When it boils, it becomes steam.' What happens when water boils?",
    options: [
      { id: 'a', text: "It becomes ice" },
      { id: 'b', text: "It becomes solid" },
      { id: 'c', text: "It becomes steam" },
      { id: 'd', text: "It disappears" }
    ],
    correctAnswer: 'c',
    explanation: "The passage states: 'When it boils, it becomes steam.' This describes the transformation of water to its gaseous state."
  },
  {
    id: 11,
    question: "Read the passage: 'The ancient Egyptians built pyramids as tombs for their pharaohs. These massive structures took many years to build. The Great Pyramid of Giza is the largest and oldest.' Why did Egyptians build pyramids?",
    options: [
      { id: 'a', text: "As houses" },
      { id: 'b', text: "As tombs for pharaohs" },
      { id: 'c', text: "As temples" },
      { id: 'd', text: "As storage buildings" }
    ],
    correctAnswer: 'b',
    explanation: "The passage explicitly states: 'The ancient Egyptians built pyramids as tombs for their pharaohs.'"
  },
  {
    id: 12,
    question: "Read the passage: 'Exercise is important for good health. It strengthens muscles, improves heart function, and helps control weight. Doctors recommend at least 30 minutes of exercise daily.' What is one benefit of exercise mentioned?",
    options: [
      { id: 'a', text: "It makes you taller" },
      { id: 'b', text: "It strengthens muscles" },
      { id: 'c', text: "It improves eyesight" },
      { id: 'd', text: "It prevents colds" }
    ],
    correctAnswer: 'b',
    explanation: "The passage lists 'strengthens muscles' as one of the benefits of exercise, along with improving heart function and helping control weight."
  },
  {
    id: 13,
    question: "Read the passage: 'Tom's birthday party is on Saturday at 3 PM. He invited 20 friends. The party will have games, music, and a chocolate cake. Everyone is excited.' How many friends did Tom invite?",
    options: [
      { id: 'a', text: "10 friends" },
      { id: 'b', text: "15 friends" },
      { id: 'c', text: "20 friends" },
      { id: 'd', text: "25 friends" }
    ],
    correctAnswer: 'c',
    explanation: "The passage states: 'He invited 20 friends.'"
  },
  {
    id: 14,
    question: "Read the passage: 'Bees play an important role in nature. They pollinate flowers, which helps plants reproduce. Without bees, many plants would not survive. This would affect the entire food chain.' What do bees do?",
    options: [
      { id: 'a', text: "They make honey only" },
      { id: 'b', text: "They pollinate flowers" },
      { id: 'c', text: "They eat plants" },
      { id: 'd', text: "They destroy crops" }
    ],
    correctAnswer: 'b',
    explanation: "The passage states: 'They pollinate flowers, which helps plants reproduce.' This is their important role in nature."
  },
  {
    id: 15,
    question: "Read the passage: 'The weather forecast says it will rain tomorrow. People should carry umbrellas and wear raincoats. Outdoor events may be cancelled due to heavy rainfall.' What should people carry tomorrow?",
    options: [
      { id: 'a', text: "Sunglasses" },
      { id: 'b', text: "Umbrellas" },
      { id: 'c', text: "Hats" },
      { id: 'd', text: "Gloves" }
    ],
    correctAnswer: 'b',
    explanation: "The passage advises: 'People should carry umbrellas and wear raincoats' because of the rain forecast."
  },
  {
    id: 16,
    question: "Read the passage: 'Computers have changed how we work and communicate. We can send emails instantly, store large amounts of data, and connect with people worldwide. Technology continues to advance rapidly.' What can we do with computers?",
    options: [
      { id: 'a', text: "Only play games" },
      { id: 'b', text: "Send emails instantly" },
      { id: 'c', text: "Only watch videos" },
      { id: 'd', text: "Nothing important" }
    ],
    correctAnswer: 'b',
    explanation: "The passage mentions 'We can send emails instantly' as one of the ways computers have changed communication, along with storing data and connecting globally."
  },
  {
    id: 17,
    question: "Read the passage: 'The new museum opened last month. It displays art from different countries and time periods. Admission is free on Sundays. Guided tours are available at 10 AM and 2 PM.' When is admission free?",
    options: [
      { id: 'a', text: "Every day" },
      { id: 'b', text: "On Mondays" },
      { id: 'c', text: "On Sundays" },
      { id: 'd', text: "On Saturdays" }
    ],
    correctAnswer: 'c',
    explanation: "The passage clearly states: 'Admission is free on Sundays.'"
  },
  {
    id: 18,
    question: "Read the passage: 'Healthy eating includes fruits, vegetables, whole grains, and lean proteins. Avoid too much sugar and processed foods. Drinking plenty of water is also important for good health.' What should you avoid?",
    options: [
      { id: 'a', text: "Fruits" },
      { id: 'b', text: "Vegetables" },
      { id: 'c', text: "Too much sugar" },
      { id: 'd', text: "Water" }
    ],
    correctAnswer: 'c',
    explanation: "The passage advises to 'Avoid too much sugar and processed foods' as part of healthy eating."
  },
  {
    id: 19,
    question: "Read the passage: 'The city park has a playground, walking trails, and a lake. Families often have picnics on the grass. The park is open from 6 AM to 8 PM daily. Dogs must be kept on leashes.' What time does the park close?",
    options: [
      { id: 'a', text: "6 AM" },
      { id: 'b', text: "7 PM" },
      { id: 'c', text: "8 PM" },
      { id: 'd', text: "9 PM" }
    ],
    correctAnswer: 'c',
    explanation: "The passage states: 'The park is open from 6 AM to 8 PM daily,' meaning it closes at 8 PM."
  },
  {
    id: 20,
    question: "Read the passage: 'Reading books improves vocabulary and imagination. It also helps you learn about different cultures and ideas. Many successful people read for at least 30 minutes every day.' What is one benefit of reading?",
    options: [
      { id: 'a', text: "It improves vocabulary" },
      { id: 'b', text: "It makes you tired" },
      { id: 'c', text: "It wastes time" },
      { id: 'd', text: "It is boring" }
    ],
    correctAnswer: 'a',
    explanation: "The passage states: 'Reading books improves vocabulary and imagination,' listing vocabulary improvement as one of the key benefits."
  }
];

