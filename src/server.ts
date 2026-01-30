/**
 * MCP Server 创建模块
 *
 * 负责创建 MCP Server 实例并注册所有工具。
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { YapiClient } from './client/yapi-client.js';
import type { Config } from './config.js';
import { SERVER_NAME, SERVER_VERSION } from './version.js';
import { registerGetProject } from './tools/get-project.js';
import { registerGetCatMenu } from './tools/get-cat-menu.js';
import { registerListInterfaces } from './tools/list-interfaces.js';
import { registerListByCategory } from './tools/list-by-category.js';
import { registerGetInterface } from './tools/get-interface.js';
import { registerGetFullMenu } from './tools/get-full-menu.js';
import { registerGetByUrl } from './tools/get-by-url.js';

/**
 * 创建并配置 MCP Server。
 * @param config - YAPI 配置信息
 * @returns 配置完成的 MCP Server 实例
 */
export function createServer(config: Config): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  const client = new YapiClient(config);

  // 注册所有 YAPI 工具
  registerGetProject(server, client);
  registerGetCatMenu(server, client);
  registerListInterfaces(server, client);
  registerListByCategory(server, client);
  registerGetInterface(server, client);
  registerGetFullMenu(server, client);
  registerGetByUrl(server, client);

  return server;
}
