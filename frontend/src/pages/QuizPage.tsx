import { QuizSidebar } from '../components/quiz/QuizSidebar';
import { QuizHeader } from '../components/quiz/QuizHeader';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { questions } from '../data/quizData';

export const QuizPage = () => {
  return (
    <div className="flex h-screen bg-[#111111]">
      <QuizSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <QuizHeader title="Numbers" subtitle="Basic" />
        <div className="max-w-4xl">
          {questions.map((question, index) => (
            <QuestionCard 
              key={question.id} 
              question={question} 
              questionNumber={index + 1} 
            />
          ))}
        </div>
      </main>
    </div>
  );
};
