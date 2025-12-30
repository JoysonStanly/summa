import axios from 'axios';

// Judge0 language IDs
export const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  cpp: 54,        // C++ (GCC 9.2.0)
  java: 62,       // Java (OpenJDK 13.0.1)
};

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: string;
  memory_limit?: number;
}

export interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
  compile_output: string | null;
}

/**
 * Judge0 Service for code execution
 */
class Judge0Service {
  private apiUrl: string;
  private apiKey: string;
  private headers: Record<string, string>;

  constructor() {
    this.apiUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
    this.apiKey = process.env.JUDGE0_API_KEY || '';
    this.headers = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    };
  }

  /**
   * Submit code for execution
   */
  async submitCode(submission: Judge0Submission): Promise<string> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/submissions?base64_encoded=false&wait=false`,
        submission,
        { headers: this.headers }
      );
      return response.data.token;
    } catch (error: any) {
      console.error('Judge0 submission error:', error.response?.data || error.message);
      throw new Error('Failed to submit code to Judge0');
    }
  }

  /**
   * Get submission result
   */
  async getResult(token: string, retries = 10): Promise<Judge0Result> {
    try {
      for (let i = 0; i < retries; i++) {
        const response = await axios.get(
          `${this.apiUrl}/submissions/${token}?base64_encoded=false`,
          { headers: this.headers }
        );

        const result = response.data;

        // Status IDs: 1-2 = In Queue/Processing, 3 = Accepted
        if (result.status.id > 2) {
          return result;
        }

        // Wait before retry
        await this.sleep(1000);
      }

      throw new Error('Execution timeout - code took too long to execute');
    } catch (error: any) {
      console.error('Judge0 get result error:', error.response?.data || error.message);
      throw new Error('Failed to get execution result from Judge0');
    }
  }

  /**
   * Execute code with test case
   */
  async executeCode(
    code: string,
    language: string,
    input: string,
    expectedOutput: string
  ): Promise<{
    passed: boolean;
    output: string;
    error?: string;
    time: number;
    memory: number;
  }> {
    try {
      const languageId = LANGUAGE_IDS[language];

      if (!languageId) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const submission: Judge0Submission = {
        source_code: code,
        language_id: languageId,
        stdin: input,
        expected_output: expectedOutput,
        cpu_time_limit: '2',
        memory_limit: 128000, // 128 MB
      };

      // Submit code
      const token = await this.submitCode(submission);

      // Get result
      const result = await this.getResult(token);

      // Parse result
      const output = result.stdout?.trim() || '';
      const error = result.stderr || result.compile_output || '';
      const passed = result.status.id === 3; // Status 3 = Accepted

      return {
        passed,
        output,
        error: error || undefined,
        time: parseFloat(result.time) || 0,
        memory: result.memory || 0,
      };
    } catch (error: any) {
      return {
        passed: false,
        output: '',
        error: error.message || 'Execution failed',
        time: 0,
        memory: 0,
      };
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default new Judge0Service();
