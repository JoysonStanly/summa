import fs from 'fs';
import path from 'path';

const getBackendRootDir = (): string => {
  // When running via ts-node/nodemon, __dirname points to backend/src/utils
  // When compiled, it may point to backend/dist/utils. Both are inside /backend.
  return path.resolve(__dirname, '..', '..', '..');
};

const resolveProblemJsonAbsolutePath = (contentPath: string): string => {
  if (path.isAbsolute(contentPath)) {
    return contentPath;
  }

  // Normalize windows slashes and strip accidental leading prefixes
  let normalized = contentPath.replace(/\\/g, '/').trim();
  if (normalized.startsWith('./')) normalized = normalized.slice(2);
  if (normalized.startsWith('backend/')) normalized = normalized.slice('backend/'.length);
  normalized = normalized.replace(/^\//, '');

  // Try multiple bases because the server may run from repo root or backend folder
  const backendRoot = getBackendRootDir();
  const candidates = [
    path.resolve(backendRoot, normalized),
    path.resolve(process.cwd(), normalized),
    // If running from repo root, contentPath usually starts with data/...
    // but files live under backend/data/...
    path.resolve(process.cwd(), 'backend', normalized),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Default to backendRoot-based resolution for consistent behavior
  return candidates[0];
};

export interface ProblemJSON {
  meta: {
    version: string;
    lastModified: string;
    author: string;
  };
  problem: {
    statement: string;
    examples: Array<{
      input: string;
      output: string;
      explanation?: string;
    }>;
    constraints: string[];
    hints: string[];
  };
  editorial: {
    sections: Array<{
      title: string;
      content: string;
    }>;
    solutions: {
      brute?: {
        approach: string;
        code: string;
        timeComplexity: string;
        spaceComplexity: string;
      };
      optimal?: {
        approach: string;
        code: string;
        timeComplexity: string;
        spaceComplexity: string;
      };
    };
    videoUrl?: string;
    videoDuration?: number;
    dryRunImages?: Array<{
      id: string;
      src: string;
      alt: string;
    }>;
  };
  starterCode: {
    javascript?: string;
    python?: string;
    cpp?: string;
    java?: string;
  };
  testCases: Array<{
    testCaseNumber: number;
    input: string[];
    output: string;
    explanation?: string;
    isHidden: boolean;
    weight: number;
  }>;
}

/**
 * Load problem content from JSON file
 * @param contentPath - Relative or absolute path to JSON file
 * @returns Parsed problem JSON data
 */
export const loadProblemJSON = (contentPath: string): ProblemJSON => {
  try {
    const absolutePath = resolveProblemJsonAbsolutePath(contentPath);

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Problem JSON file not found: ${contentPath}`);
    }

    // Read and parse JSON
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const jsonData = JSON.parse(fileContent) as ProblemJSON;

    // Validate structure
    if (!jsonData.problem || !jsonData.testCases) {
      throw new Error('Invalid JSON structure: missing required fields');
    }

    return jsonData;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`Problem JSON file not found: ${contentPath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON syntax in file: ${contentPath}`);
    }
    throw error;
  }
};

/**
 * Filter hidden test cases for non-admin users
 * @param testCases - Array of test cases
 * @param isAdmin - Whether user is admin
 * @returns Filtered test cases
 */
export const filterTestCases = (
  testCases: ProblemJSON['testCases'],
  isAdmin: boolean = false
): ProblemJSON['testCases'] => {
  if (isAdmin) {
    return testCases;
  }
  return testCases.filter(tc => !tc.isHidden);
};

/**
 * Check if JSON file exists for a problem
 * @param contentPath - Path to JSON file
 * @returns Boolean indicating if file exists
 */
export const problemJSONExists = (contentPath: string): boolean => {
  try {
    const absolutePath = resolveProblemJsonAbsolutePath(contentPath);
    return fs.existsSync(absolutePath);
  } catch {
    return false;
  }
};

/**
 * Validate JSON structure without loading full content
 * @param contentPath - Path to JSON file
 * @returns Validation result with errors if any
 */
export const validateProblemJSON = (contentPath: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    const jsonData = loadProblemJSON(contentPath);

    // Check required sections
    if (!jsonData.meta) errors.push('Missing meta section');
    if (!jsonData.problem) errors.push('Missing problem section');
    if (!jsonData.testCases || jsonData.testCases.length === 0) {
      errors.push('Missing or empty testCases');
    }

    // Check problem details
    if (jsonData.problem) {
      if (!jsonData.problem.statement) errors.push('Missing problem statement');
      if (!jsonData.problem.examples || jsonData.problem.examples.length === 0) {
        errors.push('Missing examples');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (error: any) {
    errors.push(error.message);
    return {
      valid: false,
      errors,
    };
  }
};
