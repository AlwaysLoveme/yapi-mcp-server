# YAPI MCP Server

[中文文档](./README.zh-CN.md)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for reading YAPI API documentation. Enables LLM clients (Claude Code, Cursor, etc.) to browse and inspect YAPI project interfaces.

## Features

- Browse project info, categories, and interfaces
- Get full API detail including request/response schemas
- Paginated listing with LLM-friendly Markdown output
- Token-based authentication via environment variables

## Requirements

- Node.js >= 18.0.0

## Installation

### From npm

```bash
npx @zhuxian/yapi-mcp-server
```

### From source

```bash
git clone <repo-url>
cd yapi-mcp
npm install
npm run build
```

## Configuration

The server requires three environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `YAPI_BASE_URL` | Your YAPI instance URL | `https://yapi.example.com` |
| `YAPI_TOKEN` | Cookie token for authentication | `eyJhbGciOiJIUzI1NiIs...` |
| `YAPI_UID` | Your YAPI user ID | `1828` |

> **How to get Token and UID**: Open browser DevTools -> Application -> Cookies, find `_yapi_token` and `_yapi_uid` values.

## Usage

### Claude Code

**Option 1: Using CLI command**

```bash
# Add to current project
claude mcp add yapi -e YAPI_BASE_URL=https://yapi.example.com -e YAPI_TOKEN=your_token -e YAPI_UID=1828 -- npx -y @zhuxian/yapi-mcp-server

# Add globally (available in all projects)
claude mcp add yapi -s user -e YAPI_BASE_URL=https://yapi.example.com -e YAPI_TOKEN=your_token -e YAPI_UID=1828 -- npx -y @zhuxian/yapi-mcp-server
```

**Option 2: Manual configuration**

Add to `~/.claude/settings.json`:

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

Add to `.cursor/mcp.json` in your project root:

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

### Local Development

```bash
YAPI_BASE_URL=https://yapi.example.com YAPI_TOKEN=xxx YAPI_UID=1828 npm run dev
```

## Tools

### yapi_get_project

Get project basic information including name, description, base path, and environment configurations.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The YAPI project ID |

---

### yapi_get_cat_menu

Get the list of interface categories (folders) for a project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The YAPI project ID |

---

### yapi_list_interfaces

List interfaces in a project with pagination.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The YAPI project ID |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page, max 100 (default: 20) |

---

### yapi_list_by_category

List interfaces belonging to a specific category with pagination.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `cat_id` | number | Yes | Category ID (from `yapi_get_cat_menu`) |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page, max 100 (default: 20) |

---

### yapi_get_interface

Get complete details of a single API interface including request parameters, headers, body schema, and response schema.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `interface_id` | number | Yes | The interface ID |

---

### yapi_get_full_menu

Get all interfaces grouped by category. Returns the complete hierarchy for the project.

> **Note**: May return large payloads for projects with many interfaces.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The YAPI project ID |

---

### yapi_get_by_url

Parse a YAPI page URL and fetch the corresponding data automatically.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `url` | string | Yes | Full YAPI page URL |

**Supported URL formats:**

- `/project/{id}/interface/api` - Project overview
- `/project/{id}/interface/api/{interfaceId}` - Interface detail
- `/project/{id}/interface/api/cat_{catId}` - Category listing

## Typical Workflow

A recommended sequence when exploring a YAPI project:

```
1. yapi_get_project        → Understand the project
2. yapi_get_cat_menu       → See category structure
3. yapi_list_by_category   → Browse interfaces in a category
4. yapi_get_interface      → Get full detail for a specific API
```

Or simply use `yapi_get_by_url` with a YAPI page URL.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile with SWC + generate type declarations |
| `npm run watch` | Watch mode compilation |
| `npm run start` | Run the compiled server |
| `npm run dev` | Run directly with `tsx` (no build needed) |
| `npm run typecheck` | Type check without emitting |

## License

MIT
