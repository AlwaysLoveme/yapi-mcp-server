/**
 * YAPI API 客户端
 *
 * 封装与 YAPI 服务器的 HTTP 通信，提供类型安全的 API 调用方法。
 * 使用 Cookie 认证方式（_yapi_token + _yapi_uid）。
 */
import type { Config } from '../config.js';
import type {
  YapiResponse,
  YapiProject,
  YapiCategory,
  YapiInterfaceDetail,
  YapiInterfaceListItem,
  YapiPaginatedList,
  YapiMenuCategory,
} from '../types/yapi.js';

export class YapiClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly uid: number;

  constructor(config: Config) {
    this.baseUrl = config.YAPI_BASE_URL;
    this.token = config.YAPI_TOKEN;
    this.uid = config.YAPI_UID;
  }

  /**
   * 发送 HTTP 请求到 YAPI 服务器。
   * 自动处理认证、错误响应和 JSON 解析。
   */
  private async request<T>(
    path: string,
    params: Record<string, string | number> = {},
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        headers: {
          Cookie: `_yapi_token=${this.token}; _yapi_uid=${this.uid}`,
        },
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`Network error: ${msg}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let json: YapiResponse<T>;
    try {
      json = (await response.json()) as YapiResponse<T>;
    } catch {
      throw new Error('Failed to parse response as JSON');
    }

    // YAPI 业务错误码检查
    if (json.errcode !== 0) {
      throw new Error(`YAPI Error ${json.errcode}: ${json.errmsg}`);
    }

    return json.data;
  }

  /** 获取项目基本信息 */
  async getProject(projectId: number): Promise<YapiProject> {
    return this.request<YapiProject>('/api/project/get', { id: projectId });
  }

  /** 获取项目的接口分类列表 */
  async getCatMenu(projectId: number): Promise<YapiCategory[]> {
    return this.request<YapiCategory[]>('/api/interface/getCatMenu', {
      project_id: projectId,
    });
  }

  /** 分页获取项目下的接口列表 */
  async listInterfaces(
    projectId: number,
    page: number,
    limit: number,
  ): Promise<YapiPaginatedList<YapiInterfaceListItem>> {
    return this.request<YapiPaginatedList<YapiInterfaceListItem>>(
      '/api/interface/list',
      { project_id: projectId, page, limit },
    );
  }

  /** 分页获取指定分类下的接口列表 */
  async listByCategory(
    catId: number,
    page: number,
    limit: number,
  ): Promise<YapiPaginatedList<YapiInterfaceListItem>> {
    return this.request<YapiPaginatedList<YapiInterfaceListItem>>(
      '/api/interface/list_cat',
      { catid: catId, page, limit },
    );
  }

  /** 获取接口详情（包含请求参数、响应体等完整信息） */
  async getInterface(interfaceId: number): Promise<YapiInterfaceDetail> {
    return this.request<YapiInterfaceDetail>('/api/interface/get', {
      id: interfaceId,
    });
  }

  /** 获取项目完整菜单（分类+接口列表的树形结构） */
  async getFullMenu(projectId: number): Promise<YapiMenuCategory[]> {
    return this.request<YapiMenuCategory[]>('/api/interface/list_menu', {
      project_id: projectId,
    });
  }
}
