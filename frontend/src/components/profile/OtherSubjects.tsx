interface SubjectProgress {
  name: string;
  completed: number;
  total: number;
}

interface OtherSubjectsProps {
  subjects: SubjectProgress[];
}

const OtherSubjects: React.FC<OtherSubjectsProps> = ({ subjects }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Other subjects</h2>
      
      <div className="space-y-4">
        {subjects.map((subject, index) => {
          // Calculate percentage
          const percentage = Math.round((subject.completed / subject.total) * 100);
          
          // Determine color based on completion percentage
          let barColor = 'bg-orange-600';
          if (percentage > 75) barColor = 'bg-green-500';
          else if (percentage > 50) barColor = 'bg-yellow-500';
          else if (percentage > 25) barColor = 'bg-orange-500';
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{subject.name}</span>
                <span className="text-sm text-gray-400">{subject.completed}/{subject.total}</span>
              </div>
              <div className="w-full h-2 bg-[#333] rounded-full">
                <div 
                  className={`h-full ${barColor} rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OtherSubjects;
