import type { Config } from '@jest/types';
import jestMongoDbSetup from '@shelf/jest-mongodb/lib/setup';
import { getMongoURLEnvName } from '@shelf/jest-mongodb/lib/helpers';
import { readFileSync } from 'fs';
import { join } from 'path';
import { debug as _debug } from 'debug';

const debug = _debug('jest-mongodb:setup:custom');

export default async (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
  await (jestMongoDbSetup as any)(globalConfig, projectConfig);

  const globalConfigPath = join(globalConfig.rootDir, 'globalConfig.json');
  const globalConfigJson = readFileSync(globalConfigPath, 'utf-8');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mongoURLEnvName = getMongoURLEnvName(globalConfig.rootDir) as string;
  // https://github.com/shelfio/jest-mongodb/blob/006bfbb853685cddc0cf96846fafb55f4ac2a3ff/src/helpers.ts#L3
  const jestMongodbConfigFileName =
    process.env['MONGO_MEMORY_SERVER_FILE'] ?? 'jest-mongodb-config.js';

  debug('standalone setup.ts');
  debug('jestMongodbConfigFileName', jestMongodbConfigFileName);
  debug('mongoURLEnvName', mongoURLEnvName);
  debug('process.env[mongoURLEnvName]', process.env[mongoURLEnvName]);
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
  debug('globalConfig', JSON.stringify(JSON.parse(globalConfigJson), null, 2));
};
