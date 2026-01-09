import { FC, useState } from 'react'
import { FileText, BookOpen, Clock, ChevronLeft } from 'lucide-react'
import { Editorial } from '../editorial'

// ✅ Main editorial page component
const EditorialPage: FC = () => {
  const [activeTab, setActiveTab] = useState<'description' | 'editorial' | 'submissions' | 'discussion'>('editorial');
  // 🧠 Intuition content
  const intuitionContent = `
The naive way is to think of a data structure that does not store duplicate elements — HashSet.
Keep track of unique elements in the hashset, and at last copy all the elements from the HashSet
back to the original array.
  `

  // ⚡ Approach content
  const approachContent = `
• Traverse through the array, similar to the idea of scanning each book serially.
• Check if the current element of array is equal to the target element.
• If so, return the index and stop scanning further.
• In case the target value is not found, return -1 marking that the target element is missing.
  `

  return (
    <div className="flex flex-col h-full w-full">
      {/* Tab Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center overflow-x-auto">
          {/* Description Tab */}
          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-[#EA763F] text-white bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900/30'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Description</span>
          </button>

          <div className="w-[1px] h-6 bg-zinc-800" />

          {/* Editorial Tab */}
          <button
            onClick={() => setActiveTab('editorial')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'editorial'
                ? 'border-[#EA763F] text-white bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Editorial</span>
          </button>

          <div className="w-[1px] h-6 bg-zinc-800" />

          {/* Submissions Tab */}
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'submissions'
                ? 'border-[#EA763F] text-white bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900/30'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Submissions</span>
          </button>

          <div className="w-[1px] h-6 bg-zinc-800" />

          {/* Discussion Tab */}
          <button
            onClick={() => setActiveTab('discussion')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'discussion'
                ? 'border-[#EA763F] text-white bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900/30'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Discussion</span>
          </button>
        </div>

        {/* Fold Button */}
        <button className="flex items-center justify-center w-8 h-8 mr-2 rounded hover:bg-zinc-800 transition-colors">
          <ChevronLeft className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'description' && (
          <div className="p-6 text-zinc-400">
            <p>Problem description content goes here...</p>
          </div>
        )}
        
        {activeTab === 'editorial' && (
          <Editorial
            // 🏷️ Main header content
            title="Remove duplicates from sorted array"
            subtitle="Brute force approach"
            videoThumbnail="/images/session-dp.jpg"
            videoUrl="https://example.com/video"

            // 📚 Editorial explanation sections
            sections={[
              {
                title: 'Intuition',
                content: intuitionContent,
              },
              {
                title: 'Approach',
                content: approachContent,
              },
            ]}

            // 🪄 Dry run images (optional)
            dryRunImages={[
              {
                id: '1',
                src: '/images/session-dp.jpg',
                alt: 'Dry run step 1',
              },
              {
                id: '2',
                src: '/images/session-graph.jpg',
                alt: 'Dry run step 2',
              },
            ]}

            // 💻 Solutions in different languages
            solutions={{
              java: `import java.util.*;

class Solution {
  // Linear Search Function
  public int linearSearch(int[] nums, int target) {
    // Traverse the entire array
    for (int i = 0; i < nums.length; i++) {
      // Check if current element is target
      if (nums[i] == target) {
        // Return if target found
        return i;
      }
    }
    // If target not found
    return -1;
  }

  public static void main(String[] args) {
    Solution sol = new Solution();
    int[] arr = {1, 2, 3, 4, 5};
    System.out.println(sol.linearSearch(arr, 3));
  }
}`,

              python: `def linear_search(nums, target):
    # Traverse the array
    for i in range(len(nums)):
        # Check if current element is target
        if nums[i] == target:
            return i
    # If target not found
    return -1

# Example usage
arr = [1, 2, 3, 4, 5]
print(linear_search(arr, 3))`,

              javascript: `function linearSearch(nums, target) {
  // Traverse the array
  for (let i = 0; i < nums.length; i++) {
    // Check if current element is target
    if (nums[i] === target) {
      return i;
    }
  }
  // If target not found
  return -1;
}

// Example usage
const arr = [1, 2, 3, 4, 5];
console.log(linearSearch(arr, 3));`
            }}

            // ⏳ Complexity analysis
            timeComplexity="O(N), in worst case the entire array will be traversed, taking time N where N is the size of the array."
            spaceComplexity="O(1), no extra space is used apart from the input array."
          />
        )}

        {activeTab === 'submissions' && (
          <div className="p-6 text-zinc-400">
            <p>Submissions history will appear here...</p>
          </div>
        )}

        {activeTab === 'discussion' && (
          <div className="p-6 text-zinc-400">
            <p>Discussion forum content goes here...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditorialPage
