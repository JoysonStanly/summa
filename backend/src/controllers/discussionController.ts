import { Response } from 'express';
import { AuthRequest } from '../types';
import { Discussion, Comment } from '../models/Discussion';

// @desc    Get discussions for a problem
// @route   GET /api/v1/discussions/problem/:problemId
// @access  Public
export const getProblemDiscussions = async (req: AuthRequest, res: Response) => {
  try {
    const { category, sortBy = 'recent' } = req.query;

    const filter: any = { problemId: req.params.problemId };
    if (category) filter.category = category;

    let sortOption: any = { createdAt: -1 };
    if (sortBy === 'popular') sortOption = { likes: -1, views: -1 };
    if (sortBy === 'solved') sortOption = { isSolved: -1, createdAt: -1 };

    const discussions = await Discussion.find(filter)
      .populate('userId', 'name email')
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort(sortOption)
      .limit(50);

    res.status(200).json({
      success: true,
      count: discussions.length,
      data: discussions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discussions',
      error: error.message,
    });
  }
};

// @desc    Get single discussion
// @route   GET /api/v1/discussions/:id
// @access  Public
export const getDiscussion = async (req: AuthRequest, res: Response) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('userId', 'name email')
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'name email' },
      });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    // Increment views
    discussion.views += 1;
    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discussion',
      error: error.message,
    });
  }
};

// @desc    Create discussion
// @route   POST /api/v1/discussions
// @access  Private
export const createDiscussion = async (req: AuthRequest, res: Response) => {
  try {
    req.body.userId = req.user?._id;

    const discussion = await Discussion.create(req.body);

    res.status(201).json({
      success: true,
      data: discussion,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create discussion',
      error: error.message,
    });
  }
};

// @desc    Update discussion
// @route   PUT /api/v1/discussions/:id
// @access  Private
export const updateDiscussion = async (req: AuthRequest, res: Response) => {
  try {
    let discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    // Check if user owns the discussion
    if (discussion.userId.toString() !== req.user?._id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this discussion',
      });
    }

    discussion = await Discussion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update discussion',
      error: error.message,
    });
  }
};

// @desc    Delete discussion
// @route   DELETE /api/v1/discussions/:id
// @access  Private
export const deleteDiscussion = async (req: AuthRequest, res: Response) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    // Check if user owns the discussion or is admin
    if (
      discussion.userId.toString() !== req.user?._id &&
      req.user?.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discussion',
      });
    }

    await discussion.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Discussion deleted',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete discussion',
      error: error.message,
    });
  }
};

// @desc    Like/Unlike discussion
// @route   POST /api/v1/discussions/:id/like
// @access  Private
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    const index = discussion.likes.indexOf(req.user?._id as any);

    if (index > -1) {
      // Unlike
      discussion.likes.splice(index, 1);
    } else {
      // Like
      discussion.likes.push(req.user?._id as any);
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      data: {
        likes: discussion.likes.length,
        isLiked: index === -1,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like',
      error: error.message,
    });
  }
};

// @desc    Add comment to discussion
// @route   POST /api/v1/discussions/:id/comments
// @access  Private
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    const comment = await Comment.create({
      userId: req.user?._id,
      content: req.body.content,
    });

    discussion.comments.push(comment._id);
    await discussion.save();

    await comment.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message,
    });
  }
};

// @desc    Get user discussions
// @route   GET /api/v1/discussions/user/:userId
// @access  Public
export const getUserDiscussions = async (req: AuthRequest, res: Response) => {
  try {
    const discussions = await Discussion.find({ userId: req.params.userId })
      .populate('problemId', 'title slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: discussions.length,
      data: discussions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user discussions',
      error: error.message,
    });
  }
};
