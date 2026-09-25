import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  TOOL_DESCRIPTIONS,
  getExperience,
  getProject,
  getProjectInput,
  listProjects,
  listProjectsInput,
} from './tools.js';

export const SERVER_INFO = { name: 'laikahkeen', version: '0.1.0' } as const;

/** JSON payloads go back as text content — the shape every MCP client renders. */
function json(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] };
}

export function buildServer(): McpServer {
  const server = new McpServer(SERVER_INFO, {
    instructions:
      "This server exposes Lai Kah Keen's engineering work — projects, what each one solved, and employment history. " +
      'Everything it returns is public and read-only. Call list_projects first to get slugs, then get_project for depth.',
  });

  // readOnlyHint/openWorldHint are honest signals, not decoration: a client that
  // gates side-effecting tools behind confirmation should not prompt for these.
  const readOnly = { readOnlyHint: true, idempotentHint: true, openWorldHint: false };

  server.registerTool(
    'list_projects',
    { title: 'List projects', description: TOOL_DESCRIPTIONS.list_projects, inputSchema: listProjectsInput, annotations: readOnly },
    async ({ status }) => json(listProjects(status)),
  );

  server.registerTool(
    'get_project',
    { title: 'Get project', description: TOOL_DESCRIPTIONS.get_project, inputSchema: getProjectInput, annotations: readOnly },
    async ({ slug }) => {
      const project = getProject(slug);
      if (!project) {
        // isError, not a thrown exception: the model should see the available
        // slugs and retry, not receive a transport failure.
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: `No project with slug "${slug}". Available: ${listProjects()
                .map((p) => p.slug)
                .join(', ')}`,
            },
          ],
        };
      }
      return json(project);
    },
  );

  server.registerTool(
    'get_experience',
    { title: 'Get experience', description: TOOL_DESCRIPTIONS.get_experience, annotations: readOnly },
    async () => json(getExperience()),
  );

  return server;
}
