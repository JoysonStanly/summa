import { useState, useEffect } from 'react';
import { problemsApi } from '@/services/api/api';
import { dsaTopics } from '../data/dsaTopics';
import { problems as staticProblems } from '../data/problems';

interface Problem {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  subcategory?: string;
  difficulty?: string;
}

interface StaticProblem {
  id: string;
  topicId: string;
  title: string;
  difficulty: string;
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
        
        let problemsData: Problem[] = [];
        
        // Try to fetch from backend
        try {
          const response = await problemsApi.getProblems();
          problemsData = response?.data || response || [];
        } catch {
          console.warn('Backend API not available, using static problems data');
          problemsData = [];
        }
        
        // If backend is empty or unavailable, use static problems
        if (problemsData.length === 0) {
          console.log('Using static problems data as fallback');
          // Map static problems to include in the structure
          // Assume all static problems go to "fundamentals" subcategory
          const staticProblemsList = (staticProblems as StaticProblem[]).map(p => ({
            _id: p.id,
            slug: p.id,
            title: p.title,
            category: p.topicId,
            subcategory: 'fundamentals', // Default to fundamentals for static data
            difficulty: p.difficulty
          }));
          problemsData = staticProblemsList;
        }
        
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
            problems: problemsByCategory.get(`${topic.id}:${subtopic.id}`) || [] // Use backend problems if they exist
          }))
        }));
        
        setTopics(allTopics);
      } catch (err) {
        const error = err as Error;
        console.error('Failed to fetch DSA problems:', error);
        setError(error.message || 'Failed to load problems');
        
        // Fallback: show all topics with no problems
        setTopics(dsaTopics.map(topic => ({
          id: topic.id,
          name: topic.name,
          subtopics: topic.subtopics.map(subtopic => ({
            id: subtopic.id,
            name: subtopic.name,
            problems: []
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
