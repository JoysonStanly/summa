import { Response } from 'express';
import { AuthRequest } from '../types';
import BugReport from '../models/BugReport';

// @desc    Get all bug reports
// @route   GET /api/v1/bugs
// @access  Private (Admin)
export const getBugReports = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, reportedBy } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (reportedBy) filter.reportedBy = reportedBy;

    const bugs = await BugReport.find(filter)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('problemId', 'title slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bug reports',
      error: error.message,
    });
  }
};

// @desc    Get single bug report
// @route   GET /api/v1/bugs/:id
// @access  Private
export const getBugReport = async (req: AuthRequest, res: Response) => {
  try {
    const bug = await BugReport.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('problemId', 'title slug');

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bug,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bug report',
      error: error.message,
    });
  }
};

// @desc    Create bug report
// @route   POST /api/v1/bugs
// @access  Private
export const createBugReport = async (req: AuthRequest, res: Response) => {
  try {
    req.body.reportedBy = req.user?._id;

    const bug = await BugReport.create(req.body);

    res.status(201).json({
      success: true,
      data: bug,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create bug report',
      error: error.message,
    });
  }
};

// @desc    Update bug report
// @route   PUT /api/v1/bugs/:id
// @access  Private (Admin)
export const updateBugReport = async (req: AuthRequest, res: Response) => {
  try {
    let bug = await BugReport.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found',
      });
    }

    bug = await BugReport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: bug,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update bug report',
      error: error.message,
    });
  }
};

// @desc    Delete bug report
// @route   DELETE /api/v1/bugs/:id
// @access  Private (Admin)
export const deleteBugReport = async (req: AuthRequest, res: Response) => {
  try {
    const bug = await BugReport.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found',
      });
    }

    await bug.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bug report deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete bug report',
      error: error.message,
    });
  }
};

// @desc    Get user's bug reports
// @route   GET /api/v1/bugs/my-bugs
// @access  Private
export const getMyBugReports = async (req: AuthRequest, res: Response) => {
  try {
    const bugs = await BugReport.find({ reportedBy: req.user?._id })
      .populate('assignedTo', 'name email')
      .populate('problemId', 'title slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your bug reports',
      error: error.message,
    });
  }
};

// @desc    Assign bug to user
// @route   PUT /api/v1/bugs/:id/assign
// @access  Private (Admin)
export const assignBug = async (req: AuthRequest, res: Response) => {
  try {
    const { assignedTo } = req.body;

    const bug = await BugReport.findByIdAndUpdate(
      req.params.id,
      { assignedTo, status: 'in-progress' },
      { new: true, runValidators: true }
    );

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bug,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to assign bug',
      error: error.message,
    });
  }
};
