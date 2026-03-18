import "dotenv/config";
import { createDb } from "./client.js";
import { users, repos, skills } from "./schema.js";
import { eq, and } from "drizzle-orm";

const CURATED_SKILLS: Array<{
  slug: string;
  name: string;
  description: string;
  tags: string[];
  readme: string;
}> = [
  // ==========================================
  // OFFICE & PRODUCTIVITY
  // ==========================================
  {
    slug: "excel-formulas",
    name: "Excel Formulas & Spreadsheets",
    description:
      "Create Excel formulas, pivot tables, VLOOKUP/XLOOKUP, conditional formatting, charts, and macros. Use when building spreadsheets, analyzing data, creating reports, or automating repetitive Excel tasks.",
    tags: ["productivity", "business", "writing"],
    readme: `# Excel Formulas & Spreadsheets

Help users create, debug, and optimize Excel formulas and spreadsheet workflows.

## When to Use
- User needs help writing or debugging Excel formulas
- Creating pivot tables, charts, or dashboards
- Conditional formatting rules
- Data cleanup and transformation
- Building Excel macros or VBA scripts
- Converting between Excel and other formats

## When NOT to Use
- Google Sheets-specific features (use google-sheets skill)
- Database queries (use SQL tools)
- Statistical analysis requiring R/Python (use data science tools)

## Step-by-Step Instructions

### 1. Understand the Data Layout
Ask the user:
- What columns/rows do they have?
- What is the expected output?
- Are there multiple sheets involved?

### 2. Write the Formula
Always explain what each part does. Prefer modern functions when available.

### Common Formula Patterns

#### Lookup & Reference
\`\`\`
=VLOOKUP(lookup_value, table_array, col_index, FALSE)
=XLOOKUP(lookup_value, lookup_array, return_array, "Not Found")
=INDEX(array, MATCH(lookup_value, lookup_range, 0))
\`\`\`

**When to use which:**
- XLOOKUP: Modern Excel (Microsoft 365). Preferred — can look left, returns exact match by default
- VLOOKUP: Legacy compatibility. Only looks right. Always use FALSE for exact match
- INDEX/MATCH: Works everywhere, most flexible, can look in any direction

#### Conditional Calculations
\`\`\`
=SUMIF(range, criteria, sum_range)
=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2)
=COUNTIF(range, criteria)
=AVERAGEIF(range, criteria, average_range)
\`\`\`

#### Text Functions
\`\`\`
=TRIM(A1)                          -- Remove extra spaces
=PROPER(A1)                        -- Title Case
=LEFT(A1, 5)                       -- First 5 characters
=TEXTJOIN(", ", TRUE, A1:A10)      -- Join with comma
=SUBSTITUTE(A1, "old", "new")      -- Replace text
\`\`\`

#### Date Functions
\`\`\`
=TODAY()                           -- Current date
=DATEDIF(start, end, "M")         -- Months between dates
=EOMONTH(A1, 0)                   -- End of month
=NETWORKDAYS(start, end)          -- Working days between
=TEXT(A1, "MMMM DD, YYYY")        -- Format date as text
\`\`\`

#### Data Validation
\`\`\`
=IFERROR(formula, "Error message")
=IF(AND(A1>0, A1<100), "Valid", "Invalid")
=ISBLANK(A1)
\`\`\`

### Pivot Table Setup
1. Select your data range (include headers)
2. Insert → Pivot Table
3. Drag fields:
   - **Rows:** Categories you want to group by
   - **Columns:** Secondary grouping (optional)
   - **Values:** Numbers to summarize (Sum, Count, Average)
   - **Filters:** Fields to filter the entire table

### Conditional Formatting Rules
Common patterns:
- Highlight cells > value: Home → Conditional Formatting → Highlight Cell Rules
- Color scales for ranges: Home → Conditional Formatting → Color Scales
- Data bars for visual comparison: Home → Conditional Formatting → Data Bars
- Custom formula: =AND($B2>1000, $C2="Complete") → apply green fill

### Chart Best Practices
- **Bar/Column:** Comparing categories
- **Line:** Trends over time
- **Pie:** Parts of a whole (use sparingly, max 6 slices)
- **Scatter:** Relationships between two variables
- Always add: title, axis labels, data labels where helpful

### VBA Macro Basics
\`\`\`vba
Sub FormatReport()
    ' Select data range
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    ' Auto-fit columns
    ws.Cells.EntireColumn.AutoFit
    
    ' Bold headers
    ws.Range("A1:Z1").Font.Bold = True
    
    ' Add borders
    ws.UsedRange.Borders.LineStyle = xlContinuous
    
    MsgBox "Report formatted!"
End Sub
\`\`\`

## Common Mistakes to Avoid
- Using VLOOKUP without FALSE (exact match) — gets wrong results
- Circular references — formula refers to its own cell
- Not anchoring references with $ (e.g., $A$1) when copying formulas
- Mixing data types in a column (numbers stored as text)
- Not using tables (Ctrl+T) — makes formulas auto-expand

## Templates

### Monthly Budget Tracker
| Category | Budget | Actual | Variance | Status |
|----------|--------|--------|----------|--------|
| Rent | 2000 | =actual | =Budget-Actual | =IF(D2>0,"Under","Over") |

### Sales Report
| Rep | Q1 | Q2 | Q3 | Q4 | Total | % of Target |
|-----|----|----|----|----|-------|-------------|
| Name | amt | amt | amt | amt | =SUM(B2:E2) | =F2/$G$1 |
`,
  },
  {
    slug: "powerpoint-presentations",
    name: "PowerPoint Presentations",
    description:
      "Design professional PowerPoint slides with layouts, speaker notes, animations, and templates. Use when creating pitch decks, business presentations, training materials, or any slide-based content.",
    tags: ["productivity", "business", "writing"],
    readme: `# PowerPoint Presentations

Help users create professional, engaging presentations.

## When to Use
- Creating business presentations or pitch decks
- Designing slide layouts and templates
- Writing speaker notes
- Planning presentation structure and flow
- Converting content into slide format

## When NOT to Use
- Creating documents (use word-documents)
- Making infographics for print (use design tools)
- Video editing or motion graphics

## Step-by-Step Instructions

### 1. Plan the Structure
Before creating slides, outline the flow:

**Standard Business Presentation (10-15 slides):**
1. Title slide — company/topic, presenter name, date
2. Agenda/Overview — what you'll cover
3. Problem/Opportunity — why this matters
4. Solution/Proposal — your approach
5. Key Details (3-5 slides) — supporting content
6. Timeline/Roadmap — when things happen
7. Budget/Resources — what's needed
8. Team/About — who's involved
9. Next Steps — clear action items
10. Q&A / Thank You — contact info

**Pitch Deck (10 slides):**
1. Title & tagline
2. Problem
3. Solution
4. Market size
5. Product/demo
6. Business model
7. Traction/metrics
8. Team
9. Financial ask
10. Contact/CTA

### 2. Design Principles

**The 6x6 Rule:** No more than 6 bullet points per slide, no more than 6 words per bullet.

**Visual Hierarchy:**
- Title: 28-36pt, bold
- Subtitle: 20-24pt
- Body: 18-22pt
- Captions: 14-16pt

**Color:**
- Use 2-3 brand colors maximum
- Dark text on light background (or vice versa)
- Use accent color for emphasis only
- Ensure sufficient contrast for readability

**Layout Patterns:**
- **Title + Content:** Most common, text on left or right
- **Two Column:** Compare/contrast, before/after
- **Full Image + Text Overlay:** High impact, use sparingly
- **Data Slide:** One chart/graph with key takeaway as title
- **Quote Slide:** Large quote with attribution

### 3. Write Compelling Content

**Slide Titles Should Be Takeaways, Not Topics:**
- ❌ "Q3 Revenue"
- ✅ "Q3 Revenue Grew 34% Year-over-Year"

**Bullet Points — Use Parallel Structure:**
- ❌ "We increased sales. Marketing was improved. Cost reduction."
- ✅ "Increased sales by 20%. Improved marketing ROI. Reduced costs by 15%."

### 4. Speaker Notes
Write notes for each slide:
- Key talking points (not a script)
- Transition to next slide
- Anticipated questions
- Data sources/references
- Timing (aim for 1-2 minutes per slide)

### 5. Animations & Transitions
**Keep it simple:**
- Use "Appear" or "Fade" for bullet reveals
- Use "Morph" transition between similar slides (powerful & professional)
- Avoid: spinning, bouncing, flying animations
- Consistent transitions throughout (pick one)

## Slide Templates by Type

### Data/Metrics Slide
**Title:** [Key Insight as a Sentence]
- Hero number (large, bold): the main metric
- 2-3 supporting data points
- Simple chart if needed
- Source citation in footer

### Timeline/Roadmap Slide
**Title:** Project Roadmap
- Horizontal timeline with 4-6 milestones
- Current position clearly marked
- Color-code: completed (green), current (blue), upcoming (gray)

### Comparison Slide
**Title:** Why [Our Solution] vs [Alternative]
| Feature | Us | Them |
|---------|-----|------|
| Key differentiator | ✅ | ❌ |

### Team Slide
- Headshots in circles
- Name, title, 1-line credential
- Grid layout (2x2 or 3x3)

## Common Mistakes to Avoid
- Too much text on slides (slides support your talk, they don't replace it)
- Inconsistent fonts/colors/sizes
- Low-resolution images
- Reading slides word-for-word
- No clear call-to-action on final slide
- Forgetting to check spelling and alignment
- Not testing on the actual presentation screen/projector

## Pro Tips
- **10/20/30 Rule (Guy Kawasaki):** 10 slides, 20 minutes, 30pt minimum font
- Use slide master for consistent branding
- Export to PDF as backup
- Embed fonts if sharing the file
- Use Presenter View to see notes while presenting
`,
  },
  {
    slug: "word-documents",
    name: "Word Documents & Formatting",
    description:
      "Format Word documents with styles, headers, table of contents, mail merge, and track changes. Use when creating professional documents, reports, proposals, or templates in Microsoft Word.",
    tags: ["productivity", "business", "writing"],
    readme: `# Word Documents & Formatting

Help users create professional, well-formatted Word documents.

## When to Use
- Formatting business documents, reports, proposals
- Setting up styles, headers/footers, page numbers
- Creating table of contents
- Mail merge for personalized letters/emails
- Track changes and document review
- Creating reusable templates

## When NOT to Use
- Spreadsheet work (use excel-formulas)
- Slide presentations (use powerpoint-presentations)
- Web content or markdown (use appropriate tools)

## Step-by-Step Instructions

### 1. Set Up the Document

**Page Setup:**
- Margins: Normal (1 inch) for most documents; Narrow (0.5 inch) for dense reports
- Orientation: Portrait for text-heavy; Landscape for wide tables
- Paper size: Letter (US) or A4 (international)

**Use Styles (Critical!):**
- Heading 1, Heading 2, Heading 3 for document structure
- Normal for body text
- Quote for block quotes
- List Paragraph for bullet/numbered lists
- This enables: automatic TOC, navigation pane, consistent formatting

### 2. Document Structure Templates

**Business Report:**
1. Cover page (Insert → Cover Page)
2. Table of Contents (References → Table of Contents)
3. Executive Summary
4. Introduction / Background
5. Findings / Analysis (with subheadings)
6. Recommendations
7. Appendices

**Proposal:**
1. Cover page
2. Executive Summary
3. Problem Statement
4. Proposed Solution
5. Scope of Work
6. Timeline
7. Budget
8. Team Qualifications
9. Terms & Conditions
10. Appendices

### 3. Formatting Best Practices

**Fonts:**
- Professional: Calibri, Garamond, Georgia, Arial
- Headings: 14-16pt bold
- Body: 11-12pt
- Use ONE font family throughout (or two max: one for headings, one for body)

**Spacing:**
- Line spacing: 1.15 or 1.5 for readability
- Space after paragraphs: 6-12pt (instead of double-entering)
- Don't use manual spacing (Enter key) — use paragraph spacing settings

**Headers & Footers:**
- Insert → Header/Footer
- Include: document title, page numbers, date, company logo
- Different first page: check "Different First Page" in Header & Footer Tools

### 4. Table of Contents
1. Apply Heading styles to all section titles
2. Place cursor where TOC should appear
3. References → Table of Contents → choose style
4. Right-click TOC → Update Field → Update Entire Table (when content changes)

### 5. Track Changes & Review
- Review → Track Changes (toggle on)
- Accept/Reject individual changes or all at once
- Add comments: highlight text → Review → New Comment
- Compare documents: Review → Compare → select original and revised

### 6. Mail Merge
1. Mailings → Start Mail Merge → choose type (Letters, Envelopes, Labels, Email)
2. Select Recipients → Use Existing List (Excel file works well)
3. Insert Merge Fields: «FirstName», «Address», etc.
4. Preview Results → check formatting
5. Finish & Merge → Print or create individual documents

### 7. Templates
- Save as .dotx (Word Template) for reuse
- Include: styles, headers/footers, placeholder text, formatting
- Store in: File → Options → Save → Default personal templates location

## Common Formatting Fixes

### Fix Inconsistent Formatting
1. Select all text (Ctrl+A)
2. Clear formatting (Ctrl+Space for font, Ctrl+Q for paragraph)
3. Re-apply styles from the Styles pane

### Remove Extra Blank Lines
- Find & Replace (Ctrl+H)
- Find: ^p^p (two paragraph marks)
- Replace: ^p (one paragraph mark)
- Click Replace All (may need to run multiple times)

### Fix Numbered Lists
- If numbering restarts unexpectedly: right-click → Continue Numbering
- If numbering won't restart: right-click → Restart at 1

## Common Mistakes to Avoid
- Using spaces/tabs for alignment (use tab stops or tables instead)
- Manual page breaks everywhere (use "Page break before" in paragraph settings)
- Not using styles (makes TOC and formatting changes impossible)
- Embedding huge images at full resolution (compress: Format → Compress Pictures)
- Not using section breaks for different headers/footers or page orientations
`,
  },
  {
    slug: "google-sheets",
    name: "Google Sheets",
    description:
      "Google Sheets formulas, Apps Script automation, data validation, IMPORTRANGE, and collaboration features. Use when working with Google Sheets specifically, including shared spreadsheets and Google Workspace integration.",
    tags: ["productivity", "business"],
    readme: `# Google Sheets

Help users work effectively with Google Sheets, including formulas, automation, and collaboration.

## When to Use
- Google Sheets-specific formulas and features
- Apps Script automation
- Shared/collaborative spreadsheets
- Importing data between sheets (IMPORTRANGE)
- Google Forms integration
- Data validation and protection

## When NOT to Use
- Microsoft Excel-specific features like VBA macros (use excel-formulas)
- Complex data analysis requiring Python/R

## Key Formulas (Google Sheets Specific)

### IMPORTRANGE — Pull Data Between Spreadsheets
\`\`\`
=IMPORTRANGE("spreadsheet_url", "Sheet1!A1:D100")
\`\`\`
- First time: click the cell and "Allow access"
- Wrap in IFERROR for clean errors: =IFERROR(IMPORTRANGE(...), "Loading...")

### QUERY — SQL-like Data Filtering
\`\`\`
=QUERY(A1:D100, "SELECT A, B, SUM(D) WHERE C = 'Active' GROUP BY A, B ORDER BY SUM(D) DESC", 1)
\`\`\`
- Column references: A, B, C (based on position in data range)
- Header row count is the last parameter
- Supports: SELECT, WHERE, GROUP BY, ORDER BY, PIVOT, LIMIT

### ARRAYFORMULA — Apply Formula to Entire Column
\`\`\`
=ARRAYFORMULA(IF(A2:A<>"", A2:A * B2:B, ""))
\`\`\`
- One formula handles the whole column
- Wrap in IF to avoid filling blank rows

### FILTER — Dynamic Filtered Results
\`\`\`
=FILTER(A2:C100, B2:B100 = "Active", C2:C100 > 1000)
\`\`\`
- Multiple conditions separated by commas (AND logic)
- For OR logic: use + between conditions

### Google-Specific Functions
\`\`\`
=GOOGLEFINANCE("GOOG", "price")                    -- Stock price
=GOOGLETRANSLATE(A1, "en", "es")                   -- Translate text
=IMAGE("https://example.com/logo.png")             -- Display image in cell
=IMPORTHTML(url, "table", 1)                        -- Import HTML tables
=IMPORTXML(url, "//h1")                             -- Import XML/HTML elements
=IMPORTDATA("https://example.com/data.csv")        -- Import CSV
\`\`\`

### Data Validation
- Data → Data Validation
- Types: List of items, number range, date range, custom formula
- Custom formula example: =ISEMAILADDRESS(A1)
- Show warning vs. reject input

### Conditional Formatting
- Format → Conditional Formatting
- Custom formula examples:
  - Row highlight when status = Done: =$C2="Done"
  - Overdue dates: =AND(A2<TODAY(), A2<>"")

## Apps Script Automation

### Open Script Editor
Extensions → Apps Script

### Common Scripts

**Send Email on Form Submit:**
\`\`\`javascript
function onFormSubmit(e) {
  const name = e.values[1];
  const email = e.values[2];
  
  GmailApp.sendEmail(email, "Thanks for submitting!", 
    "Hi " + name + ", we received your submission.");
}
// Set trigger: Edit → Triggers → onFormSubmit → From spreadsheet → On form submit
\`\`\`

**Auto-Archive Old Rows:**
\`\`\`javascript
function archiveOldRows() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const source = ss.getSheetByName("Active");
  const archive = ss.getSheetByName("Archive");
  const data = source.getDataRange().getValues();
  
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][3] instanceof Date && data[i][3] < cutoff) {
      archive.appendRow(data[i]);
      source.deleteRow(i + 1);
    }
  }
}
\`\`\`

**Custom Menu:**
\`\`\`javascript
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('My Tools')
    .addItem('Generate Report', 'generateReport')
    .addItem('Send Reminders', 'sendReminders')
    .addToUi();
}
\`\`\`

## Collaboration Features
- **Share:** Share button → add people or get link
- **Permissions:** Viewer, Commenter, Editor
- **Protected ranges:** Data → Protected Sheets and Ranges (lock cells from editing)
- **Named ranges:** Data → Named Ranges (easier formula references)
- **Filter views:** Data → Filter Views (personal filters that don't affect others)
- **Version history:** File → Version History → See Version History

## Common Mistakes to Avoid
- Not using ARRAYFORMULA (copying formulas down thousands of rows)
- IMPORTRANGE without allowing access (shows #REF! error)
- Volatile functions slowing sheets (NOW(), RAND() recalculate constantly)
- Not using Filter Views in shared sheets (regular filters affect everyone)
- Exceeding 10 million cell limit
`,
  },
  {
    slug: "meeting-notes",
    name: "Meeting Notes & Minutes",
    description:
      "Summarize meetings, extract action items, format professional minutes, and track follow-ups. Use when documenting meetings, creating agendas, or organizing action items from discussions.",
    tags: ["productivity", "business", "writing"],
    readme: `# Meeting Notes & Minutes

Help users capture, organize, and follow up on meetings effectively.

## When to Use
- Summarizing meeting transcripts or recordings
- Creating meeting agendas
- Formatting professional minutes
- Extracting action items from discussions
- Creating follow-up tracking systems

## When NOT to Use
- Project management workflows (use project-management)
- Formal legal proceedings documentation

## Meeting Notes Template

### Quick Format
\`\`\`
# [Meeting Title]
**Date:** [Date] | **Time:** [Start - End] | **Location/Link:** [Details]

## Attendees
- [Name] (Role)
- [Name] (Role)
- Absent: [Name]

## Agenda
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]

## Discussion Summary

### [Topic 1]
- Key point discussed
- Decision made: [specific decision]
- Concern raised by [Name]: [concern]

### [Topic 2]
- Key point discussed
- Options considered: A, B, C
- Decision: Option B selected because [reason]

## Action Items
| # | Action | Owner | Due Date | Status |
|---|--------|-------|----------|--------|
| 1 | [Task description] | [Name] | [Date] | ⬜ Open |
| 2 | [Task description] | [Name] | [Date] | ⬜ Open |

## Decisions Made
1. [Decision and rationale]
2. [Decision and rationale]

## Next Meeting
**Date:** [Date] | **Topics:** [Carry-over items]
\`\`\`

## How to Summarize a Meeting Transcript

### Step 1: Identify Key Elements
- **Decisions:** What was agreed upon?
- **Action items:** Who needs to do what by when?
- **Discussion points:** Key arguments and perspectives
- **Open questions:** What wasn't resolved?

### Step 2: Structure the Summary
- Lead with decisions and action items (most important)
- Summarize discussion, don't transcribe it
- Attribute decisions and actions to specific people
- Note dissenting opinions if significant

### Step 3: Action Item Extraction
Every action item MUST have:
- **What:** Clear, specific task description
- **Who:** Single owner (not "the team")
- **When:** Specific due date
- **Context:** Why this matters (optional but helpful)

## Meeting Agenda Template
\`\`\`
# [Meeting Title] — Agenda
**Date:** [Date] | **Duration:** [Time]

## Pre-reads
- [Document or link to review before meeting]

## Agenda Items
| # | Topic | Presenter | Time | Type |
|---|-------|-----------|------|------|
| 1 | Status update on [project] | [Name] | 10 min | Update |
| 2 | Decision: [topic] | [Name] | 15 min | Decision |
| 3 | Discussion: [topic] | [Name] | 20 min | Discussion |
| 4 | Open floor | All | 5 min | Open |

## Decision Items Needed
- [ ] Approve [specific thing]
- [ ] Choose between [Option A] and [Option B]
\`\`\`

## Follow-Up Email Template
\`\`\`
Subject: Meeting Notes — [Title] ([Date])

Hi team,

Thanks for joining today's [meeting name]. Here's a summary:

**Key Decisions:**
1. [Decision]
2. [Decision]

**Action Items:**
- @[Name]: [Task] — due [Date]
- @[Name]: [Task] — due [Date]

**Next Meeting:** [Date/Time]

Full notes: [Link to document]

Let me know if I missed anything!
\`\`\`

## Tips for Better Meeting Notes
- Use a consistent template every time
- Capture decisions and action items in real-time
- Send notes within 24 hours
- Use @mentions for action item owners
- Review action items at the start of the next meeting
- Keep a running document for recurring meetings
`,
  },
  {
    slug: "project-management",
    name: "Project Management",
    description:
      "Plan and manage projects with Agile/Scrum boards, Gantt charts, sprint planning, and stakeholder updates. Use when organizing tasks, tracking progress, creating project plans, or managing team workflows.",
    tags: ["productivity", "business"],
    readme: `# Project Management

Help users plan, execute, and track projects effectively.

## When to Use
- Creating project plans and timelines
- Sprint planning and backlog grooming
- Stakeholder status updates
- Task breakdown and estimation
- Risk identification and mitigation
- Resource planning

## When NOT to Use
- Meeting documentation (use meeting-notes)
- Financial planning (use budget-planner)
- Hiring workflows (use hiring-recruitment)

## Project Planning Framework

### 1. Project Charter (Start Here)
\`\`\`
# Project Charter: [Project Name]

**Sponsor:** [Name]
**Project Lead:** [Name]
**Start Date:** [Date]
**Target Completion:** [Date]

## Problem Statement
[What problem are we solving?]

## Goals & Success Metrics
1. [Goal] — measured by [metric]
2. [Goal] — measured by [metric]

## Scope
**In scope:** [What's included]
**Out of scope:** [What's explicitly excluded]

## Key Stakeholders
| Name | Role | Interest | Influence |
|------|------|----------|-----------|
| [Name] | Sponsor | High | High |
| [Name] | End User | High | Low |

## Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk] | High/Med/Low | High/Med/Low | [Plan] |

## Budget
[Estimated budget or resource allocation]
\`\`\`

### 2. Work Breakdown Structure (WBS)
Break the project into manageable pieces:

\`\`\`
Project
├── Phase 1: Discovery (Week 1-2)
│   ├── Stakeholder interviews
│   ├── Requirements gathering
│   └── Technical assessment
├── Phase 2: Design (Week 3-4)
│   ├── Solution design
│   ├── Prototype
│   └── Design review
├── Phase 3: Build (Week 5-8)
│   ├── Core features
│   ├── Integration
│   └── Testing
└── Phase 4: Launch (Week 9-10)
    ├── User training
    ├── Deployment
    └── Post-launch review
\`\`\`

### 3. Task Estimation

**T-shirt sizing for initial estimates:**
- **XS:** < 2 hours
- **S:** 2-4 hours (half day)
- **M:** 1-2 days
- **L:** 3-5 days (one week)
- **XL:** 1-2 weeks (should be broken down further)

**Planning poker / Story points:**
- 1, 2, 3, 5, 8, 13, 21
- If it's > 13 points, break it into smaller tasks

### 4. Sprint Planning (Agile)

**Sprint Structure (2-week sprint):**
- Day 1: Sprint Planning (2 hours)
- Days 2-9: Development
- Day 9: Sprint Review / Demo (1 hour)
- Day 10: Retrospective (1 hour)

**Daily Standup (15 min):**
1. What did I complete yesterday?
2. What am I working on today?
3. Any blockers?

**Sprint Board Columns:**
- Backlog → To Do → In Progress → Review → Done

## Status Update Templates

### Weekly Status Report
\`\`\`
# Weekly Status: [Project Name]
**Week of:** [Date] | **Overall Status:** 🟢 On Track / 🟡 At Risk / 🔴 Off Track

## Summary
[1-2 sentence overview of the week]

## Completed This Week
- ✅ [Task/milestone]
- ✅ [Task/milestone]

## In Progress
- 🔄 [Task] — [% complete, expected completion]
- 🔄 [Task] — [% complete, expected completion]

## Planned Next Week
- [ ] [Task]
- [ ] [Task]

## Risks & Blockers
- ⚠️ [Risk/blocker and mitigation plan]

## Key Metrics
- Tasks completed: X/Y
- Sprint velocity: Z points
- Budget spent: X% of total
\`\`\`

### Executive Summary (Monthly)
\`\`\`
# [Project Name] — Executive Summary
**Period:** [Month Year] | **Status:** 🟢/🟡/🔴

## Highlights
- [Major accomplishment]
- [Key milestone reached]

## Key Metrics
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Timeline | [Date] | [Date] | 🟢 |
| Budget | $X | $Y | 🟡 |
| Quality | [Target] | [Actual] | 🟢 |

## Decisions Needed
1. [Decision and options]

## Next Month Focus
- [Priority 1]
- [Priority 2]
\`\`\`

## Gantt Chart Structure
\`\`\`
| Task | Start | End | Duration | Dependencies | Owner |
|------|-------|-----|----------|--------------|-------|
| Requirements | W1 | W2 | 2 weeks | - | Alice |
| Design | W2 | W4 | 2 weeks | Requirements | Bob |
| Development | W4 | W8 | 4 weeks | Design | Team |
| Testing | W7 | W9 | 2 weeks | Development (partial) | QA |
| Launch | W9 | W10 | 1 week | Testing | Alice |
\`\`\`

## Common Mistakes to Avoid
- No clear definition of "done"
- Skipping the project charter (scope creep follows)
- Tasks without owners or due dates
- Not tracking risks until they become problems
- Status reports that hide bad news
- Over-planning: plan in detail for 2-4 weeks ahead, high-level beyond that
`,
  },

  // ==========================================
  // BUSINESS
  // ==========================================
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    description:
      "Create professional invoices, billing templates, payment tracking, and accounts receivable management. Use when billing clients, creating invoice templates, or tracking payments.",
    tags: ["business", "finance"],
    readme: `# Invoice Generator

Help users create professional invoices and manage billing.

## When to Use
- Creating invoices for clients
- Setting up invoice templates
- Tracking payments and overdue invoices
- Calculating taxes and discounts
- Generating billing reports

## When NOT to Use
- Full accounting/bookkeeping (use accounting-bookkeeping)
- Tax filing (use tax-preparation)
- Complex financial statements

## Professional Invoice Template

\`\`\`
╔══════════════════════════════════════════════════════╗
║                     INVOICE                          ║
╠══════════════════════════════════════════════════════╣

[Your Company Logo]
[Company Name]
[Address Line 1]
[City, State ZIP]
[Phone] | [Email] | [Website]

──────────────────────────────────────────────────────

Invoice #: INV-2024-001          Date: January 15, 2024
Due Date: February 14, 2024      Terms: Net 30

──────────────────────────────────────────────────────

BILL TO:
[Client Name]
[Client Company]
[Client Address]
[Client Email]

══════════════════════════════════════════════════════

| # | Description              | Qty | Rate    | Amount   |
|---|--------------------------|-----|---------|----------|
| 1 | Web Design Services      | 40  | $75.00  | $3,000.00|
| 2 | Logo Design              | 1   | $500.00 | $500.00  |
| 3 | Content Writing          | 10  | $50.00  | $500.00  |

──────────────────────────────────────────────────────
                              Subtotal:     $4,000.00
                              Tax (8.5%):   $340.00
                              Discount:     -$200.00
                              ─────────────────────
                              TOTAL DUE:    $4,140.00

══════════════════════════════════════════════════════

PAYMENT METHODS:
• Bank Transfer: [Bank Name], Account: XXXX, Routing: XXXX
• PayPal: [email]
• Check payable to: [Company Name]

NOTES:
Thank you for your business! Late payments subject to 1.5%
monthly interest.

╚══════════════════════════════════════════════════════╝
\`\`\`

## Invoice Numbering Systems
- **Sequential:** INV-001, INV-002, INV-003
- **Date-based:** INV-2024-01-001 (year-month-sequence)
- **Client-based:** INV-ACME-001

## Payment Terms
| Term | Meaning |
|------|---------|
| Due on Receipt | Pay immediately |
| Net 15 | Due within 15 days |
| Net 30 | Due within 30 days (most common) |
| Net 60 | Due within 60 days |
| 2/10 Net 30 | 2% discount if paid within 10 days, otherwise due in 30 |

## Invoice Tracking Spreadsheet
| Invoice # | Client | Date | Due Date | Amount | Status | Paid Date |
|-----------|--------|------|----------|--------|--------|-----------|
| INV-001 | Acme | Jan 1 | Jan 31 | $2,000 | ✅ Paid | Jan 15 |
| INV-002 | Beta | Jan 15 | Feb 14 | $3,500 | ⏰ Due Soon | - |
| INV-003 | Gamma | Dec 1 | Dec 31 | $1,200 | 🔴 Overdue | - |

## Overdue Payment Reminder Templates

**Friendly Reminder (1 day after due):**
Subject: Invoice INV-XXX — Payment Reminder
"Hi [Name], just a friendly reminder that invoice INV-XXX for $X,XXX was due on [date]. Please let me know if you have any questions."

**Second Notice (14 days overdue):**
Subject: Invoice INV-XXX — Second Notice (14 Days Overdue)
"Hi [Name], this is a follow-up regarding invoice INV-XXX for $X,XXX, which is now 14 days past due. Please arrange payment at your earliest convenience."

**Final Notice (30 days overdue):**
Subject: Invoice INV-XXX — Final Notice Before Late Fees
"Hi [Name], invoice INV-XXX for $X,XXX is now 30 days past due. Per our agreement, late fees of 1.5% per month will apply starting [date]."

## Legal Requirements (Varies by Region)
Most invoices should include:
- Your business name and contact info
- Client's name and contact info
- Unique invoice number
- Invoice date and due date
- Itemized list of goods/services
- Amounts, taxes, and total
- Payment terms and methods
- Tax ID / Business number (if applicable)

## Tips
- Always send invoices promptly (same day or next business day)
- Use consistent formatting and numbering
- Keep copies of all invoices
- Follow up on overdue invoices within 3 days
- Consider offering early payment discounts for large invoices
`,
  },
  {
    slug: "budget-planner",
    name: "Budget Planner",
    description:
      "Create personal and business budgets, track expenses, set savings goals, and forecast finances. Use when planning monthly budgets, tracking spending, or creating financial plans.",
    tags: ["finance", "personal", "business"],
    readme: `# Budget Planner

Help users create and manage personal or business budgets.

## When to Use
- Creating monthly/annual budgets
- Tracking expenses and income
- Setting and tracking savings goals
- Forecasting future expenses
- Analyzing spending patterns
- Emergency fund planning

## When NOT to Use
- Tax filing (use tax-preparation)
- Investment portfolio management (use investment-analysis)
- Business financial statements (use accounting-bookkeeping)

## Personal Budget Template (50/30/20 Rule)

**Monthly Income:** $X,XXX (after tax)

| Category | % | Budget | Actual | Difference |
|----------|---|--------|--------|------------|
| **NEEDS (50%)** | | | | |
| Housing (rent/mortgage) | 30% | $X | | |
| Utilities | 5% | $X | | |
| Groceries | 10% | $X | | |
| Insurance | 3% | $X | | |
| Transportation | 5% | $X | | |
| Minimum debt payments | 5% | $X | | |
| **WANTS (30%)** | | | | |
| Dining out | 5% | $X | | |
| Entertainment | 5% | $X | | |
| Shopping | 5% | $X | | |
| Subscriptions | 3% | $X | | |
| Hobbies | 2% | $X | | |
| **SAVINGS (20%)** | | | | |
| Emergency fund | 10% | $X | | |
| Retirement | 5% | $X | | |
| Other savings goals | 5% | $X | | |

## Business Budget Template

| Category | Monthly | Quarterly | Annual |
|----------|---------|-----------|--------|
| **REVENUE** | | | |
| Product/Service Sales | $X | $X | $X |
| Other Income | $X | $X | $X |
| **Total Revenue** | **$X** | **$X** | **$X** |
| **EXPENSES** | | | |
| *Fixed Costs* | | | |
| Rent/Lease | $X | $X | $X |
| Salaries | $X | $X | $X |
| Insurance | $X | $X | $X |
| Software/Subscriptions | $X | $X | $X |
| *Variable Costs* | | | |
| Marketing | $X | $X | $X |
| Supplies | $X | $X | $X |
| Travel | $X | $X | $X |
| Professional Services | $X | $X | $X |
| **Total Expenses** | **$X** | **$X** | **$X** |
| **NET PROFIT** | **$X** | **$X** | **$X** |

## Savings Goal Tracker

\`\`\`
Goal: Emergency Fund ($10,000)
Current: $3,500 ████████░░░░░░░░░░░░ 35%
Monthly contribution: $500
Months remaining: 13
Target date: March 2025

Goal: Vacation ($3,000)
Current: $1,200 ████████░░░░░░░░░░░░ 40%
Monthly contribution: $300
Months remaining: 6
Target date: August 2024
\`\`\`

## Expense Tracking Categories
- **Fixed:** Same every month (rent, subscriptions, loan payments)
- **Variable:** Changes month to month (groceries, gas, dining out)
- **Periodic:** Occasional (car repair, medical, gifts)
- **Discretionary:** Optional (entertainment, hobbies, shopping)

## Budget Review Process (Monthly)
1. Record all income received
2. Categorize every expense
3. Compare actual vs. budgeted amounts
4. Identify categories over/under budget
5. Adjust next month's budget based on trends
6. Review savings goal progress
7. Note any irregular expenses coming up

## Quick Formulas
- **Savings rate:** (Income - Expenses) / Income × 100
- **Expense ratio:** Category Expense / Total Income × 100
- **Months of runway:** Total Savings / Monthly Expenses
- **Break-even:** Fixed Costs / (1 - Variable Cost %)

## Common Mistakes to Avoid
- Not tracking small purchases (they add up fast)
- Setting unrealistic budgets (start with tracking current spending)
- Forgetting periodic expenses (insurance, car registration, holidays)
- Not having an emergency fund buffer
- Treating the budget as rigid — it should be a living document
`,
  },
  {
    slug: "sales-crm",
    name: "Sales CRM & Pipeline",
    description:
      "Set up CRM systems, manage sales pipelines, create lead scoring models, and design follow-up sequences. Use when organizing sales processes, tracking deals, or building customer relationship workflows.",
    tags: ["business", "marketing"],
    readme: `# Sales CRM & Pipeline

Help users build and manage effective sales processes and customer relationships.

## When to Use
- Setting up a sales pipeline / CRM
- Lead scoring and qualification
- Follow-up email sequences
- Pipeline reporting and forecasting
- Customer relationship tracking

## When NOT to Use
- Email newsletter campaigns (use email-marketing)
- Customer support tickets (use customer-support)
- Accounting/invoicing (use invoice-generator or accounting-bookkeeping)

## Sales Pipeline Stages

### Standard B2B Pipeline
| Stage | Description | Probability | Actions |
|-------|-------------|-------------|---------|
| 1. Lead | New contact identified | 10% | Research, add to CRM |
| 2. Qualified | Fits ICP, has budget/need | 20% | Discovery call scheduled |
| 3. Discovery | Needs assessment complete | 30% | Send proposal |
| 4. Proposal | Proposal/quote sent | 50% | Follow up, handle objections |
| 5. Negotiation | Terms being discussed | 70% | Finalize terms |
| 6. Closed Won | Deal signed ✅ | 100% | Onboarding |
| 7. Closed Lost | Deal lost ❌ | 0% | Document reason, nurture |

### Pipeline Tracker
| Deal | Company | Value | Stage | Next Action | Due | Owner |
|------|---------|-------|-------|-------------|-----|-------|
| Website redesign | Acme Corp | $15K | Proposal | Follow up on proposal | Mar 20 | Sarah |
| Annual contract | Beta Inc | $50K | Negotiation | Send revised terms | Mar 18 | Mike |

## Lead Scoring Model

| Criteria | Points | Description |
|----------|--------|-------------|
| **Demographic** | | |
| Job title matches ICP | +20 | Decision maker or influencer |
| Company size fits | +15 | In target range |
| Industry match | +10 | Target industry |
| Location match | +5 | Serviceable area |
| **Behavioral** | | |
| Visited pricing page | +15 | High purchase intent |
| Downloaded resource | +10 | Engaged with content |
| Attended webinar | +10 | Active interest |
| Opened 3+ emails | +5 | Engaged contact |
| Requested demo | +25 | Strong intent |
| **Negative** | | |
| Competitor | -50 | Not a real prospect |
| Student email | -20 | Likely not buying |
| No activity 30+ days | -10 | Going cold |

**Score Thresholds:**
- 0-25: Cold — Nurture with content
- 26-50: Warm — Marketing qualified, send more info
- 51-75: Hot — Sales qualified, reach out personally
- 76+: Very Hot — Prioritize immediate follow-up

## Follow-Up Sequence Templates

### After Initial Contact (5-touch sequence)
| Day | Action | Channel | Template |
|-----|--------|---------|----------|
| 0 | Introduction | Email | "Hi [Name], great connecting at [event]..." |
| 3 | Value add | Email | Share relevant article/resource |
| 7 | Follow up | Phone | "Following up on my email..." |
| 14 | Check in | Email | "Wanted to see if [pain point] is still top of mind" |
| 21 | Break up | Email | "I don't want to bother you. If timing isn't right..." |

### After Proposal Sent
- Day 1: Confirmation email ("Proposal attached, let me know any questions")
- Day 3: Check-in call ("Any questions about the proposal?")
- Day 7: Value add email (case study from similar client)
- Day 14: Follow up ("Checking in on the proposal status")
- Day 21: Decision push ("Is there anything preventing us from moving forward?")

## CRM Data to Track

### Contact Record
- Name, title, company, email, phone
- Lead source (how they found you)
- Lead score
- All interactions (calls, emails, meetings)
- Notes from conversations
- Preferred communication method

### Deal Record
- Deal name and value
- Pipeline stage
- Close date (expected)
- Decision maker(s)
- Competition (who else they're evaluating)
- Next action and due date
- Win/loss reason

## Pipeline Metrics
- **Conversion rate:** Leads → Customers (target: varies by industry, typically 2-5%)
- **Average deal size:** Total revenue / number of deals
- **Sales cycle length:** Average days from lead to close
- **Win rate:** Closed Won / (Closed Won + Closed Lost)
- **Pipeline coverage:** Pipeline value / Revenue target (aim for 3-4x)

## Tips
- Log every interaction immediately (calls, emails, meetings)
- Set a next action for every open deal — no deal without a next step
- Review pipeline weekly — remove stale deals
- Track why deals are lost — patterns reveal improvements
- Respond to inbound leads within 5 minutes (response time matters enormously)
`,
  },
  {
    slug: "business-plan",
    name: "Business Plan",
    description:
      "Write comprehensive business plans with market analysis, financial projections, pitch decks, and executive summaries. Use when starting a business, seeking funding, or creating strategic plans.",
    tags: ["business", "writing", "finance"],
    readme: `# Business Plan

Help users create compelling business plans and pitch materials.

## When to Use
- Writing a business plan for a new venture
- Creating a pitch deck for investors
- Market analysis and competitive research
- Financial projections and modeling
- Executive summaries for stakeholders

## When NOT to Use
- Day-to-day project management (use project-management)
- Accounting entries (use accounting-bookkeeping)
- Legal documents (use contract-drafting)

## Business Plan Structure

### 1. Executive Summary (1-2 pages)
Write this LAST but put it FIRST.

\`\`\`
## Executive Summary

**Company:** [Name] — [One-line description]
**Mission:** [What you do and for whom]
**Problem:** [Pain point you're solving]
**Solution:** [Your product/service]
**Market:** [Target market size and segment]
**Business Model:** [How you make money]
**Traction:** [Key metrics, customers, revenue to date]
**Team:** [Key founders and their relevant experience]
**Ask:** [What you need — funding amount, partnerships, etc.]
**Use of Funds:** [How you'll spend investment]
\`\`\`

### 2. Company Description
- Legal structure (LLC, Corporation, Sole Proprietorship)
- Location and facilities
- History and milestones
- Vision and mission statements
- Core values

### 3. Market Analysis
\`\`\`
## Market Analysis

### Total Addressable Market (TAM)
[Total market if you captured 100%]: $X billion

### Serviceable Addressable Market (SAM)
[Portion you can realistically reach]: $X million

### Serviceable Obtainable Market (SOM)
[Portion you expect to capture in 3-5 years]: $X million

### Market Trends
1. [Trend driving growth]
2. [Trend creating opportunity]
3. [Industry shift]

### Customer Segments
| Segment | Size | Pain Point | Willingness to Pay |
|---------|------|------------|-------------------|
| [Segment 1] | X% of market | [Problem] | High/Med/Low |
| [Segment 2] | X% of market | [Problem] | High/Med/Low |
\`\`\`

### 4. Competitive Analysis
| Factor | You | Competitor A | Competitor B |
|--------|-----|-------------|-------------|
| Price | $X/mo | $X/mo | $X/mo |
| Key Feature 1 | ✅ | ✅ | ❌ |
| Key Feature 2 | ✅ | ❌ | ✅ |
| Target Market | [Who] | [Who] | [Who] |
| Weakness | [Yours] | [Theirs] | [Theirs] |

**Your Competitive Advantage:** [What makes you different and defensible]

### 5. Products/Services
- Description of each offering
- Pricing model
- Development roadmap
- Intellectual property

### 6. Marketing & Sales Strategy
- Customer acquisition channels
- Pricing strategy
- Sales process
- Partnerships
- Brand positioning

### 7. Financial Projections (3-5 Year)

**Revenue Forecast:**
| | Year 1 | Year 2 | Year 3 |
|---|--------|--------|--------|
| Customers | 100 | 500 | 2,000 |
| Avg Revenue/Customer | $1,200 | $1,200 | $1,500 |
| **Total Revenue** | $120K | $600K | $3M |

**Expense Forecast:**
| Category | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| Salaries | $X | $X | $X |
| Marketing | $X | $X | $X |
| Operations | $X | $X | $X |
| **Total Expenses** | $X | $X | $X |
| **Net Profit** | $X | $X | $X |

**Key Assumptions:**
- Customer growth rate: X% monthly
- Churn rate: X% monthly
- Customer acquisition cost: $X
- Lifetime value: $X

### 8. Team
For each key team member:
- Name and role
- Relevant experience (2-3 bullet points)
- Why they're the right person for this role

### 9. Funding Request (if applicable)
- Amount requested
- Use of funds (specific allocation)
- Expected milestones with this funding
- Projected return for investors
- Exit strategy

## Common Mistakes to Avoid
- Unrealistic financial projections (hockey stick without justification)
- Claiming "no competition" (there's always competition, even the status quo)
- Too long (keep under 20-30 pages)
- All vision, no execution details
- Not knowing your unit economics (CAC, LTV, margins)
- Forgetting to explain why NOW is the right time
`,
  },
  {
    slug: "contract-drafting",
    name: "Contract Drafting",
    description:
      "Draft legal contracts, NDAs, service agreements, terms of service, and other business agreements. Use when creating or reviewing contracts, understanding legal terms, or writing agreement templates.",
    tags: ["business", "writing"],
    readme: `# Contract Drafting

Help users draft and understand common business contracts and agreements.

## When to Use
- Drafting service agreements, NDAs, or contracts
- Understanding contract terms and clauses
- Creating contract templates
- Reviewing contract structure and key terms

## When NOT to Use
- This is NOT legal advice. Always have a lawyer review important contracts.
- Complex litigation or regulatory compliance
- Employment law specifics (varies greatly by jurisdiction)

## ⚠️ Important Disclaimer
AI-generated contracts are starting points and templates. They are NOT a substitute for professional legal review. Always consult a qualified attorney for contracts involving significant money, risk, or legal obligations.

## Common Contract Types

### 1. Non-Disclosure Agreement (NDA)

\`\`\`
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of [Date]
by and between:

Disclosing Party: [Company/Name], [Address]
Receiving Party: [Company/Name], [Address]

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by
the Disclosing Party, including but not limited to: business plans, financial
data, customer lists, technical specifications, trade secrets, and proprietary
processes.

2. OBLIGATIONS
The Receiving Party agrees to:
(a) Hold Confidential Information in strict confidence
(b) Not disclose to third parties without prior written consent
(c) Use Confidential Information only for [stated purpose]
(d) Protect with at least the same degree of care as own confidential info

3. EXCLUSIONS
This Agreement does not apply to information that:
(a) Is or becomes publicly available through no fault of Receiving Party
(b) Was known to Receiving Party before disclosure
(c) Is independently developed without use of Confidential Information
(d) Is required to be disclosed by law (with prompt notice to Disclosing Party)

4. TERM
This Agreement is effective for [2 years] from the date above.
Obligations regarding trade secrets survive indefinitely.

5. RETURN OF INFORMATION
Upon request or termination, Receiving Party shall return or destroy all
Confidential Information and certify destruction in writing.

6. GOVERNING LAW
This Agreement is governed by the laws of [State/Province/Country].

SIGNATURES:
____________________          ____________________
[Name, Title, Date]           [Name, Title, Date]
\`\`\`

### 2. Service Agreement (Key Sections)

\`\`\`
SERVICE AGREEMENT

1. SCOPE OF SERVICES
   [Detailed description of services to be provided]
   [Deliverables and milestones]

2. COMPENSATION
   Total fee: $[Amount]
   Payment schedule: [e.g., 50% upfront, 50% on completion]
   Late payment: [Interest rate, typically 1-1.5% per month]

3. TIMELINE
   Start date: [Date]
   Milestones: [Key dates]
   Completion date: [Date]

4. REVISIONS AND CHANGES
   Included: [Number] rounds of revisions
   Additional revisions: $[Rate] per hour
   Scope changes: require written change order

5. INTELLECTUAL PROPERTY
   [Who owns the final work product]
   [License terms if ownership doesn't transfer]

6. TERMINATION
   Either party may terminate with [30 days] written notice
   Early termination fee: [Amount or formula]
   Client pays for work completed to date

7. LIABILITY
   Maximum liability limited to total fees paid
   Neither party liable for indirect/consequential damages

8. CONFIDENTIALITY
   [Both parties keep project details confidential]

9. DISPUTE RESOLUTION
   [Mediation first, then arbitration or litigation]
   Jurisdiction: [Location]
\`\`\`

### 3. Independent Contractor Agreement (Key Additions)
- Contractor is NOT an employee
- Contractor responsible for own taxes
- Contractor can work for other clients
- No benefits (health, retirement, etc.)
- Contractor provides own tools/equipment

## Essential Contract Clauses

| Clause | Purpose |
|--------|---------|
| Definitions | Clarify key terms |
| Scope | What's included and excluded |
| Payment | How much, when, how |
| Term & Termination | Duration and exit conditions |
| Confidentiality | Protect sensitive information |
| IP Ownership | Who owns the work product |
| Liability & Indemnification | Limit financial exposure |
| Force Majeure | Unforeseeable events excuse |
| Governing Law | Which jurisdiction applies |
| Dispute Resolution | How to handle disagreements |
| Entire Agreement | This document is the full deal |
| Amendments | Changes require written agreement |
| Severability | Invalid clause doesn't void entire contract |
| Signatures | Both parties agree |

## Red Flags in Contracts
- ❌ Unlimited liability
- ❌ Non-compete clauses that are overly broad
- ❌ Automatic renewal without notice period
- ❌ One-sided termination rights
- ❌ Vague scope of work
- ❌ No cap on additional charges
- ❌ Assignment without consent
- ❌ Waiver of jury trial (understand before agreeing)

## Tips
- Always define key terms clearly
- Be specific about deliverables, timelines, and payments
- Include what happens when things go wrong (not just when they go right)
- Both parties should have a copy
- Date everything, initial every page
- Keep contracts as simple and clear as possible
- **Always get legal review for contracts over $10K or with significant risk**
`,
  },
  {
    slug: "hiring-recruitment",
    name: "Hiring & Recruitment",
    description:
      "Create job descriptions, interview questions, candidate scoring rubrics, and offer letters. Use when hiring employees, building interview processes, or managing recruitment workflows.",
    tags: ["business", "writing"],
    readme: `# Hiring & Recruitment

Help users build effective hiring processes from job posting to offer letter.

## When to Use
- Writing job descriptions
- Creating interview questions and rubrics
- Building candidate evaluation frameworks
- Drafting offer letters
- Designing hiring workflows

## When NOT to Use
- Legal employment advice (consult HR/legal professionals)
- Background check processes (use specialized services)
- Payroll/benefits administration

## Job Description Template

\`\`\`
# [Job Title]

**Location:** [City, State / Remote / Hybrid]
**Type:** [Full-time / Part-time / Contract]
**Reports to:** [Manager Title]
**Salary Range:** [$X - $Y] (transparency builds trust)

## About Us
[2-3 sentences about the company, mission, and culture]

## The Role
[2-3 sentences about what this person will do and why it matters]

## What You'll Do
- [Responsibility using action verbs: "Lead," "Build," "Manage"]
- [Responsibility — be specific, not vague]
- [Responsibility — describe impact, not just tasks]
- [Responsibility]
- [Responsibility]

## What We're Looking For
**Must Have:**
- [X years of experience in Y]
- [Specific skill or qualification]
- [Specific skill or qualification]

**Nice to Have:**
- [Preferred but not required]
- [Preferred but not required]

## What We Offer
- Salary: $X - $Y
- [Benefits: health, dental, vision]
- [PTO policy]
- [Remote/flexible work]
- [Professional development]
- [Other perks]

## How to Apply
[Instructions — keep it simple]

[Company Name] is an equal opportunity employer.
\`\`\`

## Interview Question Bank

### Cultural Fit / Values
1. "Tell me about a time you disagreed with a team decision. What did you do?"
2. "Describe your ideal work environment."
3. "What motivates you to do your best work?"
4. "Tell me about a failure and what you learned from it."

### Problem-Solving
1. "Walk me through how you'd approach [relevant scenario]."
2. "Tell me about a complex problem you solved. What was your process?"
3. "Describe a time you had to make a decision with incomplete information."

### Leadership (for management roles)
1. "How do you handle an underperforming team member?"
2. "Describe how you've built or scaled a team."
3. "Tell me about a time you had to deliver difficult feedback."

### Role-Specific (customize per position)
1. "What's your experience with [key tool/technology]?"
2. "How would you prioritize [competing demands relevant to role]?"
3. "Walk me through your approach to [key responsibility]."

### Questions to Ask Candidates
Let them ask you too — it's a two-way evaluation.

## Candidate Scoring Rubric

| Criteria | Weight | 1 (Below) | 3 (Meets) | 5 (Exceeds) |
|----------|--------|-----------|-----------|-------------|
| Technical Skills | 30% | Lacks key skills | Meets requirements | Expert level |
| Problem Solving | 25% | Struggles with ambiguity | Solid approach | Creative, thorough |
| Communication | 20% | Unclear, disorganized | Clear and professional | Compelling, persuasive |
| Culture Fit | 15% | Misaligned values | Good alignment | Strong champion |
| Growth Potential | 10% | Limited trajectory | Can grow in role | High ceiling |

**Scoring:** (Score × Weight) summed across criteria. Compare candidates objectively.

## Interview Process Design

### Typical 4-Stage Process
| Stage | Format | Duration | Evaluator | Focus |
|-------|--------|----------|-----------|-------|
| 1. Screen | Phone/Video | 30 min | Recruiter | Basic fit, salary, availability |
| 2. Technical | Video/In-person | 60 min | Hiring Manager | Skills, experience, problem-solving |
| 3. Team | Panel interview | 60 min | 2-3 team members | Culture fit, collaboration |
| 4. Final | With executive | 30 min | VP/Director | Strategic fit, close the candidate |

### Between Each Stage
- Score candidate within 24 hours
- Communicate decision within 48 hours
- Keep candidates informed of timeline

## Offer Letter Template

\`\`\`
Dear [Candidate Name],

We are pleased to offer you the position of [Job Title] at [Company Name].

**Position Details:**
- Title: [Job Title]
- Department: [Department]
- Reports to: [Manager Name, Title]
- Start Date: [Date]
- Location: [Location/Remote]

**Compensation:**
- Base Salary: $[Amount] per year, paid [bi-weekly/monthly]
- Bonus: [If applicable — target % and structure]
- Equity: [If applicable — shares/options, vesting schedule]

**Benefits:**
- Health/dental/vision insurance starting [date]
- [X] days paid time off
- [Other benefits]

**Conditions:**
This offer is contingent upon:
- Successful background check
- Proof of work authorization
- [Any other conditions]

Please sign and return by [date]. We're excited to have you join the team!

Sincerely,
[Name, Title]
[Company]

ACCEPTED:
Signature: _________________ Date: _________
\`\`\`

## Common Mistakes to Avoid
- Job descriptions that are wishlists (nobody meets 100% of requirements)
- Not posting salary range (candidates self-select out or feel misled)
- Unstructured interviews (leads to bias — use consistent questions)
- Taking too long (good candidates get other offers fast)
- Not providing feedback to rejected candidates
- Not having a diverse interview panel
`,
  },

  // ==========================================
  // MARKETING & SOCIAL
  // ==========================================
  {
    slug: "social-media-strategy",
    name: "Social Media Strategy",
    description:
      "Create content calendars, plan posts, develop hashtag strategies, and track engagement analytics. Use when planning social media campaigns, building a content calendar, or growing social media presence.",
    tags: ["marketing", "business", "writing"],
    readme: `# Social Media Strategy

Help users plan and execute effective social media strategies.

## When to Use
- Creating content calendars
- Planning social media campaigns
- Developing posting strategies for different platforms
- Hashtag research and strategy
- Engagement analysis and optimization

## When NOT to Use
- SEO/website optimization (use seo-optimization)
- Email campaigns (use email-marketing)
- Video production specifics (use youtube-content)

## Content Calendar Template

### Monthly Calendar
| Date | Platform | Content Type | Topic | Caption | Hashtags | Media | Status |
|------|----------|-------------|-------|---------|----------|-------|--------|
| Mon 3/3 | Instagram | Carousel | Tips for X | [Draft] | #tip #industry | 5 slides | ✅ Scheduled |
| Tue 3/4 | LinkedIn | Article | Industry trend | [Draft] | #thought-leadership | Image | 📝 Writing |
| Wed 3/5 | Twitter/X | Thread | How-to guide | [Draft] | #howto | None | ⬜ Planned |

### Content Pillars (Pick 3-5)
Rotate through these themes:
1. **Educational** (40%) — Tips, how-tos, industry insights
2. **Behind the Scenes** (20%) — Team, process, culture
3. **Social Proof** (15%) — Testimonials, case studies, results
4. **Promotional** (15%) — Products, services, offers
5. **Engagement** (10%) — Questions, polls, user-generated content

## Platform-Specific Best Practices

### Instagram
- **Post types:** Reels (highest reach), Carousels (highest saves), Stories (engagement)
- **Frequency:** 3-5 posts/week + daily stories
- **Best times:** Tue-Thu, 10am-1pm local time
- **Hashtags:** 5-15 relevant hashtags, mix of sizes
- **Bio:** Clear value prop + CTA + link

### LinkedIn
- **Post types:** Text posts (highest reach), documents/carousels, articles
- **Frequency:** 3-5 posts/week
- **Best times:** Tue-Thu, 8-10am local time
- **Tips:** First line is the hook (before "see more"), personal stories perform well
- **Engagement:** Comment on others' posts (builds visibility)

### Twitter/X
- **Post types:** Threads (highest value), single tweets, quote tweets
- **Frequency:** 1-5 tweets/day
- **Tips:** Strong hooks, use threads for longer content, engage in replies

### TikTok
- **Post types:** Short-form video (15s-3min)
- **Frequency:** 1-3 videos/day for growth
- **Tips:** Hook in first 2 seconds, use trending sounds, be authentic
- **Hashtags:** 3-5 relevant + 1-2 trending

## Hashtag Strategy
- **Branded:** Your company/campaign hashtag (e.g., #YourBrandName)
- **Industry:** Broad industry terms (e.g., #DigitalMarketing)
- **Niche:** Specific to your content (e.g., #EmailMarketingTips)
- **Trending:** Currently popular, if relevant

**Mix by size:**
- 2-3 large (1M+ posts) — for discovery
- 3-5 medium (100K-1M posts) — for competition balance
- 3-5 small (10K-100K posts) — for ranking higher

## Post Templates

### Educational Post
**Hook:** "Most people get [X] wrong. Here's what actually works:"
**Body:** 3-5 actionable tips
**CTA:** "Save this for later" or "Share with someone who needs this"

### Engagement Post
"What's your biggest challenge with [topic]? Drop a comment below 👇"

### Social Proof Post
"[Client name] came to us with [problem]. In [timeframe], they achieved [specific result]. Here's what we did: [brief overview]"

### Behind the Scenes
"Here's what a typical Monday looks like for our team: [authentic, relatable content]"

## Analytics to Track
| Metric | What It Means | Goal |
|--------|--------------|------|
| Reach | Unique people who saw your content | Growing month over month |
| Engagement Rate | (Likes + Comments + Shares) / Reach | 3-6% (varies by platform) |
| Follower Growth | Net new followers per period | Steady growth trend |
| Click-through Rate | Clicks on links / Impressions | 1-3% |
| Saves/Bookmarks | People saving for later | High = valuable content |
| Share Rate | Shares / Reach | High = resonant content |

## Common Mistakes to Avoid
- Posting without a strategy (random content = random results)
- Only posting promotional content (follow 80/20 rule: 80% value, 20% promotion)
- Ignoring comments and DMs (social media is social)
- Buying followers (destroys engagement rate)
- Not repurposing content across platforms
- Inconsistent posting schedule
`,
  },
  {
    slug: "seo-optimization",
    name: "SEO Optimization",
    description:
      "Optimize websites for search engines with on-page SEO, keyword research, meta tags, site audits, and backlink strategies. Use when improving search rankings, analyzing website SEO, or creating SEO-friendly content.",
    tags: ["marketing", "business"],
    readme: `# SEO Optimization

Help users improve their website's search engine rankings.

## When to Use
- On-page SEO optimization (titles, meta descriptions, headers)
- Keyword research and strategy
- Content optimization for search
- Technical SEO audits
- Backlink strategy
- Local SEO

## When NOT to Use
- Social media content (use social-media-strategy)
- Paid advertising (Google Ads, etc.)
- Website development/coding

## On-Page SEO Checklist

### For Every Page
- [ ] **Title tag:** 50-60 characters, primary keyword near the beginning
- [ ] **Meta description:** 150-160 characters, compelling with keyword, includes CTA
- [ ] **URL:** Short, descriptive, includes keyword (e.g., /keyword-phrase)
- [ ] **H1 tag:** One per page, includes primary keyword
- [ ] **H2/H3 tags:** Organized hierarchy, include related keywords
- [ ] **Image alt text:** Descriptive, includes keywords where natural
- [ ] **Internal links:** 3-5 links to related pages on your site
- [ ] **External links:** 1-2 links to authoritative sources
- [ ] **Content length:** 1,500+ words for competitive topics (quality over quantity)
- [ ] **Keyword density:** 1-2% (natural usage, don't stuff)

### Title Tag Formula
\`\`\`
[Primary Keyword] — [Benefit/Modifier] | [Brand Name]
Examples:
"Best Project Management Tools — 2024 Comparison Guide | YourBrand"
"How to Create a Budget — Step-by-Step Guide for Beginners | YourBrand"
\`\`\`

### Meta Description Formula
\`\`\`
[What the page is about]. [Key benefit]. [CTA].
Example:
"Learn how to create a monthly budget in 5 simple steps. Track expenses, save more, and reach your financial goals. Get started with our free template."
\`\`\`

## Keyword Research Process

### Step 1: Brainstorm Seed Keywords
List topics your audience searches for.

### Step 2: Expand with Research
Free tools: Google Autocomplete, "People Also Ask," Google Trends, AnswerThePublic
Paid tools: Ahrefs, SEMrush, Moz

### Step 3: Evaluate Keywords
| Keyword | Monthly Volume | Difficulty | Intent | Priority |
|---------|---------------|------------|--------|----------|
| "budget planner" | 12,000 | High | Transactional | Medium |
| "how to make a budget" | 8,000 | Medium | Informational | High |
| "budget template excel" | 3,000 | Low | Transactional | High |
| "50/30/20 budget rule" | 2,500 | Low | Informational | High |

### Step 4: Map Keywords to Pages
- One primary keyword per page
- 3-5 related/secondary keywords per page
- Don't target the same keyword on multiple pages (cannibalization)

## Content Optimization

### Content Structure for SEO
\`\`\`
H1: Primary keyword (single)
  H2: Major subtopic with secondary keyword
    H3: Supporting detail
    H3: Supporting detail
  H2: Major subtopic
    H3: Supporting detail
  H2: FAQ section (targets "People Also Ask")
    H3: Question 1?
    H3: Question 2?
\`\`\`

### Featured Snippet Optimization
- Answer questions directly in 40-60 words
- Use numbered lists for "how to" queries
- Use tables for comparison queries
- Use definitions for "what is" queries

## Technical SEO Checklist
- [ ] Site loads in < 3 seconds (use PageSpeed Insights)
- [ ] Mobile-friendly (use Mobile-Friendly Test)
- [ ] SSL certificate (HTTPS)
- [ ] XML sitemap submitted to Google Search Console
- [ ] Robots.txt properly configured
- [ ] No broken links (404 errors)
- [ ] Canonical tags on duplicate/similar pages
- [ ] Schema markup (structured data) for key pages
- [ ] Core Web Vitals passing (LCP, FID, CLS)

## Local SEO (for Local Businesses)
- Google Business Profile: complete and verified
- NAP consistency (Name, Address, Phone) across all listings
- Local keywords in title and content ("plumber in Seattle")
- Customer reviews (respond to all reviews)
- Local business directories (Yelp, industry-specific)

## Backlink Strategy
- **Create linkable content:** Original research, infographics, comprehensive guides
- **Guest posting:** Write for relevant blogs in your industry
- **Broken link building:** Find broken links on other sites, suggest yours as replacement
- **HARO / journalist queries:** Respond to media requests for expert quotes
- **Partnerships:** Co-create content with complementary businesses

## Common Mistakes to Avoid
- Keyword stuffing (unnatural keyword usage)
- Duplicate content across pages
- Ignoring mobile optimization
- Not submitting sitemap to Google Search Console
- Buying backlinks (violates Google guidelines)
- Neglecting page speed
- Not updating old content
`,
  },
  {
    slug: "linkedin-profile",
    name: "LinkedIn Profile Optimization",
    description:
      "Optimize LinkedIn profiles with compelling headlines, about sections, experience descriptions, and recommendations. Use when improving a LinkedIn presence for job seeking, networking, or thought leadership.",
    tags: ["marketing", "personal", "writing"],
    readme: `# LinkedIn Profile Optimization

Help users create compelling LinkedIn profiles that attract opportunities.

## When to Use
- Optimizing LinkedIn profile for job searching
- Building professional brand and thought leadership
- Writing compelling headlines and about sections
- Improving profile visibility in recruiter searches

## When NOT to Use
- Resume writing for applications (different format/purpose)
- Other social media platforms (use social-media-strategy)

## Profile Optimization Checklist

### 1. Profile Photo
- Professional headshot (face takes up 60% of frame)
- Good lighting, neutral or simple background
- Friendly expression (slight smile)
- Recent photo (within last 2 years)
- **Profiles with photos get 21x more views**

### 2. Banner Image
- 1584 x 396 pixels
- Options: company branding, professional tagline, value proposition
- Use Canva for free templates

### 3. Headline (Most Important)
220 characters max. This appears everywhere — search results, comments, connection requests.

**Formula:** [Role] | [What you do for whom] | [Key differentiator]

**Examples:**
- ❌ "Marketing Manager at Acme Corp" (boring, default)
- ✅ "Marketing Manager | Helping B2B SaaS companies grow from $1M to $10M ARR | Content Strategy & Demand Gen"
- ✅ "Data Analyst → Data-Driven Decisions | SQL, Python, Tableau | Turning messy data into clear insights"
- ✅ "VP of Sales | Built 3 sales teams from 0 to $5M+ | Startup & Scale-up Specialist"

**For job seekers:**
- ✅ "Senior Software Engineer | React, Node.js, AWS | Open to new opportunities"
- ✅ "Product Manager seeking next role | 8 years in fintech | Ex-Stripe, Ex-Square"

### 4. About Section (2,600 characters)

**Structure:**
\`\`\`
[Hook — compelling opening line that makes people keep reading]

[What you do and who you help — 2-3 sentences]

[Your key achievements — 3-5 bullet points with numbers]

[What drives you / your approach — 1-2 sentences]

[Call to action — what should people do next?]

[Keywords for search — naturally woven in or listed]
\`\`\`

**Example:**
\`\`\`
I help early-stage startups turn chaotic marketing into repeatable growth engines.

After 10 years in B2B marketing — from Series A to IPO — I've learned that the best marketing feels like a conversation, not a campaign. I specialize in content strategy, demand generation, and building marketing teams that punch above their weight.

What I've done:
→ Grew organic traffic from 10K to 500K monthly visitors in 18 months
→ Built a content engine that generated $2M in pipeline quarterly
→ Led a rebrand that increased brand awareness by 340%
→ Managed $1.5M annual marketing budget across 5 channels

I believe marketing should be measurable, customer-centric, and (dare I say) enjoyable.

Currently open to advisory roles and full-time Head of Marketing positions at B2B startups (Series A-B).

Let's connect: [email] or send me a message here.
\`\`\`

### 5. Experience Section

**Don't just list duties — show impact.**

**Formula:** [Action verb] + [what you did] + [measurable result]

**Example:**
\`\`\`
Senior Marketing Manager | Acme Corp | 2021 - Present

• Launched product-led growth strategy that increased free trial signups by 180% in 6 months
• Built and managed a team of 5 marketers across content, paid, and email channels
• Reduced customer acquisition cost by 35% through organic content and SEO optimization
• Created quarterly webinar series averaging 500+ attendees with 15% conversion to demo

Key projects: [Project name], [Project name]
Skills: Content Marketing, Demand Generation, Marketing Analytics, Team Leadership
\`\`\`

### 6. Skills Section
- List 50 skills (maximum)
- Top 3 pinned skills should be your most important
- Ask colleagues to endorse your top skills
- Include both hard skills (tools, technologies) and soft skills

### 7. Recommendations
- Aim for 3-5 recommendations
- Best: from managers, clients, and cross-functional partners
- Offer to write recommendations for others (they'll often reciprocate)

**When requesting:**
"Hi [Name], I'm updating my LinkedIn profile and your perspective would mean a lot. Would you be willing to write a brief recommendation about [specific project or skill]? Happy to do the same for you!"

### 8. Featured Section
Pin your best content:
- Articles you've written
- Posts with high engagement
- External media (press, podcasts, talks)
- Portfolio pieces or case studies

## LinkedIn Search Optimization
LinkedIn search works like a search engine. Include relevant keywords in:
- Headline
- About section
- Experience descriptions
- Skills section

**For job seekers:** Include the exact job titles you're targeting.

## Engagement Strategy
- Post 2-3 times per week
- Comment meaningfully on others' posts daily
- Share insights from your work (not just company announcements)
- Engage with recruiters' and hiring managers' content

## Common Mistakes to Avoid
- Default headline ("Marketing Manager at Acme Corp")
- Empty or generic About section
- Listing duties instead of achievements
- No profile photo or outdated photo
- Not customizing connection request messages
- Only connecting, never engaging with content
`,
  },
  {
    slug: "youtube-content",
    name: "YouTube Content Strategy",
    description:
      "Script YouTube videos, optimize titles and thumbnails, plan channel strategy, and analyze performance. Use when creating YouTube content, growing a channel, or optimizing video performance.",
    tags: ["marketing", "writing"],
    readme: `# YouTube Content Strategy

Help users create effective YouTube content and grow their channels.

## When to Use
- Scripting video content
- Optimizing titles, descriptions, and thumbnails
- Planning channel strategy and content calendar
- Analyzing video performance
- YouTube SEO

## When NOT to Use
- Video editing software tutorials
- Live streaming technical setup
- Other social platforms (use social-media-strategy)

## Video Script Template

\`\`\`
# [Video Title]
**Target length:** [X minutes]
**Target keyword:** [Main search term]

## HOOK (0:00 - 0:30)
[Grab attention in the first 5-10 seconds]
"Did you know that [surprising fact]?"
"In this video, I'll show you [specific promise + timeframe]"
[Preview the value — what will they learn/gain?]

## INTRO (0:30 - 1:00)
[Brief context — why this matters]
[Your credibility — why should they listen to you?]
"If you find this helpful, hit subscribe — I post [topic] videos every [schedule]"

## MAIN CONTENT (1:00 - X:00)

### Point 1: [Subtopic]
[Explain the concept]
[Give an example]
[Show, don't just tell]

### Point 2: [Subtopic]
[Explain the concept]
[Give an example]
[Transition to next point]

### Point 3: [Subtopic]
[Explain the concept]
[Give an example]
[Build toward conclusion]

## CONCLUSION (Last 1-2 minutes)
[Recap the key takeaways — 3 bullet points]
[Call to action: "If you want to go deeper, check out [related video]"]
[End screen: "Subscribe and hit the bell for more [topic] content"]
\`\`\`

## Title Optimization

**Winning Title Formulas:**
- "How to [Result] in [Timeframe]" → "How to Lose 10 Pounds in 30 Days"
- "[Number] [Topic] That [Benefit]" → "7 Budget Hacks That Saved Me $10K"
- "[Topic] for Beginners — [Year] Complete Guide"
- "I Tried [Thing] for [Time] — Here's What Happened"
- "Stop [Common Mistake] — Do This Instead"
- "[Surprising Statement] (Here's Why)"

**Title Rules:**
- Keep under 60 characters (doesn't get cut off)
- Front-load the keyword
- Include a number when possible
- Create curiosity gap (but don't clickbait)
- A/B test titles using YouTube's built-in tool

## Thumbnail Design

**Elements of a Great Thumbnail:**
1. **Face with emotion** (surprised, excited, thoughtful)
2. **Large, readable text** (3-5 words max, contrasting colors)
3. **Bright colors** (yellow, red, blue stand out in feed)
4. **Clear subject** (simple, not cluttered)
5. **Contrast** (thumbnail should pop against white/dark backgrounds)

**Technical specs:** 1280 x 720 pixels, 16:9 aspect ratio, < 2MB

## Description Template
\`\`\`
[First 2 lines are critical — they show in search results]
[Summary of what the video covers + key benefit]

⏱️ Timestamps:
0:00 - Introduction
1:30 - [Topic 1]
4:00 - [Topic 2]
7:00 - [Topic 3]
10:00 - Summary

📚 Resources mentioned:
- [Link to resource 1]
- [Link to resource 2]

🔗 Related videos:
- [Video title + link]
- [Video title + link]

📱 Connect with me:
- Instagram: [link]
- Twitter: [link]
- Website: [link]

#keyword1 #keyword2 #keyword3
\`\`\`

## YouTube SEO
1. **Target keyword in:** title, description (first 2 lines), tags, spoken in video
2. **Tags:** Primary keyword, variations, related topics (15-20 tags)
3. **Chapters/timestamps:** Help YouTube understand content structure
4. **Closed captions:** Upload corrected captions (improves accessibility and SEO)
5. **Cards & end screens:** Keep viewers on your channel

## Content Strategy

### Content Types
- **Search-based:** Answer specific questions (evergreen, steady traffic)
- **Trending:** Current events, trends (spiky traffic)
- **Community:** Vlogs, Q&A, behind-the-scenes (builds loyalty)

**Ideal mix:** 60% search-based, 20% trending, 20% community

### Posting Frequency
- Minimum: 1 video/week for growth
- Consistency matters more than frequency
- Pick a schedule you can maintain for 6+ months

## Analytics to Track
| Metric | What It Means | Benchmark |
|--------|--------------|-----------|
| Click-through Rate (CTR) | % who click after seeing thumbnail | 4-10% |
| Average View Duration | How long people watch | 50%+ of video length |
| Impressions | How many times thumbnail shown | Growing trend |
| Subscriber conversion | Views → subscribers | 1-3% |
| Audience retention graph | Where people drop off | Check for pattern |

## Common Mistakes to Avoid
- Weak hooks (viewers leave in first 30 seconds)
- No call to action (tell people to subscribe, comment, watch next)
- Inconsistent posting schedule
- Ignoring analytics (watch retention graphs to improve)
- Thumbnails with too much text or poor contrast
- Not responding to comments (engagement boosts algorithm)
`,
  },
  {
    slug: "email-marketing",
    name: "Email Marketing",
    description:
      "Create newsletter templates, write compelling subject lines, set up A/B tests, and design automation sequences. Use when building email campaigns, growing a mailing list, or improving email engagement.",
    tags: ["marketing", "business", "writing"],
    readme: `# Email Marketing

Help users create effective email campaigns and automation sequences.

## When to Use
- Writing email campaigns and newsletters
- Creating subject lines that get opens
- Designing email automation sequences
- A/B testing email elements
- Growing and managing email lists

## When NOT to Use
- Transactional emails (order confirmations, password resets)
- Cold sales outreach (use sales-crm)
- SMS marketing

## Email Campaign Template

\`\`\`
FROM: [Name] <name@company.com>  (use a real person's name, not "info@")
SUBJECT: [Subject line — see formulas below]
PREVIEW TEXT: [First 90 chars that show in inbox preview]

---

Hi [First Name],

[Opening — hook them in 1-2 sentences. Personal, relevant, or surprising.]

[Body — the main value. Keep it scannable:]
• Bullet points for key info
• Short paragraphs (2-3 sentences max)
• Bold key phrases for skimmers

[Call to Action — one clear, specific action]

[Button: "Get the Free Template" or "Book Your Call"]

[Closing — personal, warm]
[Name]

P.S. [Optional: second hook, urgency, or different angle on the CTA]

---
[Footer: Company name, address, unsubscribe link (required by law)]
\`\`\`

## Subject Line Formulas

**Curiosity:**
- "The one thing most people forget about [topic]"
- "I was wrong about [topic]..."
- "This changed how I think about [topic]"

**Benefit-driven:**
- "How to [achieve result] in [timeframe]"
- "[Number] ways to [benefit] without [pain point]"
- "Your [topic] checklist (free download)"

**Urgency:**
- "Last chance: [offer] ends tonight"
- "[Time-sensitive thing] — don't miss this"
- "Only [number] spots left"

**Personal:**
- "[First Name], quick question about [topic]"
- "Remember when you [action they took]?"

**Rules:**
- 30-50 characters ideal (shows fully on mobile)
- Don't use ALL CAPS or excessive !!! or emojis
- Avoid spam triggers: "free," "buy now," "act now"
- Test 2-3 subject lines per campaign

## Email Automation Sequences

### Welcome Sequence (New Subscribers)
| Email | Timing | Subject | Content |
|-------|--------|---------|---------|
| 1 | Immediately | "Welcome! Here's your [resource]" | Deliver lead magnet, introduce yourself |
| 2 | Day 2 | "The #1 mistake with [topic]" | Educational, build credibility |
| 3 | Day 4 | "How [person] achieved [result]" | Social proof / case study |
| 4 | Day 7 | "Quick question for you" | Ask what they're struggling with |
| 5 | Day 10 | "Ready to [achieve goal]?" | Soft pitch for product/service |

### Cart Abandonment
| Email | Timing | Content |
|-------|--------|---------|
| 1 | 1 hour | "You left something behind" — reminder with product image |
| 2 | 24 hours | "Still interested?" — address common objections |
| 3 | 72 hours | "Last chance: 10% off your cart" — incentive |

### Re-engagement (Inactive Subscribers)
| Email | Content |
|-------|---------|
| 1 | "We miss you — here's what you've been missing" |
| 2 | "Do you still want to hear from us?" (yes/no click) |
| 3 | "Final email — we're cleaning our list" (remove if no response) |

## A/B Testing Guide

### What to Test (in priority order)
1. **Subject lines** — biggest impact on open rates
2. **Send time** — day of week and time of day
3. **CTA** — button text, color, placement
4. **Content length** — short vs. long
5. **From name** — personal name vs. company name

### Testing Rules
- Test ONE variable at a time
- Minimum 1,000 recipients per variation
- Run test for at least 24 hours
- Statistical significance before declaring winner

## Key Metrics
| Metric | Good | Great | Fix If Below |
|--------|------|-------|-------------|
| Open Rate | 20-25% | 30%+ | 15% |
| Click Rate | 2-3% | 5%+ | 1% |
| Unsubscribe Rate | < 0.5% | < 0.2% | > 1% |
| Bounce Rate | < 2% | < 0.5% | > 5% |
| Spam Complaint Rate | < 0.1% | < 0.05% | > 0.1% |

## Email Deliverability
- Authenticate: SPF, DKIM, DMARC records
- Clean your list regularly (remove bounces, inactive)
- Use double opt-in for new subscribers
- Include plain text version alongside HTML
- Always include unsubscribe link (CAN-SPAM / GDPR required)
- Warm up new sending domains gradually

## Common Mistakes to Avoid
- Sending without permission (spam = legal liability)
- No personalization (at minimum use first name)
- Too many CTAs (pick ONE action per email)
- Sending only promotional content (value first, sell second)
- Not segmenting your list (different audiences need different messages)
- Ignoring mobile (60%+ of emails opened on mobile)
- Not testing before sending (broken links, images, formatting)
`,
  },

  // ==========================================
  // PERSONAL LIFE
  // ==========================================
  {
    slug: "recipe-meal-planner",
    name: "Recipe & Meal Planner",
    description:
      "Plan weekly meals, create grocery lists, scale recipes, and track nutrition. Use when meal planning, organizing recipes, creating shopping lists, or calculating nutritional information.",
    tags: ["personal", "productivity"],
    readme: `# Recipe & Meal Planner

Help users plan meals, organize recipes, create shopping lists, and track nutrition.

## When to Use
- Weekly meal planning
- Creating grocery/shopping lists
- Scaling recipes up or down
- Nutritional calculations
- Organizing recipe collections
- Dietary restriction accommodations

## When NOT to Use
- Medical dietary advice (consult a healthcare provider)
- Restaurant menu design (use a design tool)

## Weekly Meal Plan Template

\`\`\`
# Week of [Date]

| | Breakfast | Lunch | Dinner | Snacks |
|---|-----------|-------|--------|--------|
| Mon | Oatmeal + berries | Leftover stir-fry | Chicken stir-fry + rice | Apple + PB |
| Tue | Eggs + toast | Turkey wrap | Pasta primavera | Yogurt + granola |
| Wed | Smoothie | Chicken salad | Tacos | Hummus + veggies |
| Thu | Oatmeal + banana | Leftover pasta | Salmon + roast veggies | Trail mix |
| Fri | Eggs + avocado toast | Soup + bread | Pizza (homemade) | Fruit |
| Sat | Pancakes | Leftovers | Grilled chicken + salad | Cheese + crackers |
| Sun | Brunch: eggs benedict | Light lunch | Meal prep for week | Popcorn |

## Prep Notes
- Sunday: Meal prep chicken, chop veggies, make soup base
- Wednesday: Defrost salmon for Thursday
\`\`\`

## Grocery List Generator

From the meal plan, organize by store section:

\`\`\`
## Grocery List — Week of [Date]

### 🥬 Produce
- [ ] Mixed berries (2 pints)
- [ ] Bananas (bunch)
- [ ] Avocados (3)
- [ ] Bell peppers (3)
- [ ] Broccoli (2 heads)
- [ ] Salad mix (1 bag)
- [ ] Onions (3)
- [ ] Garlic (1 head)

### 🥩 Meat & Seafood
- [ ] Chicken breasts (2 lbs)
- [ ] Salmon fillets (4)
- [ ] Ground turkey (1 lb)

### 🧀 Dairy & Eggs
- [ ] Eggs (1 dozen)
- [ ] Greek yogurt (32 oz)
- [ ] Shredded cheese (1 bag)
- [ ] Butter

### 🍞 Bakery & Grains
- [ ] Whole wheat bread
- [ ] Tortillas (8-pack)
- [ ] Pasta (1 lb)
- [ ] Rice (2 lbs)
- [ ] Oats

### 🥫 Pantry
- [ ] Olive oil
- [ ] Soy sauce
- [ ] Canned tomatoes (2)
- [ ] Chicken broth
- [ ] Peanut butter

### ❄️ Frozen
- [ ] Frozen vegetables (stir-fry mix)
\`\`\`

## Recipe Scaling

### Scaling Formula
\`\`\`
New Amount = Original Amount × (Desired Servings / Original Servings)
\`\`\`

**Example:** Recipe serves 4, need to serve 6:
- Multiplier: 6/4 = 1.5
- 2 cups flour → 3 cups
- 1 tsp salt → 1.5 tsp
- 3 eggs → 4-5 eggs (round to nearest whole)

### Scaling Tips
- Don't scale spices/salt linearly for large batches — use 75% of calculated amount and adjust to taste
- Baking is more sensitive to scaling than cooking
- Cooking times may change for larger quantities
- Pan/pot size matters — don't overcrowd

## Nutrition Quick Reference

### Approximate Calories per Serving
| Food | Serving | Calories | Protein |
|------|---------|----------|---------|
| Chicken breast | 4 oz | 130 | 26g |
| Salmon | 4 oz | 200 | 23g |
| Rice (cooked) | 1 cup | 200 | 4g |
| Pasta (cooked) | 1 cup | 220 | 8g |
| Egg | 1 large | 70 | 6g |
| Banana | 1 medium | 105 | 1g |
| Avocado | 1/2 | 160 | 2g |
| Greek yogurt | 1 cup | 130 | 20g |

### Daily Targets (General Adult)
- Calories: 1,800-2,500 (varies by activity/goals)
- Protein: 0.8-1g per lb body weight
- Fiber: 25-35g
- Water: 8+ cups

## Meal Prep Strategy
1. **Choose 2-3 proteins** for the week (cook all Sunday)
2. **Prep vegetables** — wash, chop, store in containers
3. **Cook grains** — rice, quinoa, pasta (store separately)
4. **Make sauces/dressings** — store in jars
5. **Assemble meals** — combine on the day or pre-pack lunches

**Storage times (refrigerator):**
- Cooked chicken/meat: 3-4 days
- Cooked rice/grains: 4-5 days
- Cut vegetables: 3-5 days
- Soups/stews: 3-4 days

## Common Dietary Swaps
| Instead of | Try | For |
|-----------|-----|-----|
| Pasta | Zucchini noodles | Low carb |
| Rice | Cauliflower rice | Low carb |
| Bread | Lettuce wraps | Low carb/gluten-free |
| Cream | Coconut cream | Dairy-free |
| Butter | Olive oil | Dairy-free |
| Eggs (baking) | Flax egg (1 tbsp flax + 3 tbsp water) | Vegan |
| Meat | Tofu, tempeh, legumes | Plant-based |
`,
  },
  {
    slug: "travel-planner",
    name: "Travel Planner",
    description:
      "Create travel itineraries, track budgets, make packing lists, and research destinations. Use when planning trips, organizing travel details, or creating day-by-day vacation schedules.",
    tags: ["personal", "productivity"],
    readme: `# Travel Planner

Help users plan trips efficiently with itineraries, budgets, and checklists.

## When to Use
- Planning trip itineraries (day-by-day schedules)
- Creating travel budgets
- Packing list generation
- Destination research and recommendations
- Organizing travel documents and bookings

## When NOT to Use
- Booking flights/hotels directly (use travel booking sites)
- Visa/immigration legal advice (check official government sites)
- Real-time flight tracking

## Trip Itinerary Template

\`\`\`
# [Destination] Trip — [Dates]

## Trip Overview
- **Dates:** [Start] to [End] ([X] days)
- **Travelers:** [Names/count]
- **Budget:** $[Total]
- **Theme:** [Relaxation / Adventure / Culture / Business]

## Bookings Summary
| Item | Details | Confirmation # | Cost |
|------|---------|---------------|------|
| Flight | [Airline] [Flight#] — [Departure → Arrival] | ABC123 | $X |
| Hotel | [Hotel Name], [Address] | DEF456 | $X/night |
| Car Rental | [Company] — [Pickup/Return] | GHI789 | $X |

## Day-by-Day Itinerary

### Day 1 — [Date] (Arrival)
| Time | Activity | Location | Notes | Cost |
|------|----------|----------|-------|------|
| 10:00 | Arrive at airport | [Airport] | Terminal X | — |
| 11:00 | Hotel check-in | [Hotel] | Check-in after 3pm, store luggage | — |
| 12:00 | Lunch | [Restaurant] | Reservation under [Name] | ~$40 |
| 14:00 | [Activity] | [Location] | Book tickets online | $25/pp |
| 18:00 | Dinner | [Restaurant] | Walk from hotel (10 min) | ~$60 |

### Day 2 — [Date]
[Same format...]

### Day X — [Date] (Departure)
| Time | Activity | Notes |
|------|----------|-------|
| 9:00 | Hotel checkout | |
| 10:00 | Last-minute shopping/sightseeing | |
| 13:00 | Head to airport | Allow 2+ hours for international |
| 16:00 | Flight departs | |
\`\`\`

## Travel Budget Template

| Category | Budgeted | Actual | Notes |
|----------|----------|--------|-------|
| ✈️ Flights | $X | $X | |
| 🏨 Accommodation | $X | $X | X nights × $X/night |
| 🚗 Transportation | $X | $X | Car rental, taxis, transit |
| 🍽️ Food & Drink | $X | $X | $X/day × X days |
| 🎯 Activities | $X | $X | Tours, tickets, experiences |
| 🛍️ Shopping | $X | $X | Souvenirs, gifts |
| 📱 Misc | $X | $X | SIM card, tips, emergency |
| **TOTAL** | **$X** | **$X** | |

**Budget tips:**
- Food: estimate $30-50/person/day (budget) to $75-150 (mid-range)
- Activities: research specific costs online and pre-book
- Buffer: add 10-15% for unexpected expenses
- Track spending daily with a simple notes app

## Packing List

### Essentials (Every Trip)
- [ ] Passport / ID
- [ ] Phone + charger
- [ ] Wallet (cards, cash, travel insurance card)
- [ ] Medications
- [ ] Travel insurance documents
- [ ] Copies of important documents (digital + paper)

### Clothing (Adjust for climate/duration)
- [ ] Underwear ([X] days + 1 extra)
- [ ] Socks ([X] pairs)
- [ ] Tops ([X])
- [ ] Bottoms ([X])
- [ ] Jacket/layers
- [ ] Sleepwear
- [ ] Comfortable walking shoes
- [ ] Dress shoes/sandals (if needed)
- [ ] Swimwear (if applicable)

### Toiletries
- [ ] Toothbrush + toothpaste
- [ ] Deodorant
- [ ] Sunscreen
- [ ] Shampoo/conditioner (travel size)
- [ ] Any personal care items
- [ ] First aid basics (band-aids, pain reliever)

### Tech
- [ ] Phone charger + portable battery
- [ ] Travel adapter (for international)
- [ ] Camera (if separate from phone)
- [ ] Headphones
- [ ] Laptop/tablet (if needed)

### Travel Comfort
- [ ] Neck pillow (long flights)
- [ ] Eye mask + earplugs
- [ ] Snacks for travel days
- [ ] Water bottle (empty through security)
- [ ] Book / entertainment

## Pre-Trip Checklist
- [ ] Passport valid for 6+ months beyond travel dates
- [ ] Visa requirements checked
- [ ] Travel insurance purchased
- [ ] Bank notified of travel dates
- [ ] Auto-reply set on email
- [ ] Pet/plant care arranged
- [ ] Home secured (lights on timer, mail held)
- [ ] Downloaded offline maps
- [ ] Key reservations confirmed
- [ ] Emergency contacts shared with someone at home

## Tips
- Book flights 6-8 weeks ahead for best domestic prices
- International flights: 2-3 months ahead
- Screenshot confirmations (don't rely on WiFi at airport)
- Learn 5 phrases in local language (hello, thank you, excuse me, help, how much)
- Keep digital and physical copies of all documents
`,
  },
  {
    slug: "fitness-workout",
    name: "Fitness & Workout Plans",
    description:
      "Create workout plans, exercise routines, track progress, and calculate nutrition macros. Use when building exercise programs, planning workouts, or tracking fitness goals.",
    tags: ["personal"],
    readme: `# Fitness & Workout Plans

Help users create and follow effective exercise programs.

## When to Use
- Creating workout routines (home or gym)
- Building exercise programs for specific goals
- Tracking workout progress
- Calculating macros and nutrition for fitness
- Exercise form guidance and alternatives

## When NOT to Use
- Medical advice or injury rehabilitation (see a doctor/physio)
- Specific medical conditions or eating disorders
- Supplement recommendations
- Bodybuilding competition prep (needs specialized coaching)

## ⚠️ Disclaimer
Consult a healthcare provider before starting any exercise program, especially if you have medical conditions or haven't been active recently.

## Workout Plan Templates

### Beginner Full Body (3 days/week)

**Day A (Mon):**
| Exercise | Sets | Reps | Rest |
|----------|------|------|------|
| Goblet Squat | 3 | 10-12 | 90s |
| Push-ups (or knee push-ups) | 3 | 8-12 | 60s |
| Dumbbell Row | 3 | 10 each arm | 60s |
| Glute Bridge | 3 | 12-15 | 60s |
| Plank | 3 | 30-45 sec | 60s |

**Day B (Wed):**
| Exercise | Sets | Reps | Rest |
|----------|------|------|------|
| Lunges | 3 | 10 each leg | 90s |
| Dumbbell Shoulder Press | 3 | 10-12 | 60s |
| Lat Pulldown (or Band Pulldowns) | 3 | 10-12 | 60s |
| Romanian Deadlift | 3 | 10-12 | 90s |
| Dead Bug | 3 | 8 each side | 60s |

**Day C (Fri):** Same as Day A with slight weight increase

### Intermediate Upper/Lower Split (4 days/week)

**Upper A (Mon):**
| Exercise | Sets | Reps |
|----------|------|------|
| Bench Press | 4 | 6-8 |
| Barbell Row | 4 | 6-8 |
| Overhead Press | 3 | 8-10 |
| Lat Pulldown | 3 | 10-12 |
| Bicep Curls | 2 | 12-15 |
| Tricep Pushdowns | 2 | 12-15 |

**Lower A (Tue):**
| Exercise | Sets | Reps |
|----------|------|------|
| Squat | 4 | 6-8 |
| Romanian Deadlift | 3 | 8-10 |
| Leg Press | 3 | 10-12 |
| Walking Lunges | 3 | 10/leg |
| Calf Raises | 3 | 15-20 |
| Plank | 3 | 45-60 sec |

**Upper B (Thu) & Lower B (Fri):** Similar with exercise variations

### Home Workout (No Equipment)
| Exercise | Sets | Reps |
|----------|------|------|
| Bodyweight Squats | 3 | 15-20 |
| Push-ups | 3 | 10-15 |
| Reverse Lunges | 3 | 10/leg |
| Superman Hold | 3 | 15 |
| Mountain Climbers | 3 | 20 total |
| Plank | 3 | 30-60 sec |
| Burpees | 3 | 8-10 |

## Progress Tracking

### Workout Log
| Date | Exercise | Weight | Sets × Reps | Notes |
|------|----------|--------|-------------|-------|
| 3/15 | Squat | 135 lbs | 4×8 | Felt strong |
| 3/15 | Bench Press | 115 lbs | 4×6 | Last rep was tough |

### Progressive Overload Rules
The key to getting stronger:
1. **Add reps first:** If prescription is 3×8-12, start at 8 reps
2. **When you hit the top of rep range:** Increase weight by 5-10 lbs
3. **Reset reps:** Go back to bottom of range with new weight
4. **Track everything:** You can't improve what you don't measure

## Nutrition for Fitness

### Macro Calculator (Simple)
**To lose fat:** Bodyweight × 10-12 = daily calories
**To maintain:** Bodyweight × 14-16 = daily calories
**To gain muscle:** Bodyweight × 16-18 = daily calories

**Macro split:**
- Protein: 1g per lb bodyweight (most important)
- Fat: 0.3-0.4g per lb bodyweight
- Carbs: remaining calories ÷ 4

**Example (180 lb person wanting to build muscle):**
- Calories: 180 × 17 = 3,060
- Protein: 180g (720 cal)
- Fat: 65g (585 cal)
- Carbs: 439g (1,755 cal)

### Pre/Post Workout Nutrition
- **Pre-workout (1-2 hrs before):** Carbs + moderate protein (banana + protein shake, oatmeal + eggs)
- **Post-workout (within 2 hrs):** Protein + carbs (chicken + rice, protein shake + fruit)

## Common Mistakes to Avoid
- Skipping warm-up (5-10 min light cardio + dynamic stretching)
- Going too heavy too fast (ego lifting = injury risk)
- Not resting enough between sets or between workouts
- Changing programs too often (stick with one for 8-12 weeks)
- Neglecting sleep (7-9 hours is when you actually recover and grow)
- Only doing exercises you like (balance push/pull/legs)
`,
  },
  {
    slug: "event-planner",
    name: "Event Planner",
    description:
      "Plan parties, weddings, conferences, and events with timelines, vendor management, guest lists, and budgets. Use when organizing any type of event from small gatherings to large conferences.",
    tags: ["personal", "productivity", "business"],
    readme: `# Event Planner

Help users plan and organize events of all sizes.

## When to Use
- Planning parties, weddings, conferences, or corporate events
- Creating event timelines and run-of-show
- Managing vendor contacts and contracts
- Guest list management and RSVPs
- Event budgeting

## When NOT to Use
- Project management for non-event work (use project-management)
- Marketing the event online (use social-media-strategy or email-marketing)

## Event Planning Timeline

### 6+ Months Before
- [ ] Define event purpose, goals, and success metrics
- [ ] Set budget
- [ ] Choose date(s) — check for conflicts (holidays, competing events)
- [ ] Book venue
- [ ] Book key vendors (catering, entertainment, photographer)
- [ ] Create guest list

### 3-6 Months Before
- [ ] Send save-the-dates (weddings) or early announcements
- [ ] Finalize vendor contracts
- [ ] Plan menu/catering
- [ ] Design event branding (invitations, signage)
- [ ] Arrange accommodations for out-of-town guests
- [ ] Plan entertainment/speakers/activities

### 1-3 Months Before
- [ ] Send invitations
- [ ] Order supplies/decorations
- [ ] Create event schedule/run-of-show
- [ ] Arrange transportation/parking
- [ ] Plan seating arrangements
- [ ] Confirm all vendor details

### 1-2 Weeks Before
- [ ] Final headcount to caterer
- [ ] Confirm all vendors
- [ ] Create day-of timeline for staff/volunteers
- [ ] Prepare name tags, programs, signage
- [ ] Brief event team on roles
- [ ] Weather backup plan (if outdoor)

### Day Of
- [ ] Arrive early for setup
- [ ] Vendor check-in and setup
- [ ] Final walkthrough
- [ ] Run the event!
- [ ] Coordinate cleanup

### After Event
- [ ] Send thank-you notes
- [ ] Pay remaining vendor invoices
- [ ] Collect feedback (survey)
- [ ] Review budget vs. actual
- [ ] Share photos/recap

## Event Budget Template

| Category | Estimated | Actual | Paid | Notes |
|----------|-----------|--------|------|-------|
| **Venue** | | | | |
| Rental fee | $X | | ☐ | |
| Insurance | $X | | ☐ | |
| **Food & Beverage** | | | | |
| Catering | $X | | ☐ | $X per person × guests |
| Bar/beverages | $X | | ☐ | |
| Cake/dessert | $X | | ☐ | |
| **Entertainment** | | | | |
| DJ/Band/Speaker | $X | | ☐ | |
| Activities | $X | | ☐ | |
| **Décor** | | | | |
| Flowers | $X | | ☐ | |
| Decorations | $X | | ☐ | |
| Lighting | $X | | ☐ | |
| **Services** | | | | |
| Photography | $X | | ☐ | |
| Videography | $X | | ☐ | |
| Event planner | $X | | ☐ | |
| **Logistics** | | | | |
| Invitations/printing | $X | | ☐ | |
| Transportation | $X | | ☐ | |
| Rentals (tables, chairs) | $X | | ☐ | |
| **Contingency (10%)** | $X | | | |
| **TOTAL** | **$X** | **$X** | | |

## Run-of-Show Template

| Time | Activity | Location | Responsible | Notes |
|------|----------|----------|-------------|-------|
| 8:00 AM | Vendor load-in | Back entrance | Event Manager | Unlock doors by 7:45 |
| 10:00 AM | Setup complete | Main hall | All staff | Final walkthrough |
| 11:00 AM | Doors open | Main entrance | Volunteers | Check-in desk ready |
| 11:30 AM | Welcome remarks | Main stage | Host | Mic check at 11:15 |
| 12:00 PM | Lunch service | Dining area | Caterer | Dietary options labeled |
| 1:00 PM | Keynote speaker | Main stage | A/V team | Slides pre-loaded |
| 2:30 PM | Breakout sessions | Rooms A, B, C | Session leads | Signage in place |
| 4:00 PM | Closing remarks | Main stage | Host | |
| 4:30 PM | Event ends | | | |
| 5:00 PM | Cleanup begins | All areas | All staff | Vendor pickup by 7 PM |

## Guest List Management

| Name | Email | RSVP | Plus One | Dietary | Table | Notes |
|------|-------|------|----------|---------|-------|-------|
| [Name] | [Email] | ✅ Yes | +1 (Sarah) | Vegetarian | 3 | |
| [Name] | [Email] | ❌ No | — | — | — | Sent gift |
| [Name] | [Email] | ❓ Pending | TBD | — | — | Follow up 3/20 |

## Vendor Contact Sheet

| Vendor | Company | Contact | Phone | Email | Contract? | Deposit Paid? |
|--------|---------|---------|-------|-------|-----------|--------------|
| Caterer | [Name] | [Person] | [Phone] | [Email] | ✅ | ✅ |
| DJ | [Name] | [Person] | [Phone] | [Email] | ✅ | ✅ |
| Florist | [Name] | [Person] | [Phone] | [Email] | ❌ | ❌ |

## Tips
- Always have a backup plan (weather, vendor cancellation, tech failure)
- Over-communicate with vendors — confirm everything in writing
- Build 30-minute buffers into your timeline
- Designate a point person for each area
- Keep emergency kit: tape, scissors, pins, stain remover, phone chargers, first aid
- Take photos of the setup for future reference
`,
  },
  {
    slug: "language-learning",
    name: "Language Learning",
    description:
      "Build vocabulary, practice grammar, create flashcards, and design conversation drills. Use when learning a new language, practicing skills, or creating study materials for language learning.",
    tags: ["education", "personal"],
    readme: `# Language Learning

Help users learn and practice new languages effectively.

## When to Use
- Building vocabulary lists and flashcards
- Grammar explanations and practice
- Conversation practice and drills
- Language study plans
- Translation help with learning context
- Pronunciation guides

## When NOT to Use
- Professional translation services (for official documents)
- Real-time interpretation

## Study Plan Template

### Beginner (0-3 months)
| Week | Focus | Daily Practice (30 min) |
|------|-------|------------------------|
| 1-2 | Alphabet/sounds, greetings, numbers 1-20 | 15 min flashcards + 15 min listening |
| 3-4 | Basic phrases (please, thank you, where is...) | 15 min flashcards + 15 min practice |
| 5-6 | Present tense verbs, common nouns (100 words) | 10 min grammar + 10 min vocab + 10 min listening |
| 7-8 | Basic conversations (ordering food, directions) | 10 min review + 20 min conversation practice |
| 9-12 | Past tense, questions, 500-word vocabulary | Mixed practice: reading + listening + speaking |

### Intermediate (3-12 months)
- Read simple texts (children's books, news summaries)
- Watch shows/movies with subtitles (target language → English → no subs)
- Practice conversations with native speakers or language exchange
- Learn 10-15 new words per day
- Study grammar patterns in context (not isolated rules)

## Vocabulary Building Methods

### Flashcard Format (Spaced Repetition)
\`\`\`
FRONT: [Word in target language]
BACK: [Translation] | [Example sentence] | [Pronunciation guide]

Example:
FRONT: 食べる (たべる)
BACK: to eat | 私は寿司を食べる (I eat sushi) | ta-be-ru
\`\`\`

### Word Categories to Learn First
1. **Survival words (50):** Yes, no, hello, goodbye, please, thank you, sorry, help, I don't understand
2. **Pronouns (10):** I, you, he/she, we, they, this, that
3. **Common verbs (30):** be, have, go, come, want, need, eat, drink, speak, know, like, can
4. **Common nouns (50):** food, water, person, house, car, time, day, money, phone, street
5. **Numbers:** 1-100
6. **Question words:** who, what, where, when, why, how, how much
7. **Time words:** today, tomorrow, yesterday, now, later, morning, night

### The 80/20 Rule of Vocabulary
- The most common 1,000 words cover ~85% of everyday conversation
- The most common 3,000 words cover ~95%
- Focus on frequency, not obscure vocabulary

## Grammar Practice Patterns

### Sentence Building Drill
Start simple, add complexity:
1. "I eat." → 
2. "I eat rice." → 
3. "I eat rice every day." → 
4. "I eat rice every day at home." → 
5. "I don't eat rice every day at home." → 

### Substitution Drill
Base sentence: "I go to the store."
- Change subject: "She goes to the store."
- Change verb: "She walks to the store."
- Change object: "She walks to the park."
- Change tense: "She walked to the park."

## Conversation Practice

### Role-Play Scenarios (Beginner)
1. **At a restaurant:** Order food, ask for the menu, pay the bill
2. **Asking directions:** Where is the station? Turn left, go straight
3. **Shopping:** How much is this? Do you have it in [size/color]?
4. **Self-introduction:** Name, nationality, job, hobbies
5. **Hotel check-in:** Reservation, room number, WiFi password

### Conversation Starters (Intermediate)
1. Tell me about your typical day
2. What did you do last weekend?
3. What are your plans for the holidays?
4. Describe your hometown
5. What's your opinion on [current topic]?

## Learning Tips
- **Consistency > intensity:** 30 min daily beats 3 hours on weekends
- **Use spaced repetition:** Review at increasing intervals (1 day, 3 days, 7 days, 14 days)
- **Learn in context:** Sentences > isolated words
- **Make mistakes:** Errors are learning opportunities, not failures
- **Immerse yourself:** Change phone language, listen to podcasts, watch shows
- **Speak from day one:** Don't wait until you're "ready"
- **Focus on communication:** Being understood matters more than being perfect

## Resources by Method
- **Apps:** Anki (flashcards), Duolingo (gamified), HelloTalk (language exchange)
- **Listening:** Podcasts for learners, YouTube channels, music
- **Reading:** Graded readers, dual-language books, news in simple language
- **Speaking:** Language exchange partners, tutors (iTalki), conversation groups
`,
  },

  // ==========================================
  // FINANCE
  // ==========================================
  {
    slug: "tax-preparation",
    name: "Tax Preparation",
    description:
      "Organize tax documents, track deductions, create filing checklists, and understand tax concepts. Use when preparing for tax season, organizing receipts and documents, or understanding tax obligations.",
    tags: ["finance", "personal"],
    readme: `# Tax Preparation

Help users organize and prepare for tax filing.

## When to Use
- Organizing tax documents and receipts
- Creating tax preparation checklists
- Understanding common deductions and credits
- Tax timeline planning
- Estimating tax liability

## When NOT to Use
- This is NOT tax advice. Consult a tax professional for your specific situation.
- Filing taxes (use tax software or a professional)
- Complex tax situations (business structures, international income, audits)
- State/provincial-specific rules without verification

## ⚠️ Important Disclaimer
This skill provides general tax organization guidance, NOT professional tax advice. Tax laws vary by country, state/province, and individual circumstances. Always consult a qualified tax professional for your specific situation.

## Tax Document Checklist

### Income Documents
- [ ] W-2 forms (from employers) — US / T4 slips — Canada
- [ ] 1099 forms (freelance, investment, interest income) — US / T5 — Canada
- [ ] K-1 forms (partnership/trust income)
- [ ] Social Security / pension statements
- [ ] Rental income records
- [ ] Sale of assets (stocks, property, crypto)
- [ ] Any other income documentation

### Deduction Documents
- [ ] Mortgage interest statement (1098)
- [ ] Property tax receipts
- [ ] Charitable donation receipts
- [ ] Medical/dental expense receipts
- [ ] Student loan interest (1098-E)
- [ ] Tuition payments (1098-T)
- [ ] Business expenses (if self-employed)
- [ ] Home office measurements/expenses
- [ ] Vehicle mileage log (if business use)
- [ ] State/local taxes paid

### Personal Information
- [ ] Social Security/SIN numbers (you + dependents)
- [ ] Prior year tax return
- [ ] Bank account info (for direct deposit/payment)
- [ ] ID for e-filing

## Tax Organization System

### Monthly Tracking
Keep a simple spreadsheet or folder system:

| Date | Category | Description | Amount | Receipt? |
|------|----------|-------------|--------|----------|
| 1/15 | Medical | Dr. visit copay | $40 | ✅ |
| 1/20 | Charity | Red Cross donation | $100 | ✅ |
| 2/1 | Business | Software subscription | $29/mo | ✅ |

### Category Organization
Create folders (physical or digital):
1. **Income** — all income statements
2. **Housing** — mortgage, property tax, insurance
3. **Medical** — bills, insurance statements, receipts
4. **Charitable** — donation receipts, acknowledgment letters
5. **Business** — expenses, mileage, home office
6. **Education** — tuition, student loans, books
7. **Investments** — brokerage statements, buy/sell records
8. **Prior Returns** — last 3-7 years of filed returns

## Common Deductions Checklist

### Often Overlooked Deductions
- Home office expenses (dedicated space for work)
- Professional development and education
- Job search expenses
- Moving expenses for work (limited)
- Charitable mileage (driving for volunteer work)
- Sales tax on major purchases
- Teacher classroom expenses
- Health Savings Account (HSA) contributions
- Self-employment tax deduction (50%)

### Self-Employed / Freelancer Deductions
- Home office (square footage method or simplified)
- Internet and phone (business % only)
- Software and subscriptions
- Professional services (accountant, lawyer)
- Business insurance
- Travel for business
- Equipment and supplies- Home office deduction

## Tax Calendar
| Date | Action |
|------|--------|
| Jan 31 | W-2s and 1099s due |
| Apr 15 | Tax filing deadline |
| Jun 15 | Q2 estimated tax |
| Sep 15 | Q3 estimated tax |
| Jan 15 | Q4 estimated tax |
`,
    tags: ["finance", "productivity", "writing"],
  },
];

