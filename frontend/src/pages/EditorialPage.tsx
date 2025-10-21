import { FC } from 'react'
import { Editorial } from '../components/editorial'

// ✅ Main editorial page component
const EditorialPage: FC = () => {
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
  )
}

export default EditorialPage
