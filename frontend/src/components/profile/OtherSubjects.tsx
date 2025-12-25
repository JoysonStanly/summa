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
    <div className="bg-[#1a1a1a] rounded-xl p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2a2a2a]">
      <h2 className="text-xs font-semibold mb-2">Other subjects</h2>
      
      <div className="space-y-0.5">
        {subjects.map((subject, index) => {
          // Calculate percentage
          const percentage = Math.round((subject.completed / subject.total) * 100);
          
          // All progress bars use orange color
          const barColor = 'bg-orange-500';
          
          return (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium group-hover:text-white transition-colors">{subject.name}</span>
                <span className="text-xs text-gray-400 font-semibold">{subject.completed}/{subject.total}</span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out`}
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
