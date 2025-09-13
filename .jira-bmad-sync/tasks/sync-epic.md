# Sync Epic Task

## Purpose
Create or update an epic in TKB Jira project from local documentation.

## Prerequisites
- Jira connection established
- Local epic document exists
- Epic template validated

## Process
1. **Locate Local Epic**
   - Search for epic files in docs/prd or docs/stories
   - Validate epic document format
   - Extract epic metadata (title, description, acceptance criteria)

2. **Check Existing Jira Epic**
   - Search TKB project for matching epic (by title or ID)
   - Compare local vs Jira versions
   - Identify sync conflicts

3. **Sync Operation**
   - If new: Create epic in TKB
   - If exists: Update epic with local changes
   - Maintain epic hierarchy and relationships
   - Sync labels, priority, and components

4. **Link Management**
   - Update local doc with Jira epic key
   - Link related stories to epic
   - Update sync metadata

5. **Validation**
   - Verify epic creation/update
   - Confirm field mapping accuracy
   - Log sync operation

## Inputs Required
- Epic document path or content
- Sync mode (create/update/force)
- Priority level (optional)
- Component assignment (optional)

## Success Criteria
- Epic exists in TKB Jira
- Local doc linked to Jira epic
- All fields synced correctly
- Sync logged in audit trail