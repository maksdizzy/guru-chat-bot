# Jira-BMad Sync Agent 🔄

> **Universal Jira-MCP Sync Specialist** - Seamlessly sync epics, stories, tasks, and bugs with any Jira project using the BMad Method.

## Overview

The Jira-BMad Sync Agent is a specialized BMad agent that provides bidirectional synchronization between local documentation and Jira Cloud instances. It leverages the MCP (Model Context Protocol) Atlassian tools to maintain consistency between your local docs and any configured Jira project while preserving data integrity.

## Key Features

- **Universal Jira Support**: Works with any Jira Cloud instance
- **Bidirectional Sync**: Local docs ↔ Jira issues
- **Issue Type Support**: Epic, Story, Task, Bug, Sub-task
- **Data Integrity**: Preserves relationships and validates sync operations
- **Template-Based Creation**: Standardized templates for all issue types
- **Audit Trail**: Complete logging of all sync operations
- **Conflict Resolution**: Graceful handling of sync conflicts

## Quick Start

### 1. Installation
Copy the `.jira-bmad-sync/` directory to your BMad-enabled project:

```bash
cp -r .jira-bmad-sync/ /path/to/your/project/
```

### 2. Activation
Use the BMad slash command to activate the agent:

```
@.jira-sync-agent/agents/jira-sync-agent.yaml

```

### 3. First-Time Setup
Configure your Jira project connection:

```
*setup
```

### 4. Test Connection
Verify connectivity to your Jira instance:

```
*connect
```

## Core Commands

All commands require the `*` prefix when used with the agent.

### Setup & Configuration
- `*setup` - Configure Jira project connection and mappings
- `*status` - Show Jira connection and sync state
- `*connect` - Test Jira connection to configured project
- `*config` - Show current Jira configuration
- `*workflow` - Show configured project workflow and status mappings

### Create & Sync (Local → Jira)
- `*sync-epic` - Create/update epic in configured project from local docs
- `*sync-story` - Create/update story in configured project from local docs
- `*sync-task` - Create/update task in configured project from local docs
- `*sync-bug` - Create/update bug in configured project from local docs
- `*bulk-sync` - Sync all local docs with Jira

### Pull & Update (Jira → Local)
- `*pull-epic` - Pull epic from configured project to local docs
- `*pull-story` - Pull story from configured project to local docs
- `*pull-issues` - Pull all issues from configured project to local docs

### Create New
- `*create-epic` - Create new epic with template
- `*create-story` - Create new story with template
- `*create-task` - Create new task with template

### Link & Manage
- `*link-epic` - Link existing local doc to Jira epic
- `*link-story` - Link existing local doc to Jira story

### Validation & Audit
- `*validate` - Validate sync integrity
- `*audit` - Show sync audit log

## Configuration

The agent automatically discovers and configures:

### Issue Type Mappings
- Epic → Jira Epic type ID
- Story → Jira Story type ID
- Task → Jira Task type ID
- Bug → Jira Bug type ID
- Sub-task → Jira Sub-task type ID

### Status Workflow Mappings
- `backlog` → "To Do"
- `ready` → "To Do"
- `in_progress` → "In Progress"
- `code_review` → "In Review"
- `testing` → "In Review"
- `done` → "Done"

### Priority Mappings
- `critical` → "Highest"
- `high` → "High"
- `medium` → "Medium"
- `low` → "Low"
- `trivial` → "Lowest"

## Directory Structure

```
.jira-bmad-sync/
├── agents/
│   └── jira-sync-agent.yaml      # Main agent configuration
├── config/
│   └── jira-config.yaml          # Jira project configuration
├── tasks/                        # Sync operation tasks
│   ├── setup-jira.md
│   ├── sync-epic.md
│   ├── sync-story.md
│   ├── create-epic.md
│   └── ...
├── templates/                    # Issue templates
│   ├── epic-template.md
│   ├── story-template.md
│   ├── task-template.md
│   └── bug-template.md
├── checklists/                   # Validation checklists
│   ├── sync-checklist.md
│   └── validation-checklist.md
├── data/                         # Configuration data
│   ├── jira-mappings.yaml
│   └── sync-log.yaml
└── utils/                        # Helper utilities
    ├── jira-helpers.md
    └── sync-utils.md
```

## Prerequisites

- BMad Method framework
- MCP (Model Context Protocol) enabled environment
- Access to Jira Cloud instance
- Claude Code with MCP Atlassian tools

## Workflow Integration

The agent integrates seamlessly with BMad workflows:

1. **Epic Creation**: Use templates to create structured epics
2. **Story Development**: Link stories to epics and sync automatically
3. **Task Management**: Create and track tasks with proper relationships
4. **Bug Tracking**: Standardized bug reporting and resolution tracking

## Data Integrity Features

- **Relationship Preservation**: Maintains epic→story→subtask hierarchies
- **Conflict Detection**: Identifies and resolves sync conflicts
- **Audit Logging**: Complete trail of all sync operations
- **Validation Checks**: Ensures data consistency between local and Jira
- **Rollback Support**: Safe operation with validation before commits

## Example Usage

### Creating and Syncing an Epic
```
*create-epic
# Creates local epic with template
*sync-epic
# Syncs to configured Jira project
```

### Pulling Updates from Jira
```
*pull-issues
# Pulls all recent updates from Jira to local docs
```

### Bulk Operations
```
*bulk-sync
# Syncs all local documentation to Jira
*validate
# Validates sync integrity across all items
```

## Support

- **Documentation**: 800+ lines of comprehensive documentation
- **Templates**: Standardized templates for all issue types
- **Checklists**: Validation and sync operation checklists
- **Utilities**: Helper functions for common operations

## Contributing

This agent follows BMad Method conventions:
- YAML-based configuration
- Template-driven operations
- Checklist validation
- Audit trail maintenance

For questions or support, refer to the BMad Method documentation or the agent's built-in help system (`*help`).

---

**Ready to sync?** Start with `*setup` to configure your Jira project connection!