import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { YapiClient } from '../client/yapi-client.js';
import { formatInterfaceDetail } from '../utils/formatter.js';
import { successResponse, errorResponse } from '../utils/tool-helper.js';

export function registerGetInterface(
  server: McpServer,
  client: YapiClient,
): void {
  server.registerTool(
    'yapi_get_interface',
    {
      title: 'Get YAPI Interface Detail',
      description:
        'Get complete details of a single API interface including request parameters (headers, query, body), response body schema, description, and status.',
      inputSchema: {
        interface_id: z.number().describe('The interface ID to retrieve details for'),
      },
    },
    async ({ interface_id }) => {
      try {
        const data = await client.getInterface(interface_id);
        return successResponse(formatInterfaceDetail(data));
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
}
