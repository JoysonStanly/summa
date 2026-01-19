import { Response } from 'express';
import { AuthRequest } from '../types';
import Submission from '../models/Submission';
import Problem from '../models/Problem';
import Progress from '../models/Progress';
import User from '../models/User';
import judge0Service from '../services/judge0Service';
import { updateUserStreak, awardCoins } from '../utils/streakHelper';
import { loadProblemJSON } from '../utils/jsonLoader';

/**
 * @desc    Submit code solution
 * @route   POST /api/v1/submissions
 * @access  Private
 */
export const submitSolution = async (req: AuthRequest, res: Response): Promise<void> => {
  try {

    const { problemId, code, language } = req.body;
    const userId = req.user?._id;

    // Validate code and language
    if (!code || typeof code !== 'string' || code.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Submitted code is empty. Please provide a valid solution.',
      });
      return;
    }
    const validLanguages = ['javascript', 'python', 'cpp', 'java'];
    if (!language || !validLanguages.includes(language)) {
      res.status(400).json({
        success: false,
        message: 'Invalid language selected. Please choose a supported language.',
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // Get problem metadata
    const problem = await Problem.findById(problemId);

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
      return;
    }

    // Load test cases from JSON file
    let jsonContent;
    try {
      jsonContent = loadProblemJSON(problem.contentPath);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Problem content not available',
      });
      return;
    }

    const testCases = jsonContent.testCases;

    // Run code against all test cases
    const testResults = [];
    let allPassed = true;
    let totalTime = 0;
    let totalMemory = 0;

    for (const testCase of testCases) {
      const input = testCase.input.join('\n');
      const expectedOutput = testCase.output;

      const exec = await judge0Service.runByLanguageKey(
        code,
        language as any,
        input
      );

      const normalize = (s?: string) => (s ?? '').replace(/\r\n/g, '\n').trim();
      const expectedNorm = normalize(expectedOutput);
      const actualNorm = normalize(exec.stdout);
      // Removed verbose console logs for test case mismatches
      const passed = exec.stderr ? false : actualNorm === expectedNorm;

      testResults.push({
        passed,
        input: testCase.isHidden ? undefined : input,
        expected: testCase.isHidden ? undefined : expectedOutput,
        actual: testCase.isHidden ? undefined : actualNorm,
        error: exec.stderr || undefined,
        executionTime: exec.time,
      });

      if (!passed) {
        allPassed = false;
      }

      totalTime += exec.time;
      totalMemory = Math.max(totalMemory, exec.memory);
    }

    // Determine submission status
    const status = allPassed ? 'accepted' : 'rejected';

    // Create submission
    const submission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status,
      testResults,
      timeTaken: Math.round(totalTime),
      memory: Math.round(totalMemory / 1024), // Convert to MB
      attempts: 1,
    });

    // Update progress
    let progress = await Progress.findOne({ userId, problemId });
    const wasNotCompleted = !progress || !progress.completed;

    if (!progress) {
      progress = await Progress.create({
        userId,
        problemId,
        completed: allPassed,
        attempts: 1,
        submissions: [submission._id],
      });
    } else {
      progress.attempts += 1;
      progress.submissions.push(submission._id);
      if (allPassed && !progress.completed) {
        progress.completed = true;
      }
      progress.lastAttemptDate = new Date();
      await progress.save();
    }

    // If accepted for first time (check before progress was updated)
    if (allPassed && wasNotCompleted) {
      // Add to user's completed problems
      await User.findByIdAndUpdate(userId, {
        $addToSet: { completedProblems: problemId },
      });

      // Award coins based on difficulty
      const coinsMap = { easy: 10, medium: 20, hard: 30 };
      await awardCoins(userId, coinsMap[problem.difficulty]);

      // Update streak
      await updateUserStreak(userId);

      // Update problem stats
      problem.submissionCount += 1;
      problem.acceptanceRate = Math.round(
        ((problem.acceptanceRate * (problem.submissionCount - 1) + 100) /
          problem.submissionCount)
      );
      await problem.save();
    } else if (!allPassed) {
      // Update problem stats for failed submission
      problem.submissionCount += 1;
      problem.acceptanceRate = Math.round(
        (problem.acceptanceRate * (problem.submissionCount - 1)) /
        problem.submissionCount
      );
      await problem.save();
    }

    res.status(201).json({
      success: true,
      message: allPassed ? 'All test cases passed!' : 'Some test cases failed',
      data: submission,
    });
  } catch (error: any) {
    console.error('Submit solution error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting solution',
      error: error.message,
    });
  }
};

/**
 * @desc    Get submissions by user
 * @route   GET /api/v1/submissions/user/:userId
 * @access  Private
 */
export const getUserSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const submissions = await Submission.find({ userId })
      .populate('problemId', 'title difficulty category')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error: any) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message,
    });
  }
};

/**
 * @desc    Get submissions by problem
 * @route   GET /api/v1/submissions/problem/:problemId
 * @access  Private
 */
export const getProblemSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { problemId } = req.params;
    const userId = req.user?._id;

    const submissions = await Submission.find({
      problemId,
      userId, // Only show user's own submissions
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error: any) {
    console.error('Get problem submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single submission by ID
 * @route   GET /api/v1/submissions/:id
 * @access  Private
 */
export const getSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problemId', 'title difficulty')
      .populate('userId', 'name email');

    if (!submission) {
      res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
      return;
    }

    // Only allow user to see their own submission (or admin)
    if (
      submission.userId._id.toString() !== req.user?._id &&
      req.user?.role !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this submission',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error: any) {
    console.error('Get submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission',
      error: error.message,
    });
  }
};
