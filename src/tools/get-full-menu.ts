import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { YapiClient } from '../client/yapi-client.js';
import { formatFullMenu } from '../utils/formatter.js';
import { successResponse, errorResponse } from '../utils/tool-helper.js';

export function registerGetFullMenu(
  server: McpServer,
  client: YapiClient,
): void {
  server.registerTool(
    'yapi_get_full_menu',
    {
      title: 'Get Full Interface Menu',
      description:
        'Get all interfaces grouped by category for a project. Returns the complete category-to-interface hierarchy. Warning: may return large payloads for big projects.',
      inputSchema: {
        project_id: z.number().describe('The YAPI project ID'),
      },
    },
    async ({ project_id }) => {
      try {
        const data = await client.getFullMenu(project_id);
        return successResponse(formatFullMenu(data));
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
}
