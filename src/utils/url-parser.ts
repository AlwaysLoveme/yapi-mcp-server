/**
 * YAPI URL 解析器
 *
 * 从 YAPI 页面 URL 中提取项目 ID、接口 ID 或分类 ID。
 */

/** 解析后的 URL 信息 */
export interface ParsedYapiUrl {
  baseUrl: string;
  projectId: number;
  interfaceId?: number;
  catId?: number;
}

/**
 * 解析 YAPI 页面 URL。
 *
 * 支持的 URL 格式：
 *   - /project/{projectId}/interface/api          → 项目概览
 *   - /project/{projectId}/interface/api/{id}     → 接口详情
 *   - /project/{projectId}/interface/api/cat_{id} → 分类列表
 *
 * @param url - 完整的 YAPI 页面 URL
 * @returns 解析后的 URL 信息
 * @throws 如果 URL 格式无效
 */
export function parseYapiUrl(url: string): ParsedYapiUrl {
  const parsed = new URL(url);
  const baseUrl = `${parsed.protocol}//${parsed.host}`;

  // 提取项目 ID（必须）
  const projectMatch = parsed.pathname.match(/\/project\/(\d+)/);
  if (!projectMatch) {
    throw new Error(
      `Invalid YAPI URL: cannot extract project ID from "${url}"`,
    );
  }
  const projectId = Number(projectMatch[1]);

  const result: ParsedYapiUrl = { baseUrl, projectId };

  // 尝试提取分类 ID
  const catMatch = parsed.pathname.match(/\/interface\/api\/cat_(\d+)/);
  if (catMatch) {
    result.catId = Number(catMatch[1]);
    return result;
  }

  // 尝试提取接口 ID
  const interfaceMatch = parsed.pathname.match(/\/interface\/api\/(\d+)/);
  if (interfaceMatch) {
    result.interfaceId = Number(interfaceMatch[1]);
  }

  return result;
}
