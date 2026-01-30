#!/usr/bin/env node
/**
 * YAPI MCP Server 入口文件
 *
 * 使用 stdio 传输方式与 MCP 客户端通信。
 * 需要设置环境变量：YAPI_BASE_URL 和 YAPI_TOKEN
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { createServer } from './server.js';

async function main(): Promise<void> {
  const config = loadConfig();

  console.error('YAPI MCP Server starting...');
  console.error(`  YAPI URL: ${config.YAPI_BASE_URL}`);

  const server = createServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('YAPI MCP Server connected via stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
