import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { YapiClient } from '../client/yapi-client.js';
import { parseYapiUrl } from '../utils/url-parser.js';
import {
  formatProject,
  formatInterfaceDetail,
  formatInterfaceList,
} from '../utils/formatter.js';
import { successResponse, errorResponse } from '../utils/tool-helper.js';

export function registerGetByUrl(
  server: McpServer,
  client: YapiClient,
): void {
  server.registerTool(
    'yapi_get_by_url',
    {
      title: 'Get YAPI Data by URL',
      description:
        'Parse a YAPI page URL and fetch the corresponding data automatically. ' +
        'Supports project URLs (/project/{id}/interface/api), ' +
        'interface URLs (/project/{id}/interface/api/{interfaceId}), ' +
        'and category URLs (/project/{id}/interface/api/cat_{catId}).',
      inputSchema: {
        url: z
          .string()
          .describe(
            'Full YAPI page URL, e.g. http://yapi.example.com/project/1/interface/api/100',
          ),
      },
    },
    async ({ url }) => {
      try {
        const parsed = parseYapiUrl(url);
        const parts: string[] = [];

        // Always include project info
        const project = await client.getProject(parsed.projectId);
        parts.push(formatProject(project));

        if (parsed.interfaceId) {
          // Specific interface
          const detail = await client.getInterface(parsed.interfaceId);
          parts.push(formatInterfaceDetail(detail));
        } else if (parsed.catId) {
          // Category listing
          const list = await client.listByCategory(parsed.catId, 1, 50);
          parts.push(formatInterfaceList(list, 1, 50));
        } else {
          // Project overview — list first page
          const list = await client.listInterfaces(parsed.projectId, 1, 20);
          parts.push(formatInterfaceList(list, 1, 20));
        }

        return successResponse(parts.join('\n\n---\n\n'));
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
}
