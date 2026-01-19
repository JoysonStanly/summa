
// Judge0 language IDs (static defaults; verify with GET /languages in your local instance)
export const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // Node.js
  python: 71,     // Python 3.x
  cpp: 54,        // C++ (GCC)
  java: 62,       // Java (OpenJDK)
};

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
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
 * Judge0 Service for code execution against a LOCAL Judge0 API
 */
class Judge0Service {
  // No constructor or apiUrl needed while Judge0 is mocked

  /**
   * Execute a single submission synchronously using wait=true
   */
  // MOCK: Disable Judge0, always return fake result
  async runCode(
    source: string,
    languageId: number,
    stdin?: string,
    options?: { cpu_time_limit?: string; memory_limit?: number; }
  ): Promise<Judge0Result> {
    // Simulate a successful run with mock output
    return {
      stdout: '42',
      stderr: null,
      status: { id: 3, description: 'Accepted' },
      time: '0.012',
      memory: 12000,
      compile_output: null,
    };
  }

  /**
   * Convenience method: run by language key (javascript|python|cpp|java)
   */
  // MOCK: Disable Judge0, always return fake result
  async runByLanguageKey(
    source: string,
    languageKey: keyof typeof LANGUAGE_IDS,
    stdin?: string,
    options?: { cpu_time_limit?: string; memory_limit?: number }
  ) {
    // Simulate a successful run with mock output
    return {
      stdout: '42',
      stderr: '',
      status: { id: 3, description: 'Accepted' },
      time: 0.012,
      memory: 12000,
    } as const;
  }
}

export default new Judge0Service();
