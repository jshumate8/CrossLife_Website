# CrossLife Website - Course Management Guide

## Overview

This website uses a dynamic course management system that allows you to easily add and manage Bible study courses. Courses are stored in JSON files for metadata and Markdown files for lesson content.

---

## File Structure

```
CrossLife_Website/
├── data/
│   └── resources.json          # Course metadata, tags, and categories
├── studies/
│   ├── genesis/
│   │   ├── course.json         # Genesis course lessons list
│   │   ├── lesson-01.md        # Lesson 1 content
│   │   ├── lesson-02.md        # Lesson 2 content
│   │   └── ...
│   ├── exodus/
│   │   ├── course.json
│   │   └── ...
│   └── ...
├── js/
│   └── resources.js            # Dynamic loading and filtering
├── study.html                  # Course listing page
├── course.html                 # Course overview page
└── lesson.html                 # Individual lesson viewer
```

---

## Adding a New Course

### Step 1: Add Course Metadata

Edit `data/resources.json` and add your course to the `courses` array:

```json
{
  "id": "john",
  "title": "Gospel of John: Believe and Live",
  "description": "An in-depth study through John's Gospel, focusing on the deity of Christ.",
  "type": "bible-study",
  "book": "John",
  "testament": "New Testament",
  "tags": ["Gospels", "Deity of Christ", "Evangelism", "Eternal Life"],
  "lessons": 21,
  "weeks": 21,
  "thumbnail": "images/studies/john-thumb.jpg",
  "level": "All Levels",
  "status": "in-progress"
}
```

**Field Definitions:**
- `id`: Unique identifier (lowercase, no spaces)
- `title`: Display name of the course
- `description`: Brief description (1-2 sentences)
- `type`: Usually "bible-study"
- `book`: Bible book name
- `testament`: "Old Testament" or "New Testament"
- `tags`: Array of relevant tags (see available tags in resources.json)
- `lessons`: Total number of lessons
- `weeks`: Recommended study duration
- `thumbnail`: Path to course image (optional, defaults to placeholder)
- `level`: "Beginner", "Intermediate", "Advanced", or "All Levels"
- `status`: "in-progress" (available), "planned" (coming soon), or "completed"

### Step 2: Create Course Folder

Create a new folder in `studies/` with your course ID:

```bash
mkdir studies/john
```

### Step 3: Create Course Lessons File

Create `studies/[course-id]/course.json`:

```json
{
  "courseId": "john",
  "title": "Gospel of John: Believe and Live",
  "book": "John",
  "lessons": [
    {
      "number": 1,
      "title": "The Word Became Flesh",
      "passage": "John 1:1-18",
      "file": "lesson-01.md"
    },
    {
      "number": 2,
      "title": "Jesus and John the Baptist",
      "passage": "John 1:19-34",
      "file": "lesson-02.md"
    }
  ]
}
```

**Lesson Object Fields:**
- `number`: Lesson number (sequential)
- `title`: Lesson title
- `passage`: Bible passage covered
- `file`: Markdown filename for this lesson

---

## Creating Lesson Content

### Lesson File Template

Create `studies/[course-id]/lesson-[number].md`:

```markdown
# Lesson 1: The Word Became Flesh

**Passage:** John 1:1-18  
**Memory Verse:** *"In the beginning was the Word, and the Word was with God, and the Word was God."* - John 1:1

---

## Introduction

Brief introduction to the lesson...

## Context and Background

### Historical Setting
- **Author:** John the Apostle
- **Date Written:** AD 85-95
- **Audience:** ...

---

## Verse-by-Verse Study

### John 1:1 - "In the beginning..."

#### Key Words and Phrases

**"In the beginning" (Ἐν ἀρχῇ, *en archē*)**
- Deliberate echo of Genesis 1:1
- ...

#### Theological Implications

1. **Christ's Eternality** - ...
2. **Christ's Deity** - ...

---

## Key Themes and Applications

### 1. The Deity of Christ
Explanation...

**Application:** How this affects our lives...

---

## Discussion Questions

1. What does "the Word" reveal about Jesus?
2. ...

---

## Cross References

- **Genesis 1:1** - Creation account
- **Colossians 1:15-17** - Christ as Creator
- ...

---

## Practical Application

### For Personal Study
1. ...
2. ...

### For Small Groups
1. ...
2. ...

---

*Next Lesson: [Next Lesson Title] (John 1:19-34)*
```

### Markdown Formatting Guide

The lesson viewer supports full Markdown:

