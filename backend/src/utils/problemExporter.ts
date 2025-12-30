import fs from 'fs';
import path from 'path';
import { IProblem } from '../models/Problem';

/**
 * Utility to export problems to JSON files for version control
 * Problems are organized by category in separate files
 */

const PROBLEMS_DIR = path.join(__dirname, '../../data/problems');

/**
 * Ensures the problems directory exists
 */
const ensureProblemsDirectory = (): void => {
  if (!fs.existsSync(PROBLEMS_DIR)) {
    fs.mkdirSync(PROBLEMS_DIR, { recursive: true });
  }
};

/**
 * Exports a single problem to its category file
 * @param problem - The problem to export
 */
export const exportProblemToFile = async (problem: IProblem): Promise<void> => {
  try {
    ensureProblemsDirectory();

    const category = problem.category || 'uncategorized';
    const fileName = `${category}.json`;
    const filePath = path.join(PROBLEMS_DIR, fileName);

    let problems: any[] = [];

    // Read existing problems from file if it exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      problems = JSON.parse(fileContent);
    }

    // Convert problem to plain object (remove mongoose methods)
    const problemData = problem.toObject();

    // Check if problem already exists (by _id or slug)
    const existingIndex = problems.findIndex(
      (p) => p._id?.toString() === problemData._id?.toString() || p.slug === problemData.slug
    );

    if (existingIndex !== -1) {
      // Update existing problem
      problems[existingIndex] = problemData;
    } else {
      // Add new problem
      problems.push(problemData);
    }

    // Sort problems by title for consistency
    problems.sort((a, b) => a.title.localeCompare(b.title));

    // Write back to file with pretty formatting
    fs.writeFileSync(filePath, JSON.stringify(problems, null, 2), 'utf-8');

    console.log(`✅ Problem exported to: ${filePath}`);
  } catch (error) {
    console.error('Error exporting problem to file:', error);
    throw error;
  }
};

/**
 * Exports all problems to their respective category files
 * @param problems - Array of problems to export
 */
export const exportAllProblemsToFiles = async (problems: IProblem[]): Promise<void> => {
  try {
    ensureProblemsDirectory();

    // Group problems by category
    const problemsByCategory = new Map<string, IProblem[]>();

    problems.forEach((problem) => {
      const category = problem.category || 'uncategorized';
      if (!problemsByCategory.has(category)) {
        problemsByCategory.set(category, []);
      }
      problemsByCategory.get(category)!.push(problem);
    });

    // Write each category to a separate file
    for (const [category, categoryProblems] of problemsByCategory.entries()) {
      const fileName = `${category}.json`;
      const filePath = path.join(PROBLEMS_DIR, fileName);

      const problemsData = categoryProblems.map((p) => p.toObject());

      // Sort by title
      problemsData.sort((a, b) => a.title.localeCompare(b.title));

      fs.writeFileSync(filePath, JSON.stringify(problemsData, null, 2), 'utf-8');

      console.log(`✅ Exported ${categoryProblems.length} problems to: ${filePath}`);
    }
  } catch (error) {
    console.error('Error exporting all problems to files:', error);
    throw error;
  }
};

/**
 * Deletes a problem from its category file
 * @param slug - The slug of the problem to delete
 * @param category - The category of the problem
 */
export const deleteProblemFromFile = async (slug: string, category: string): Promise<void> => {
  try {
    const fileName = `${category}.json`;
    const filePath = path.join(PROBLEMS_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      return; // File doesn't exist, nothing to delete
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let problems = JSON.parse(fileContent);

    // Filter out the deleted problem
    problems = problems.filter((p: any) => p.slug !== slug);

    // Write back to file
    if (problems.length > 0) {
      fs.writeFileSync(filePath, JSON.stringify(problems, null, 2), 'utf-8');
      console.log(`✅ Problem deleted from: ${filePath}`);
    } else {
      // Delete file if no problems left
      fs.unlinkSync(filePath);
      console.log(`✅ Empty category file deleted: ${filePath}`);
    }
  } catch (error) {
    console.error('Error deleting problem from file:', error);
    throw error;
  }
};

/**
 * Gets all problem files
 */
export const getProblemFiles = (): string[] => {
  ensureProblemsDirectory();
  return fs.readdirSync(PROBLEMS_DIR).filter((file) => file.endsWith('.json'));
};

/**
 * Reads problems from a specific category file
 */
export const readProblemsFromFile = (category: string): any[] => {
  const fileName = `${category}.json`;
  const filePath = path.join(PROBLEMS_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};
