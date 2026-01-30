import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { YapiClient } from '../client/yapi-client.js';
import { formatInterfaceList } from '../utils/formatter.js';
import { successResponse, errorResponse } from '../utils/tool-helper.js';

export function registerListByCategory(
  server: McpServer,
  client: YapiClient,
): void {
  server.registerTool(
    'yapi_list_by_category',
    {
      title: 'List Interfaces by Category',
      description: 'List interfaces belonging to a specific category with pagination.',
      inputSchema: {
        cat_id: z.number().describe('The category ID (obtained from yapi_get_cat_menu)'),
        page: z.number().optional().default(1).describe('Page number (default: 1)'),
        limit: z.number().optional().default(20).describe('Items per page, max 100 (default: 20)'),
      },
    },
    async ({ cat_id, page, limit }) => {
      try {
        const data = await client.listByCategory(cat_id, page, limit);
        return successResponse(formatInterfaceList(data, page, limit));
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
}
