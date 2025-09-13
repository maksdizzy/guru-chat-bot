# Jira Helper Utilities

## Connection Helpers

### Test Jira Connection
```javascript
async function testJiraConnection() {
  try {
    const resources = await mcp__atlassian__getAccessibleAtlassianResources();
    const guruResource = resources.find(r => r.name === 'gurunetwork');
    return guruResource ? guruResource.id : null;
  } catch (error) {
    console.error('Jira connection failed:', error);
    return null;
  }
}
```

### Validate Project Access
```javascript
async function validateProjectAccess(cloudId, projectKey) {
  try {
    const projects = await mcp__atlassian__getVisibleJiraProjects({
      cloudId,
      searchString: projectKey,
      action: 'create'
    });
    return projects.values.find(p => p.key === projectKey);
  } catch (error) {
    console.error('Project access validation failed:', error);
    return null;
  }
}
```

## Issue Management Helpers

### Create Epic
```javascript
async function createEpic(cloudId, projectKey, epicData) {
  const issueData = {
    cloudId,
    projectKey,
    issueTypeName: 'Epic',
    summary: epicData.title,
    description: epicData.description,
    additional_fields: {
      priority: { name: epicData.priority || 'Medium' },
      labels: epicData.labels || []
    }
  };

  if (epicData.assignee) {
    issueData.assignee_account_id = epicData.assignee;
  }

  return await mcp__atlassian__createJiraIssue(issueData);
}
```

### Link Story to Epic
```javascript
async function linkStoryToEpic(cloudId, storyKey, epicKey) {
  const updateData = {
    cloudId,
    issueIdOrKey: storyKey,
    fields: {
      'customfield_epic_link': epicKey
    }
  };

  return await mcp__atlassian__editJiraIssue(updateData);
}
```

## Field Mapping Helpers

### Map Local Priority to Jira
```javascript
function mapPriorityToJira(localPriority) {
  const mapping = {
    'critical': 'Highest',
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
    'trivial': 'Lowest'
  };
  return mapping[localPriority] || 'Medium';
}
```

### Map Local Status to Jira
```javascript
function mapStatusToJira(localStatus) {
  const mapping = {
    'backlog': 'To Do',
    'ready': 'To Do',
    'in_progress': 'In Progress',
    'code_review': 'In Review',
    'testing': 'In Review',
    'done': 'Done',
    'closed': 'Done'
  };
  return mapping[localStatus] || 'To Do';
}
```

## Document Parsing Helpers

### Extract Epic Metadata
```javascript
function parseEpicDocument(content) {
  const lines = content.split('\n');
  const epic = {
    title: '',
    description: '',
    priority: 'Medium',
    assignee: null,
    labels: [],
    stories: []
  };

  // Extract title from first heading
  const titleMatch = content.match(/^# Epic: (.+)$/m);
  if (titleMatch) {
    epic.title = titleMatch[1];
  }

  // Extract priority
  const priorityMatch = content.match(/\*\*Priority:\*\* (.+)$/m);
  if (priorityMatch) {
    epic.priority = priorityMatch[1];
  }

  // Extract assignee
  const assigneeMatch = content.match(/\*\*Epic Owner:\*\* (.+)$/m);
  if (assigneeMatch) {
    epic.assignee = assigneeMatch[1];
  }

  // Extract description (text between Summary and User Stories)
  const summaryStart = content.indexOf('## Summary');
  const storiesStart = content.indexOf('## User Stories');
  if (summaryStart !== -1 && storiesStart !== -1) {
    epic.description = content.slice(summaryStart, storiesStart).trim();
  }

  return epic;
}
```

### Extract Story Metadata
```javascript
function parseStoryDocument(content) {
  const story = {
    title: '',
    description: '',
    userStory: '',
    acceptanceCriteria: [],
    storyPoints: null,
    epic: null,
    priority: 'Medium'
  };

  // Extract title
  const titleMatch = content.match(/^# Story: (.+)$/m);
  if (titleMatch) {
    story.title = titleMatch[1];
  }

  // Extract user story
  const userStoryMatch = content.match(/As a (.+), I want (.+) so that (.+)\./);
  if (userStoryMatch) {
    story.userStory = `As a ${userStoryMatch[1]}, I want ${userStoryMatch[2]} so that ${userStoryMatch[3]}.`;
  }

  // Extract story points
  const pointsMatch = content.match(/\*\*Story Points:\*\* \[?(\d+)\]?/);
  if (pointsMatch) {
    story.storyPoints = parseInt(pointsMatch[1]);
  }

  // Extract epic link
  const epicMatch = content.match(/\*\*Epic:\*\* (.+)$/m);
  if (epicMatch) {
    story.epic = epicMatch[1];
  }

  return story;
}
```

## Validation Helpers

### Validate Issue Data
```javascript
function validateIssueData(issueType, data) {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (issueType === 'story' && !data.userStory) {
    errors.push('User story format is required for stories');
  }

  if (issueType === 'bug' && !data.stepsToReproduce) {
    errors.push('Steps to reproduce are required for bugs');
  }

  return errors;
}
```

### Check for Sync Conflicts
```javascript
async function checkSyncConflicts(localDoc, jiraIssue) {
  const conflicts = [];

  if (localDoc.title !== jiraIssue.fields.summary) {
    conflicts.push({
      field: 'title',
      local: localDoc.title,
      jira: jiraIssue.fields.summary
    });
  }

  if (localDoc.description !== jiraIssue.fields.description) {
    conflicts.push({
      field: 'description',
      local: localDoc.description,
      jira: jiraIssue.fields.description
    });
  }

  return conflicts;
}
```