- `# Heading 1` - Main sections
- `## Heading 2` - Subsections
- `### Heading 3` - Sub-subsections
- `**bold text**` - Bold
- `*italic text*` - Italic
- `> Blockquote` - For Bible verses or important quotes
- `- List item` - Unordered lists
- `1. List item` - Ordered lists
- `[Link text](url)` - Links
- `---` - Horizontal rule
- `` `code` `` - Inline code (for Greek/Hebrew words)

---

## Managing Tags

Tags help users find relevant courses. Available tag categories are defined in `data/resources.json`:

### Tag Categories:
- **testament**: Old Testament, New Testament
- **bibleSection**: Pentateuch, Gospels, Pauline Epistles, etc.
- **topics**: Creation, Covenant, Redemption, Grace, Prayer, etc.
- **themes**: God's Character, Sin and Redemption, Christian Living, etc.
- **studyType**: Book Study, Topical Study, Character Study, etc.

To add new tags, edit the `tags` object in `resources.json`:

```json
"tags": {
  "testament": ["Old Testament", "New Testament"],
  "topics": ["Creation", "Covenant", "Your New Topic", ...]
}
```

---

## Publishing Workflow

### Development
1. Edit files in your local repository
2. Test locally by opening HTML files in browser
3. Verify courses appear on study.html
4. Check that lessons display correctly

### Deployment
1. Commit your changes:
   ```bash
   git add -A
   git commit -m "Add [Course Name] lessons 1-5"
   git push origin main
   ```

2. Netlify automatically deploys changes (usually within 1-2 minutes)

---

## Tips and Best Practices

### Writing Lessons

1. **Be Consistent**: Use the same structure across all lessons
2. **Include Applications**: Every lesson should have practical takeaways
3. **Cross-Reference**: Link to related Scripture passages
4. **Discussion Questions**: Aim for 5-7 thought-provoking questions
5. **Length**: Target 2000-3000 words per lesson for depth without overwhelming

### File Naming

- Use lowercase for course IDs: `genesis`, `john`, `romans`
- Use padded numbers for lessons: `lesson-01.md`, `lesson-02.md`, not `lesson-1.md`
- Keep folder and file names simple (no spaces or special characters)

### Images

To add images to lessons:
1. Create an `images` folder in your course directory
2. Reference images in markdown: `![Description](images/diagram.jpg)`
3. Keep image file sizes reasonable (<500KB each)

### Course Status

- **in-progress**: Course is available, at least some lessons completed
- **planned**: Course announced but not yet available
- **completed**: All lessons finished and reviewed

Update status in `data/resources.json` as you progress.

---

## Troubleshooting

### Course Not Appearing on Study Page

1. Check `data/resources.json` syntax (valid JSON)
2. Ensure course `id` matches folder name in `studies/`
3. Clear browser cache and refresh
4. Check browser console (F12) for JavaScript errors

### Lesson Not Loading

1. Verify filename in `course.json` matches actual file
2. Check markdown file is saved in UTF-8 encoding
3. Ensure lesson number is correct
4. Look for errors in browser console

### Formatting Issues

1. Check markdown syntax (headings need space: `# Title` not `#Title`)
2. Ensure code blocks are properly closed
3. Verify special characters are properly escaped
4. Test markdown in an online editor first

---

## Advanced Features

### Custom Styling

To customize lesson appearance, edit the `<style>` section in `lesson.html`.

### Adding Video Embeds

In your markdown:

```markdown
## Video Teaching

<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

### Downloadable PDFs

Add a download link in your lesson markdown:

```markdown
[📥 Download PDF Version](files/genesis-lesson-01.pdf)
```

Store PDFs in a `files/` folder within your course directory.

---

## Getting Help

### Resources
- Markdown Guide: https://www.markdownguide.org/
- JSON Validator: https://jsonlint.com/
- Git Basics: https://git-scm.com/doc

### Questions?
Contact the web administrator for technical support with the course system.

---

## Quick Reference

### Adding a Lesson Checklist

- [ ] Create `lesson-XX.md` file
- [ ] Write lesson content in Markdown
- [ ] Add lesson entry to `course.json`
- [ ] Test lesson locally
- [ ] Commit and push to Git
- [ ] Verify on live site

### Creating a Course Checklist

- [ ] Add course metadata to `data/resources.json`
- [ ] Create `studies/[course-id]/` folder
- [ ] Create `course.json` with lessons list
- [ ] Write first 2-3 lessons
- [ ] Add course image (optional)
- [ ] Set status to "in-progress"
- [ ] Commit and deploy
- [ ] Continue adding lessons over time

---

*Last Updated: December 2025*
