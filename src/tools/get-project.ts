import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { YapiClient } from '../client/yapi-client.js';
import { formatProject } from '../utils/formatter.js';
import { successResponse, errorResponse } from '../utils/tool-helper.js';

export function registerGetProject(
  server: McpServer,
  client: YapiClient,
): void {
  server.registerTool(
    'yapi_get_project',
    {
      title: 'Get YAPI Project Info',
      description:
        'Get project basic information including name, description, base URL, and environment configurations.',
      inputSchema: {
        project_id: z.number().describe('The YAPI project ID'),
      },
    },
    async ({ project_id }) => {
      try {
        const data = await client.getProject(project_id);
        return successResponse(formatProject(data));
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
}
