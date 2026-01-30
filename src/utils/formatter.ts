/**
 * 格式化工具模块
 *
 * 将 YAPI 数据格式化为 Markdown 格式，便于 LLM 阅读。
 */
import type {
  YapiProject,
  YapiCategory,
  YapiInterfaceListItem,
  YapiInterfaceDetail,
  YapiPaginatedList,
  YapiMenuCategory,
} from '../types/yapi.js';

/**
 * 转义 Markdown 表格单元格中的特殊字符。
 * 防止 | 和换行符破坏表格布局。
 */
function escapeTableCell(text: string | undefined | null): string {
  if (!text) return '-';
  return text
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '');
}

/** 尝试格式化 JSON 字符串，失败则返回原字符串 */
function tryFormatJson(raw: string): string {
  if (!raw) return '';
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

/** 将 '0'/'1' 转换为 Yes/No 标签 */
function requiredLabel(val: '0' | '1' | string): string {
  return val === '1' ? 'Yes' : 'No';
}

/** 格式化项目信息 */
export function formatProject(data: YapiProject): string {
  const lines: string[] = [
    `# Project: ${escapeTableCell(data.name)}`,
    '',
    `- **ID**: ${data._id}`,
    `- **Base Path**: ${data.basepath || '/'}`,
    `- **Description**: ${data.desc || 'N/A'}`,
    `- **Tags**: ${data.tag.length ? data.tag.join(', ') : 'N/A'}`,
  ];

  if (data.env.length) {
    lines.push('', '## Environments');
    for (const env of data.env) {
      lines.push(`- **${escapeTableCell(env.name)}**: ${env.domain}`);
    }
  }

  return lines.join('\n');
}

/** 格式化分类列表 */
export function formatCategories(data: YapiCategory[]): string {
  if (!data.length) return 'No categories found.';

  const lines: string[] = ['# Interface Categories', ''];
  lines.push('| ID | Name | Description |');
  lines.push('|----|------|-------------|');
  for (const cat of data) {
    lines.push(
      `| ${cat._id} | ${escapeTableCell(cat.name)} | ${escapeTableCell(cat.desc)} |`,
    );
  }
  return lines.join('\n');
}

/** 格式化接口列表（带分页信息） */
export function formatInterfaceList(
  data: YapiPaginatedList<YapiInterfaceListItem>,
  page: number,
  limit: number,
): string {
  const totalPages = Math.ceil(data.total / limit);
  const lines: string[] = [
    `# Interfaces (Page ${page}/${totalPages}, Total: ${data.total})`,
    '',
    '| ID | Method | Path | Title | Status |',
    '|----|--------|------|-------|--------|',
  ];

  for (const item of data.list) {
    lines.push(
      `| ${item._id} | ${item.method} | ${escapeTableCell(item.path)} | ${escapeTableCell(item.title)} | ${item.status} |`,
    );
  }

  if (page < totalPages) {
    lines.push('', `Use page=${page + 1} to see the next page.`);
  }

  return lines.join('\n');
}

/** 格式化接口详情（包含请求参数、响应体等） */
export function formatInterfaceDetail(data: YapiInterfaceDetail): string {
  const lines: string[] = [
    `## ${data.method} ${data.path}`,
    '',
    `- **Title**: ${escapeTableCell(data.title)}`,
    `- **Status**: ${data.status}`,
    `- **Interface ID**: ${data._id}`,
    `- **Category ID**: ${data.catid}`,
  ];

  if (data.desc) {
    lines.push(`- **Description**: ${escapeTableCell(data.desc)}`);
  }
  if (data.tag.length) {
    lines.push(`- **Tags**: ${data.tag.join(', ')}`);
  }

  // 路径参数
  if (data.req_params.length) {
    lines.push('', '### Path Parameters');
    lines.push('| Name | Example | Description |');
    lines.push('|------|---------|-------------|');
    for (const p of data.req_params) {
      lines.push(
        `| ${escapeTableCell(p.name)} | ${escapeTableCell(p.example)} | ${escapeTableCell(p.desc)} |`,
      );
    }
  }

  // 请求头
  if (data.req_headers.length) {
    lines.push('', '### Request Headers');
    lines.push('| Name | Required | Value | Description |');
    lines.push('|------|----------|-------|-------------|');
    for (const h of data.req_headers) {
      lines.push(
        `| ${escapeTableCell(h.name)} | ${requiredLabel(h.required)} | ${escapeTableCell(h.value)} | ${escapeTableCell(h.desc)} |`,
      );
    }
  }

  // 查询参数
  if (data.req_query.length) {
    lines.push('', '### Query Parameters');
    lines.push('| Name | Required | Example | Description |');
    lines.push('|------|----------|---------|-------------|');
    for (const q of data.req_query) {
      lines.push(
        `| ${escapeTableCell(q.name)} | ${requiredLabel(q.required)} | ${escapeTableCell(q.example)} | ${escapeTableCell(q.desc)} |`,
      );
    }
  }

  // 请求体
  if (data.req_body_type) {
    lines.push('', `### Request Body (${data.req_body_type})`);
    if (data.req_body_type === 'form' && data.req_body_form.length) {
      lines.push('| Name | Type | Required | Example | Description |');
      lines.push('|------|------|----------|---------|-------------|');
      for (const f of data.req_body_form) {
        lines.push(
          `| ${escapeTableCell(f.name)} | ${f.type} | ${requiredLabel(f.required)} | ${escapeTableCell(f.example)} | ${escapeTableCell(f.desc)} |`,
        );
      }
    } else if (data.req_body_other) {
      lines.push('```json', tryFormatJson(data.req_body_other), '```');
    }
  }

  // 响应体
  if (data.res_body) {
    lines.push(
      '',
      `### Response Body (${data.res_body_type || 'json'})`,
      '```json',
      tryFormatJson(data.res_body),
      '```',
    );
  }

  // 接口文档
  if (data.markdown) {
    lines.push('', '### Documentation', data.markdown);
  }

  return lines.join('\n');
}

/** 格式化完整菜单（分类+接口的树形结构） */
export function formatFullMenu(data: YapiMenuCategory[]): string {
  if (!data.length) return 'No categories found.';

  const lines: string[] = ['# Full Interface Menu', ''];

  for (const cat of data) {
    lines.push(`## ${escapeTableCell(cat.name)} (${cat.list.length} interfaces)`);
    if (cat.desc) lines.push(`> ${escapeTableCell(cat.desc)}`);
    lines.push('');

    if (cat.list.length) {
      lines.push('| ID | Method | Path | Title | Status |');
      lines.push('|----|--------|------|-------|--------|');
      for (const item of cat.list) {
        lines.push(
          `| ${item._id} | ${item.method} | ${escapeTableCell(item.path)} | ${escapeTableCell(item.title)} | ${item.status} |`,
        );
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}
