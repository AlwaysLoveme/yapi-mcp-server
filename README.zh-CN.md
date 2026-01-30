# YAPI MCP Server

一个 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 服务器，用于读取 YAPI 接口文档数据。让 LLM 客户端（Claude Code、Cursor 等）能够浏览和查看 YAPI 项目的接口信息。

## 功能

- 查看项目信息、分类目录和接口列表
- 获取完整的接口详情，包括请求参数和响应 Schema
- 支持分页浏览，输出 Markdown 格式便于 LLM 理解
- 通过环境变量配置认证信息，安全可靠

## 环境要求

- Node.js >= 18.0.0

## 安装

### 从 npm 安装

```bash
npx @zhuxian/yapi-mcp-server
```

### 从源码安装

```bash
git clone <repo-url>
cd yapi-mcp
npm install
npm run build
```

## 配置

服务器需要三个环境变量：

| 变量 | 说明 | 示例 |
|------|------|------|
| `YAPI_BASE_URL` | YAPI 实例地址 | `https://yapi.example.com` |
| `YAPI_TOKEN` | Cookie 中的 Token | `eyJhbGciOiJIUzI1NiIs...` |
| `YAPI_UID` | 用户 ID | `1828` |

> **如何获取 Token 和 UID**：打开浏览器开发者工具 -> Application -> Cookies，找到 `_yapi_token` 和 `_yapi_uid` 的值。

## 使用方式

### Claude Code

**方式一：使用命令添加**

```bash
# 添加到当前项目
claude mcp add yapi -e YAPI_BASE_URL=https://yapi.example.com -e YAPI_TOKEN=your_token -e YAPI_UID=1828 -- npx -y @zhuxian/yapi-mcp-server

# 添加到全局（所有项目可用）
claude mcp add yapi -s user -e YAPI_BASE_URL=https://yapi.example.com -e YAPI_TOKEN=your_token -e YAPI_UID=1828 -- npx -y @zhuxian/yapi-mcp-server
```

**方式二：手动配置**

在 `~/.claude/settings.json` 中添加：

```json
{
  "mcpServers": {
    "yapi": {
      "command": "npx",
      "args": ["-y", "@zhuxian/yapi-mcp-server"],
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "your_token",
        "YAPI_UID": "1828"
      }
    }
  }
}
```

### Cursor

在项目根目录下的 `.cursor/mcp.json` 中添加：

```json
{
  "mcpServers": {
    "yapi": {
      "command": "npx",
      "args": ["-y", "@zhuxian/yapi-mcp-server"],
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "your_token",
        "YAPI_UID": "1828"
      }
    }
  }
}
```

### 本地开发

```bash
YAPI_BASE_URL=https://yapi.example.com YAPI_TOKEN=xxx YAPI_UID=1828 npm run dev
```

## 工具列表

### yapi_get_project

获取项目基本信息，包括名称、描述、基础路径和环境配置。

**参数：**

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `project_id` | number | 是 | YAPI 项目 ID |

---

### yapi_get_cat_menu

获取项目的接口分类列表（文件夹结构）。

**参数：**

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `project_id` | number | 是 | YAPI 项目 ID |

---

### yapi_list_interfaces

分页获取项目下的接口列表。

**参数：**

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `project_id` | number | 是 | YAPI 项目 ID |
| `page` | number | 否 | 页码（默认：1） |
| `limit` | number | 否 | 每页数量，最大 100（默认：20） |

---

### yapi_list_by_category

按分类分页获取接口列表。

**参数：**

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cat_id` | number | 是 | 分类 ID（通过 `yapi_get_cat_menu` 获取） |
| `page` | number | 否 | 页码（默认：1） |
| `limit` | number | 否 | 每页数量，最大 100（默认：20） |

---

### yapi_get_interface

获取单个接口的完整详情，包括请求参数（Headers、Query、Body）、响应 Body Schema、描述和状态。

**参数：**

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `interface_id` | number | 是 | 接口 ID |

---

### yapi_get_full_menu

获取项目下按分类分组的全部接口，返回完整的分类-接口层级结构。

> **注意**：接口数量较多的项目可能返回较大的数据量。

**参数：**

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `project_id` | number | 是 | YAPI 项目 ID |

---

### yapi_get_by_url

解析 YAPI 页面 URL 并自动获取对应数据。

**参数：**

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | string | 是 | 完整的 YAPI 页面 URL |

**支持的 URL 格式：**

- `/project/{id}/interface/api` - 项目概览
- `/project/{id}/interface/api/{interfaceId}` - 接口详情
- `/project/{id}/interface/api/cat_{catId}` - 分类列表

## 推荐使用流程

探索一个 YAPI 项目时的推荐调用顺序：

```
1. yapi_get_project        → 了解项目概况
2. yapi_get_cat_menu       → 查看分类结构
3. yapi_list_by_category   → 浏览某个分类下的接口
4. yapi_get_interface      → 获取具体接口的完整详情
```

或者直接使用 `yapi_get_by_url`，传入 YAPI 页面 URL 即可。

## 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run build` | 使用 SWC 编译 + 生成类型声明 |
| `npm run watch` | 监听模式编译 |
| `npm run start` | 运行编译后的服务器 |
| `npm run dev` | 使用 `tsx` 直接运行（无需编译） |
| `npm run typecheck` | 仅类型检查，不输出文件 |

## License

MIT
