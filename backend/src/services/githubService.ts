import axios from 'axios';

interface GitHubContentResponse {
  content: string;
  encoding: string;
}

class GitHubService {
  private baseUrl = 'https://api.github.com/repos';
  private owner: string;
  private repo: string;
  private branch: string;
  private cache: Map<string, any>;

  constructor() {
    // Configure your GitHub repository details
    this.owner = process.env.GITHUB_OWNER || 'your-username';
    this.repo = process.env.GITHUB_REPO || 'studyio-content';
    this.branch = process.env.GITHUB_BRANCH || 'main';
    this.cache = new Map();
  }

  /**
   * Fetch content from GitHub with caching
   */
  async fetchContent(path: string): Promise<any> {
    try {
      // Check cache first
      const cacheKey = `${this.repo}:${path}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const url = `${this.baseUrl}/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`;
      const headers: any = {
        Accept: 'application/vnd.github.v3+json',
      };

      // Add GitHub token if available (optional for public repos)
      if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      }

      const response = await axios.get<GitHubContentResponse>(url, { headers });

      // Decode base64 content
      const content = Buffer.from(response.data.content, 'base64').toString(
        'utf-8'
      );

      // Parse JSON content
      const parsedContent = JSON.parse(content);

      // Cache the result (cache for 5 minutes)
      this.cache.set(cacheKey, parsedContent);
      setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);

      return parsedContent;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Content not found at path: ${path}`);
      }
      throw new Error(
        `Failed to fetch content from GitHub: ${error.message}`
      );
    }
  }

  /**
   * Fetch DSA problem content from GitHub
   */
  async fetchProblemContent(problemSlug: string): Promise<any> {
    const path = `problems/${problemSlug}.json`;
    return this.fetchContent(path);
  }

  /**
   * Fetch core subject content (OS, DBMS, CN, OOPs, LLD)
   */
  async fetchSubjectContent(subjectPath: string): Promise<any> {
    const path = `subjects/${subjectPath}`;
    return this.fetchContent(path);
  }

  /**
   * Fetch module content
   */
  async fetchModuleContent(modulePath: string): Promise<any> {
    const path = `modules/${modulePath}`;
    return this.fetchContent(path);
  }

  /**
   * Fetch topic content
   */
  async fetchTopicContent(topicPath: string): Promise<any> {
    const path = `topics/${topicPath}`;
    return this.fetchContent(path);
  }

  /**
   * Fetch quiz questions from GitHub
   */
  async fetchQuizQuestions(quizPath: string): Promise<any> {
    const path = `quizzes/${quizPath}`;
    return this.fetchContent(path);
  }

  /**
   * Clear cache for specific path or all cache
   */
  clearCache(path?: string): void {
    if (path) {
      const cacheKey = `${this.repo}:${path}`;
      this.cache.delete(cacheKey);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Test GitHub connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.owner}/${this.repo}`;
      const headers: any = {
        Accept: 'application/vnd.github.v3+json',
      };

      if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      }

      await axios.get(url, { headers });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new GitHubService();
