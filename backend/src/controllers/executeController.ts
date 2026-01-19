import { Request, Response } from 'express';
import judge0Service, { LANGUAGE_IDS } from '../services/judge0Service';

/**
 * Execute a single code snippet synchronously via local Judge0
 * @route POST /api/v1/execute
 * @body { language: 'javascript'|'python'|'cpp'|'java', source: string, input?: string }
 */
export const execute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { language, source, input } = req.body as {
      language?: keyof typeof LANGUAGE_IDS | string;
      source?: string;
      input?: string;
    };

    if (!language || !source) {
      res.status(400).json({
        success: false,
        message: 'language and source are required',
      });
      return;
    }

    const langKey = String(language) as keyof typeof LANGUAGE_IDS;
    if (!LANGUAGE_IDS[langKey]) {
      res.status(400).json({
        success: false,
        message: `Unsupported language: ${language}`,
        supported: Object.keys(LANGUAGE_IDS),
      });
      return;
    }

    const result = await judge0Service.runByLanguageKey(source, langKey, input);

    res.status(200).json({
      success: true,
      data: {
        stdout: result.stdout,
        stderr: result.stderr,
        status: result.status.description,
        statusId: result.status.id,
        time: result.time,
        memory: result.memory,
      },
    });
  } catch (error: any) {
    console.error('Execute error:', error);
    res.status(500).json({
      success: false,
      message: 'Execution failed',
      error: error.message || 'Unknown error',
    });
  }
};
