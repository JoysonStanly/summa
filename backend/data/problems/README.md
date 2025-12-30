# Problems Directory

This directory contains JSON files for all problems, organized by category.

## Purpose
- **Version control**: Track problem changes in Git
- **Backup**: Problems stored as files
- **Seeding**: Import problems to new environments
- **Sharing**: Share problems across teams

## Auto-Export
Problems are automatically saved here when admin creates/updates them via the admin panel.

## File Structure
Each file contains all problems for a specific category:
- `arrays.json` - Array problems
- `linked-lists.json` - Linked list problems
- `stacks.json` - Stack & queue problems
- `trees.json` - Tree problems
- etc.

## Commands
```bash
# Export all problems from database to files
npm run export-problems

# Import all problems from files to database
npm run import-problems
```

See `/backend/PROBLEM-FILE-STORAGE.md` for full documentation.
