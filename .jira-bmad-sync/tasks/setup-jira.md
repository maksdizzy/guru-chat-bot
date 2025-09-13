# Setup Jira Project Configuration

## Overview
Interactive setup wizard to configure Jira project connection and mappings for the sync agent.

## Prerequisites
- Valid Jira Cloud access with project permissions
- MCP Atlassian tools available

## Setup Steps

### 1. Project Discovery
1. Use `mcp__atlassian__getAccessibleAtlassianResources` to discover available Jira instances
2. Present numbered list of available cloud instances to user
3. Get user selection for cloud ID

### 2. Project Selection
1. Use `mcp__atlassian__getVisibleJiraProjects` with selected cloud ID
2. Present numbered list of available projects with keys and names
3. Get user selection for project key and name
4. Extract instance URL from cloud ID

### 3. Issue Type Discovery
1. Use `mcp__atlassian__getJiraProjectIssueTypesMetadata` for selected project
2. Automatically map standard issue types:
   - Epic → first Epic type found
   - Story → first Story type found
   - Task → first Task type found
   - Bug → first Bug type found
   - Sub-task → first Sub-task type found
3. Show discovered mappings to user for confirmation

### 4. Configuration Storage
1. Create `.guru-core/config/jira-config.yaml` with:
   ```yaml
   JIRA_CONFIG:
     cloudId: "[discovered-cloud-id]"
     projectKey: "[selected-project-key]"
     projectName: "[selected-project-name]"
     instanceUrl: "[derived-instance-url]"

   ISSUE_TYPE_MAPPING:
     epic: "[discovered-epic-id]"
     story: "[discovered-story-id]"
     task: "[discovered-task-id]"
     bug: "[discovered-bug-id]"
     subtask: "[discovered-subtask-id]"

   STATUS_WORKFLOW:
     backlog: "To Do"
     ready: "To Do"
     in_progress: "In Progress"
     code_review: "In Review"
     testing: "In Review"
     done: "Done"

   PRIORITY_MAPPING:
     critical: "Highest"
     high: "High"
     medium: "Medium"
     low: "Low"
     trivial: "Lowest"
   ```

### 5. Connection Test
1. Use `*connect` command to validate configuration
2. Report success/failure to user
3. If successful, save configuration permanently

## Error Handling
- Handle network connectivity issues
- Validate user permissions for selected project
- Gracefully handle missing issue types
- Provide clear error messages and next steps

## Success Criteria
- Valid Jira connection established
- Project configuration saved
- Issue type mappings discovered
- User can proceed with sync operations

## Next Steps
After successful setup, user can:
- Use `*status` to verify configuration
- Run sync operations like `*sync-epic`
- Use `*config` to review settings