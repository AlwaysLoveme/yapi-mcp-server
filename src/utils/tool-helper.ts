/**
 * MCP 工具辅助函数
 *
 * 提供统一的响应格式化和错误处理。
 */

/** 格式化未知类型的错误为字符串 */
export function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** 创建成功响应 */
export function successResponse(text: string) {
  return { content: [{ type: 'text' as const, text }] };
}

/** 创建错误响应 */
export function errorResponse(error: unknown) {
  return {
    content: [{ type: 'text' as const, text: `Error: ${formatError(error)}` }],
    isError: true,
  };
}
