# Jira Sync Checklist

## Pre-Sync Validation
- [ ] Jira connection is active and authenticated
- [ ] Target project (TKB) is accessible
- [ ] Local document format is valid
- [ ] Required fields are populated
- [ ] No sync conflicts detected

## Epic Sync Checklist
- [ ] Epic title is clear and concise
- [ ] Epic description includes business value
- [ ] Success metrics are defined
- [ ] User stories are listed (if available)
- [ ] Timeline is realistic
- [ ] Priority level is appropriate
- [ ] Assignee is valid Jira user (if specified)

## Story Sync Checklist
- [ ] User story follows "As a... I want... So that..." format
- [ ] Acceptance criteria are specific and testable
- [ ] Story points are estimated (if available)
- [ ] Epic link is valid (if specified)
- [ ] Technical requirements are documented
- [ ] Dependencies are identified
- [ ] Definition of done is clear

## Task Sync Checklist
- [ ] Task description is actionable
- [ ] Acceptance criteria are measurable
- [ ] Technical requirements are specified
- [ ] Dependencies are identified
- [ ] Parent link is valid (if specified)

## Bug Sync Checklist
- [ ] Bug title describes the issue clearly
- [ ] Steps to reproduce are documented
- [ ] Expected vs actual behavior is defined
- [ ] Environment details are included
- [ ] Severity level is appropriate
- [ ] Impact assessment is completed

## Post-Sync Validation
- [ ] Jira issue was created/updated successfully
- [ ] All fields were mapped correctly
- [ ] Local document contains Jira key
- [ ] Sync metadata is updated
- [ ] Audit log entry is created
- [ ] Related issues are linked (if applicable)

## Conflict Resolution
- [ ] Identify conflicting fields
- [ ] Determine authoritative source
- [ ] Backup current state
- [ ] Apply resolution strategy
- [ ] Verify resolution accuracy
- [ ] Update sync metadata

## Rollback Checklist (if needed)
- [ ] Document sync failure reason
- [ ] Restore previous state
- [ ] Remove incomplete Jira issue (if created)
- [ ] Reset local document metadata
- [ ] Log rollback operation
- [ ] Notify stakeholders (if applicable)