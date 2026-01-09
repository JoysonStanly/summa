import { Response } from 'express';
import { AuthRequest } from '../types';
import Question from '../models/Question';

// @desc    Get all questions for a session
// @route   GET /api/v1/sessions/:sessionId/questions
// @access  Public
export const getQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const questions = await Question.find({ session: req.params.sessionId })
      .populate('user', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message,
    });
  }
};

// @desc    Create a question
// @route   POST /api/v1/sessions/:sessionId/questions
// @access  Private
export const createQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const question = await Question.create({
      session: req.params.sessionId,
      user: req.user._id,
      text: req.body.text,
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedQuestion,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create question',
      error: error.message,
    });
  }
};

// @desc    Update a question
// @route   PUT /api/v1/questions/:id
// @access  Private
export const updateQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
      return;
    }

    // Check if user is the question owner
    if (question.user.toString() !== req.user?._id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this question',
      });
      return;
    }

    question = await Question.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      {
        new: true,
        runValidators: true,
      }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update question',
      error: error.message,
    });
  }
};

// @desc    Delete a question
// @route   DELETE /api/v1/questions/:id
// @access  Private
export const deleteQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
      return;
    }

    // Check if user is the question owner or admin
    if (
      question.user.toString() !== req.user?._id &&
      req.user?.role !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question',
      });
      return;
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message,
    });
  }
};
