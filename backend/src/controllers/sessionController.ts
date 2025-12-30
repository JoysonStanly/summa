import { Response } from 'express';
import { AuthRequest } from '../types';
import Session from '../models/Session';

// @desc    Get all sessions
// @route   GET /api/v1/sessions
// @access  Public
export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, instructor, upcoming } = req.query;

    const filter: any = {};
    if (category) filter.category = category;
    if (instructor) filter.instructor = instructor;
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }

    const sessions = await Session.find(filter)
      .populate('instructor', 'name email')
      .populate('participants', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
      error: error.message,
    });
  }
};

// @desc    Get single session
// @route   GET /api/v1/sessions/:id
// @access  Public
export const getSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('participants', 'name email');

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session',
      error: error.message,
    });
  }
};

// @desc    Create session
// @route   POST /api/v1/sessions
// @access  Private (Instructor/Admin)
export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    req.body.instructor = req.user?._id;

    const session = await Session.create(req.body);

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create session',
      error: error.message,
    });
  }
};

// @desc    Update session
// @route   PUT /api/v1/sessions/:id
// @access  Private (Instructor/Admin)
export const updateSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let session = await Session.findById(req.params.id);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found',
      });
      return;
    }

    // Check if user is instructor or admin
    if (
      session.instructor.toString() !== req.user?._id &&
      req.user?.role !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this session',
      });
      return;
    }

    session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update session',
      error: error.message,
    });
  }
};

// @desc    Delete session
// @route   DELETE /api/v1/sessions/:id
// @access  Private (Instructor/Admin)
export const deleteSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found',
      });
      return;
    }

    // Check if user is instructor or admin
    if (
      session.instructor.toString() !== req.user?._id &&
      req.user?.role !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this session',
      });
      return;
    }

    await session.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete session',
      error: error.message,
    });
  }
};

// @desc    Register for session
// @route   POST /api/v1/sessions/:id/register
// @access  Private (Student)
export const registerForSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found',
      });
      return;
    }

    // Check if already registered
    if (req.user?._id && session.participants.includes(req.user._id as any)) {
      res.status(400).json({
        success: false,
        message: 'Already registered for this session',
      });
      return;
    }

    // Check if session is full
    if (session.participants.length >= session.maxParticipants) {
      res.status(400).json({
        success: false,
        message: 'Session is full',
      });
      return;
    }

    if (req.user?._id) {
      session.participants.push(req.user._id as any);
    }
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for session',
      data: session,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to register for session',
      error: error.message,
    });
  }
};

// @desc    Unregister from session
// @route   POST /api/v1/sessions/:id/unregister
// @access  Private (Student)
export const unregisterFromSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found',
      });
      return;
    }

    // Check if registered
    const index = req.user?._id ? session.participants.indexOf(req.user._id as any) : -1;
    if (index === -1) {
      res.status(400).json({
        success: false,
        message: 'Not registered for this session',
      });
      return;
    }

    session.participants.splice(index, 1);
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from session',
      data: session,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to unregister from session',
      error: error.message,
    });
  }
};
