import type { Config } from '@jest/types';
import jestMongoDbTeardown from '@shelf/jest-mongodb/lib/teardown';
import { existsSync } from 'fs';
import { join } from 'path';
import { debug as _debug } from 'debug';

const debug = _debug('jest-mongodb:teardown:custom');

export default async (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
  await (jestMongoDbTeardown as any)(globalConfig, projectConfig);

  const globalConfigPath = join(globalConfig.rootDir, 'globalConfig.json');

  debug('standalone teardown.ts');
  debug(
    'globalThis.__MONGOD__ instance class',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (globalThis as any).__MONGOD__?.constructor?.name,
  );
  debug(
    'globalThis.__MONGOD__.state',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (globalThis as any).__MONGOD__?.state,
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  debug('globalConfig exists', existsSync(globalConfigPath));
};
