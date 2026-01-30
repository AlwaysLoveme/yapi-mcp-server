import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { YapiClient } from '../client/yapi-client.js';
import { formatCategories } from '../utils/formatter.js';
import { successResponse, errorResponse } from '../utils/tool-helper.js';

export function registerGetCatMenu(
  server: McpServer,
  client: YapiClient,
): void {
  server.registerTool(
    'yapi_get_cat_menu',
    {
      title: 'Get YAPI Category Menu',
      description:
        'Get the list of interface categories (folders) for a project. Returns category IDs, names, and descriptions.',
      inputSchema: {
        project_id: z.number().describe('The YAPI project ID'),
      },
    },
    async ({ project_id }) => {
      try {
        const data = await client.getCatMenu(project_id);
        return successResponse(formatCategories(data));
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
}