async function main() {
  const db = createDb();

  // Find or create skillshub-team user
  let [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, "skillshub-team"))
    .limit(1);

  if (!user) {
    [user] = await db
      .insert(users)
      .values({
        username: "skillshub-team",
        displayName: "SkillsHub Team",
        role: "human",
      })
      .returning({ id: users.id });
  }

  // Find or create everyday-skills repo
  let [repo] = await db
    .select({ id: repos.id })
    .from(repos)
    .where(and(eq(repos.githubOwner, "skillshub-team"), eq(repos.githubRepoName, "everyday-skills")))
    .limit(1);

  if (!repo) {
    [repo] = await db
      .insert(repos)
      .values({
        ownerId: user.id,
        name: "everyday-skills",
        displayName: "Everyday Skills",
        description: "Productivity and life skills for non-developers",
        githubOwner: "skillshub-team",
        githubRepoName: "everyday-skills",
        starCount: 0,
      })
      .returning({ id: repos.id });
  }

  let created = 0;
  for (const skill of CURATED_SKILLS) {
    const [existing] = await db
      .select({ id: skills.id })
      .from(skills)
      .where(and(eq(skills.repoId, repo.id), eq(skills.slug, skill.slug)))
      .limit(1);

    if (existing) {
      await db.update(skills).set({
        name: skill.name,
        description: skill.description,
        readme: skill.readme,
        tags: skill.tags,
        updatedAt: new Date(),
      }).where(eq(skills.id, existing.id));
      console.log(`  Updated: ${skill.name}`);
    } else {
      await db.insert(skills).values({
        ownerId: user.id,
        repoId: repo.id,
        slug: skill.slug,
        name: skill.name,
        description: skill.description,
        readme: skill.readme,
        tags: skill.tags,
        isPublished: true,
        source: "manual",
      });
      created++;
      console.log(`  Created: ${skill.name}`);
    }
  }

  console.log(`\nDone! Created ${created} new skills, updated ${CURATED_SKILLS.length - created}.`);
  process.exit(0);
}

main().catch(console.error);
