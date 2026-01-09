import { useState, useEffect } from 'react';
import { problemsApi } from '@/services/api/api';
import { dsaTopics } from '../data/dsaTopics';

interface Problem {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  subcategory?: string;
  difficulty?: string;
}

interface SubtopicWithProblems {
  id: string;
  name: string;
  problems: { id: string; name: string }[];
}

interface TopicWithSubtopics {
  id: string;
  name: string;
  subtopics: SubtopicWithProblems[];
}

/**
 * Custom hook to fetch DSA problems grouped by category/topic
 * Shows ALL topics and subtopics from dsaTopics.ts and populates them with problems from the backend
 */
export const useDSAProblems = () => {
  const [topics, setTopics] = useState<TopicWithSubtopics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch problems from backend
        const response = await problemsApi.getProblems();
        const problemsData: Problem[] = response?.data || response || [];
        
        // Group problems by their category and subcategory
        const problemsByCategory = groupProblemsByCategoryAndSubcategory(problemsData);
        
        // Create topics array based on dsaTopics structure
        // This ensures ALL topics and subtopics are shown even if they have no problems yet
        const allTopics: TopicWithSubtopics[] = dsaTopics.map(topic => ({
          id: topic.id,
          name: topic.name,
          subtopics: topic.subtopics.map(subtopic => ({
            id: subtopic.id,
            name: subtopic.name,
            // Use problems from dsaTopics.ts if they exist, otherwise use backend problems
            problems: subtopic.problems || problemsByCategory.get(`${topic.id}:${subtopic.id}`) || []
          }))
        }));
        
        setTopics(allTopics);
      } catch (err) {
        const error = err as Error;
        console.error('Failed to fetch DSA problems:', error);
        setError(error.message || 'Failed to load problems');
        
        // Fallback: show all topics with problems from dsaTopics.ts
        setTopics(dsaTopics.map(topic => ({
          id: topic.id,
          name: topic.name,
          subtopics: topic.subtopics.map(subtopic => ({
            id: subtopic.id,
            name: subtopic.name,
            problems: subtopic.problems || []
          }))
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  return { topics, loading, error };
};

/**
 * Groups problems by their category and subcategory fields into a Map
 * Returns Map<"category:subcategory", problem[]> for easy lookup
 */
function groupProblemsByCategoryAndSubcategory(problems: Problem[]): Map<string, { id: string; name: string }[]> {
  const categoryMap = new Map<string, { id: string; name: string }[]>();

  problems.forEach(problem => {
    const category = problem.category || 'uncategorized';
    const subcategory = problem.subcategory || 'fundamentals';
    const key = `${category}:${subcategory}`;
    
    if (!categoryMap.has(key)) {
      categoryMap.set(key, []);
    }
    categoryMap.get(key)!.push({
      id: problem.slug || problem._id,
      name: problem.title
    });
  });

  return categoryMap;
}
