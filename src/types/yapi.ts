/**
 * YAPI API 类型定义
 *
 * 定义与 YAPI 服务器交互时使用的数据结构。
 */

// ============ 枚举类型 ============

/** HTTP 请求方法 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

/** 接口状态：已完成 / 未完成 / 测试中 */
export type InterfaceStatus = 'done' | 'undone' | 'testing';

/** 请求体类型 */
export type ReqBodyType = 'form' | 'json' | 'file' | 'raw';

/** 响应体类型 */
export type ResBodyType = 'json' | 'raw';

// ============ 通用响应结构 ============

/** YAPI 统一响应格式 */
export interface YapiResponse<T> {
  errcode: number;
  errmsg: string;
  data: T;
}

/** 分页列表响应 */
export interface YapiPaginatedList<T> {
  count: number;
  total: number;
  list: T[];
}

// ============ 项目相关 ============

/** 项目环境配置 */
export interface YapiProjectEnv {
  _id: string;
  name: string;
  domain: string;
  header: { _id: string; name: string; value: string }[];
  global: { _id: string; name: string; value: string }[];
}

/** 项目信息 */
export interface YapiProject {
  _id: number;
  name: string;
  desc: string;
  basepath: string;
  project_type: string;
  uid: number;
  group_id: number;
  icon: string;
  color: string;
  add_time: number;
  up_time: number;
  env: YapiProjectEnv[];
  tag: string[];
  cat: number[];
}

// ============ 分类相关 ============

/** 接口分类 */
export interface YapiCategory {
  _id: number;
  name: string;
  desc: string;
  project_id: number;
  uid: number;
  add_time: number;
  up_time: number;
  index: number;
}

/** 带接口列表的分类（用于完整菜单） */
export interface YapiMenuCategory extends YapiCategory {
  list: YapiInterfaceListItem[];
}

// ============ 接口相关 ============

/** 接口列表项（简要信息） */
export interface YapiInterfaceListItem {
  _id: number;
  project_id: number;
  catid: number;
  title: string;
  path: string;
  method: HttpMethod;
  uid: number;
  add_time: number;
  up_time: number;
  status: InterfaceStatus;
  edit_uid: number;
}

/** 接口详情（完整信息） */
export interface YapiInterfaceDetail extends YapiInterfaceListItem {
  desc: string;
  markdown: string;
  req_body_type: ReqBodyType;
  req_body_form: YapiReqBodyFormItem[];
  req_body_other: string;
  req_body_is_json_schema: boolean;
  req_params: YapiReqParam[];
  req_headers: YapiReqHeader[];
  req_query: YapiReqQuery[];
  res_body_type: ResBodyType;
  res_body: string;
  res_body_is_json_schema: boolean;
  tag: string[];
  type: string;
  api_opened: boolean;
}

// ============ 请求参数类型 ============

/** 表单请求体字段 */
export interface YapiReqBodyFormItem {
  _id: string;
  name: string;
  type: string;
  required: '0' | '1';
  example: string;
  desc: string;
}

/** 路径参数 */
export interface YapiReqParam {
  _id: string;
  name: string;
  example: string;
  desc: string;
}

/** 请求头 */
export interface YapiReqHeader {
  _id: string;
  name: string;
  value: string;
  example: string;
  desc: string;
  required: '0' | '1';
}

/** 查询参数 */
export interface YapiReqQuery {
  _id: string;
  name: string;
  example: string;
  desc: string;
  required: '0' | '1';
}
