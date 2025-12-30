# Problem File Storage for GitHub

## Overview
Problems added by admin are automatically saved to JSON files organized by category. This allows you to:
- **Version control** problems with Git
- **Backup** problems outside the database
- **Seed** new environments easily
- **Share** problems across teams
- **Review** problem changes in pull requests

## Directory Structure
```
backend/
└── data/
    └── problems/
        ├── arrays.json          # All array problems
        ├── linked-lists.json    # All linked list problems
        ├── stacks.json          # All stack problems
        └── ...
```

## Automatic Export

### When Admin Adds/Updates a Problem
The system automatically exports to file:

```
Admin creates problem → Database saved → Auto-exported to JSON file
```

**Files saved to:** `backend/data/problems/{category}.json`

### Example: arrays.json
```json
[
  {
    "_id": "676c...",
    "title": "Two Sum",
    "slug": "two-sum",
    "category": "arrays",
    "difficulty": "easy",
    "statement": "Given an array...",
    "testCases": [...],
    "starterCode": {...},
    "constraints": [...],
    "hints": [...]
  },
  {
    "_id": "676d...",
    "title": "Three Sum",
    "slug": "three-sum",
    "category": "arrays",
    ...
  }
]
```

## Manual Export/Import

### Export All Problems to Files
Export all problems from database to JSON files:

```bash
cd backend
npm run export-problems
```

**Output:**
```
✅ Connected to database
📊 Found 24 problems in database

✅ Exported 8 problems to: backend/data/problems/arrays.json
✅ Exported 5 problems to: backend/data/problems/linked-lists.json
✅ Exported 6 problems to: backend/data/problems/stacks.json
✅ Exported 5 problems to: backend/data/problems/trees.json

✅ Export completed successfully!
```

### Import Problems from Files
Import problems from JSON files to database:

```bash
cd backend
npm run import-problems
```

**Output:**
```
✅ Connected to database
📂 Found 4 problem files

📄 Processing: arrays.json (Category: arrays)
  ✅ Imported: Two Sum
  ✅ Updated: Three Sum (already exists)
  ✅ Imported: Container With Most Water
  ...

📊 Import Summary:
  • New problems imported: 12
  • Problems updated: 8
  • Errors: 0
```

## Git Workflow

### 1. Initial Setup
After adding problems via admin panel:

```bash
cd backend
npm run export-problems  # Export current problems to files
git add data/problems/
git commit -m "Add initial DSA problems"
git push
```

### 2. Team Workflow

**Developer A** adds problems:
```bash
# Problems auto-exported when added via admin
git add data/problems/
git commit -m "Add new array problems"
git push
```

**Developer B** syncs:
```bash
git pull
cd backend
npm run import-problems  # Import new problems to local DB
```

### 3. Seeding New Environment

When setting up a new environment:

```bash
# Clone repo
git clone <repo-url>
cd backend

# Install dependencies
npm install

# Start database
# ... (start MongoDB)

# Import all problems from files
npm run import-problems
```

## How It Works

### Auto-Export Flow

1. **Admin creates/updates problem** via admin panel
2. **Controller saves to database** (MongoDB)
3. **Controller calls export function** (`exportProblemToFile`)
4. **Export function:**
   - Reads existing category file (e.g., `arrays.json`)
   - Updates or adds the problem
   - Sorts problems alphabetically
   - Writes back to file with pretty formatting

### Problem Deletion

When admin deletes a problem:
1. Problem removed from database
2. Problem removed from its category JSON file
3. If category file becomes empty, file is deleted

## Benefits

### Version Control
See exactly what changed:
```diff
# arrays.json
  {
    "title": "Two Sum",
-   "difficulty": "medium",
+   "difficulty": "easy",
    "statement": "..."
  }
```

### Code Reviews
Team can review problems in pull requests before merging.

### Disaster Recovery
If database crashes, restore from JSON files:
```bash
npm run import-problems
```

### Environment Setup
New developers can quickly seed their local database:
```bash
git clone repo
npm install
npm run import-problems
```

### Documentation
JSON files serve as documentation of all problems in the system.

## File Management

### Organizing Problems
Problems are organized by `category` field:
- `category: "arrays"` → `arrays.json`
- `category: "linked-lists"` → `linked-lists.json`
- `category: "trees"` → `trees.json`

### File Format
- Pretty-printed JSON (2-space indent)
- Sorted alphabetically by title
- Includes all problem fields (except internal MongoDB fields)

### File Location
```
backend/data/problems/
```

This directory is tracked by Git (not in .gitignore).

## Troubleshooting

### Problem not exported?
Check backend logs for export errors. Non-critical errors are logged but don't stop problem creation.

### Import fails?
- Verify JSON file format is valid
- Check database connection
- Review error messages for specific problems

### Merge conflicts?
If two developers add problems to the same category:
1. Manually merge the JSON files
2. Or run `npm run export-problems` after resolving

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run export-problems` | Export all problems from DB to files |
| `npm run import-problems` | Import all problems from files to DB |

## Related Files

- `/backend/src/utils/problemExporter.ts` - Export utility functions
- `/backend/export-problems.ts` - Manual export script
- `/backend/import-problems.ts` - Manual import script
- `/backend/src/controllers/problemController.ts` - Auto-export on CRUD
- `/backend/data/problems/` - Problem JSON files directory

## Best Practices

1. **Regular Commits**: Commit problem files frequently
2. **Pull Before Adding**: Always pull latest before adding problems
3. **Descriptive Commits**: Use clear commit messages for problem changes
4. **Review Changes**: Check diffs before committing problem files
5. **Backup**: Keep problem files in version control as backup

## Future Enhancements

- **Auto-sync on startup**: Import problems when server starts
- **Webhooks**: Trigger export on Git push
- **Versioning**: Track problem version history
- **Diff tool**: Visual diff for problem changes
- **Validation**: Validate JSON files before import
