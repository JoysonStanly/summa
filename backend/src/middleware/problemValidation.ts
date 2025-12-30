import { body, ValidationChain } from 'express-validator';

/**
 * Validation rules for creating/updating a problem
 */
export const problemValidation: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('statement')
    .trim()
    .notEmpty()
    .withMessage('Problem statement is required')
    .isLength({ min: 10 })
    .withMessage('Statement must be at least 10 characters'),

  body('difficulty')
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('testCases')
    .isArray({ min: 1 })
    .withMessage('At least one test case is required'),

  body('testCases.*.input')
    .isArray()
    .withMessage('Test case input must be an array'),

  body('testCases.*.output')
    .notEmpty()
    .withMessage('Test case output is required'),
];

/**
 * Validation rules for code submission
 */
export const submissionValidation: ValidationChain[] = [
  body('problemId')
    .notEmpty()
    .withMessage('Problem ID is required')
    .isMongoId()
    .withMessage('Invalid Problem ID'),

  body('code')
    .trim()
    .notEmpty()
    .withMessage('Code is required')
    .isLength({ min: 1 })
    .withMessage('Code cannot be empty'),

  body('language')
    .notEmpty()
    .withMessage('Language is required')
    .isIn(['javascript', 'python', 'cpp', 'java'])
    .withMessage('Language must be javascript, python, cpp, or java'),
];
