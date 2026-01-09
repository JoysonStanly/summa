# DSA Problems Data Structure

This folder contains all DSA problem JSON files organized by topic and subtopic.

## Folder Structure

```
data/
└── DSA/
    ├── Arrays/
    │   ├── fundamentals/
    │   │   ├── linear-search.json
    │   │   └── two-sum.json
    │   ├── FAQ-easy/
    │   ├── FAQ-medium/
    │   └── FAQ-hard/
    ├── Strings/
    │   ├── fundamentals/
    │   └── FAQ-easy/
    ├── LinkedLists/
    │   ├── fundamentals/
    │   └── ...
    ├── Trees/
    │   ├── fundamentals/
    │   └── ...
    └── Graphs/
        ├── fundamentals/
        └── ...
```

## Content Path Format

When adding a problem via the admin panel, use this format for `contentPath`:

```
data/DSA/{Topic}/{Subtopic}/{problem-slug}.json
```

### Examples:
- `data/DSA/Arrays/fundamentals/linear-search.json`
- `data/DSA/Arrays/FAQ-easy/best-time-to-buy-sell-stock.json`
- `data/DSA/Strings/fundamentals/reverse-string.json`
- `data/DSA/Trees/fundamentals/binary-tree-traversal.json`

## JSON File Structure

Each problem JSON file should contain:

```json
{
  "meta": {
    "version": "1.0",
    "lastModified": "2026-01-02T10:00:00Z",
    "author": "admin@studyio.com"
  },
  "problem": {
    "statement": "Problem description...",
    "examples": [...],
    "constraints": [...],
    "hints": [...]
  },
  "editorial": {
    "sections": [...],
    "solutions": {...},
    "videoUrl": "...",
    "dryRunImages": [...]
  },
  "starterCode": {
    "javascript": "...",
    "python": "...",
    "cpp": "...",
    "java": "...",
    "typescript": "..."
  },
  "testCases": [...]
}
```

## Notes

- Problem metadata (title, difficulty, coins, tags) is stored in MongoDB database
- Problem content (statement, examples, testCases, etc.) is stored in JSON files
- The `contentPath` in the database links to the JSON file location
