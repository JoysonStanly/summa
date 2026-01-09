import React from "react";

interface TestCasesSkeletonProps {
  rows?: number;
}

const TestCasesSkeleton: React.FC<TestCasesSkeletonProps> = ({ rows = 3 }) => {
  console.log('TestCasesSkeleton rendering with rows:', rows);
  return (
    <div className="w-full rounded-xl bg-[#141414] p-4 space-y-4 border-t border-[#1f1f1f]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-28 rounded-md skeleton" />
      </div>

      {/* Tabs / Pills */}
      <div className="flex gap-3">
        <div className="h-6 w-20 rounded-full skeleton" />
        <div className="h-6 w-16 rounded-full skeleton" />
        <div className="h-6 w-12 rounded-full skeleton" />
      </div>

      {/* Test case blocks */}
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 w-32 rounded-md skeleton" />
          <div className="h-10 w-full rounded-lg skeleton" />
        </div>
      ))}
    </div>
  );
};

export default TestCasesSkeleton;
