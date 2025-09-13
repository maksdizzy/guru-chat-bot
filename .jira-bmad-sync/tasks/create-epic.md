# Create Epic Task

## Purpose
Create a new epic using the epic template and optionally sync to TKB Jira.

## Prerequisites
- Epic template available
- Target directory identified
- Basic epic information gathered

## Process
1. **Gather Epic Information**
   - Epic title and summary
   - Business value description
   - Success metrics
   - Timeline estimates
   - Assignee (optional)

2. **Create Local Epic Document**
   - Use epic-template.md as base
   - Fill in provided information
   - Generate unique filename
   - Save to appropriate directory (docs/prd or docs/stories)

3. **Template Substitution**
   - Replace [Epic Title] with actual title
   - Fill in summary and description
   - Add user stories if available
   - Set priority and timeline

4. **Optional Jira Sync**
   - Ask user if they want to sync to Jira immediately
   - If yes, call sync-epic task
   - Generate Jira key and update document

5. **Validation**
   - Verify document format
   - Check required fields completed
   - Validate markdown syntax

## Inputs Required
- Epic title (required)
- Epic summary (required)
- Business value description
- Target directory
- Sync to Jira (yes/no)

## Outputs
- New epic document created
- Optional Jira epic created
- Document path returned

## Success Criteria
- Epic document exists and is valid
- All required fields populated
- Jira sync completed (if requested)
- Document follows template structure