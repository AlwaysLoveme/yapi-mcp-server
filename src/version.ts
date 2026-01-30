/**
 * 版本信息模块
 *
 * 从 package.json 动态读取版本号，避免硬编码。
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

interface PackageJson {
  name: string;
  version: string;
}

function loadPackageJson(): PackageJson {
  try {
    const require = createRequire(import.meta.url);
    const __dirname = dirname(fileURLToPath(import.meta.url));
    return require(join(__dirname, '..', 'package.json')) as PackageJson;
  } catch {
    // 回退默认值
    return { name: 'yapi-mcp-server', version: '1.0.0' };
  }
}

const pkg = loadPackageJson();

export const SERVER_NAME = pkg.name;
export const SERVER_VERSION = pkg.version;
