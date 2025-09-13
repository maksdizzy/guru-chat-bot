# Connect to Jira Task

## Purpose
Establish and validate connection to configured Jira project using MCP Atlassian tools.

## Prerequisites
- MCP Atlassian server configured
- Valid authentication credentials
- Network connectivity
- Jira project configured via *setup command

## Process
1. **Load Configuration**
   - Read `.guru-core/config/jira-config.yaml`
   - Extract cloudId, projectKey, and other settings
   - Validate configuration completeness

2. **Test Authentication**
   - Use mcp__atlassian__getAccessibleAtlassianResources
   - Verify cloud ID matches configuration
   - Confirm required scopes available

3. **Validate Project Access**
   - Search for configured project using getVisibleJiraProjects
   - Verify project key and permissions
   - Check issue type availability

4. **Load Project Metadata**
   - Get issue types and their IDs
   - Retrieve workflow statuses
   - Load field configurations
   - Update local mappings if needed

5. **Connection Verification**
   - Test issue creation permissions
   - Verify search capabilities
   - Check comment permissions
   - Validate transition permissions

6. **Store Connection State**
   - Save validated configuration
   - Update connection timestamp
   - Log connection success

## Configuration Validation
- Cloud ID: [from configuration]
- Project Key: [from configuration]
- Instance URL: [from configuration]
- Required Scopes: read:jira-work, write:jira-work

## Success Criteria
- Authentication successful
- Configured project accessible
- All required permissions available
- Issue types and workflows loaded
- Connection state saved