/**
 * 配置管理模块
 *
 * 从环境变量加载配置并进行校验。
 */
import { z } from 'zod';

/** 配置 Schema，使用 Zod 进行校验 */
const ConfigSchema = z.object({
  YAPI_BASE_URL: z.string().url('YAPI_BASE_URL must be a valid URL'),
  YAPI_TOKEN: z.string().min(1, 'YAPI_TOKEN is required'),
  YAPI_UID: z.coerce.number().int().positive('YAPI_UID must be a positive integer'),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * 从环境变量加载并校验配置。
 * 校验失败时会打印错误信息并退出进程。
 */
export function loadConfig(): Config {
  const result = ConfigSchema.safeParse({
    YAPI_BASE_URL: process.env.YAPI_BASE_URL,
    YAPI_TOKEN: process.env.YAPI_TOKEN,
    YAPI_UID: process.env.YAPI_UID,
  });

  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    console.error(`YAPI MCP Server configuration error:\n${missing}`);
    process.exit(1);
  }

  // 移除 URL 末尾的斜杠
  const config = result.data;
  config.YAPI_BASE_URL = config.YAPI_BASE_URL.replace(/\/+$/, '');
  return config;
}
