import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { YapiClient } from '../client/yapi-client.js';
import { formatInterfaceList } from '../utils/formatter.js';
import { successResponse, errorResponse } from '../utils/tool-helper.js';

export function registerListInterfaces(
  server: McpServer,
  client: YapiClient,
): void {
  server.registerTool(
    'yapi_list_interfaces',
    {
      title: 'List YAPI Interfaces',
      description:
        'List interfaces in a project with pagination. Returns basic info (ID, title, path, method, status) for each interface.',
      inputSchema: {
        project_id: z.number().describe('The YAPI project ID'),
        page: z.number().optional().default(1).describe('Page number (default: 1)'),
        limit: z.number().optional().default(20).describe('Items per page, max 100 (default: 20)'),
      },
    },
    async ({ project_id, page, limit }) => {
      try {
        const data = await client.listInterfaces(project_id, page, limit);
        return successResponse(formatInterfaceList(data, page, limit));
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
}
