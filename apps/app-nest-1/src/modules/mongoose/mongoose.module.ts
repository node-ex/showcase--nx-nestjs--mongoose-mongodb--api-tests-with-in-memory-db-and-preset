import { Module } from '@nestjs/common';
import { MongooseModule as _MongooseModule } from '@nestjs/mongoose';
import { debug as _debug } from 'debug';
import { readFile } from 'fs/promises';
import { join } from 'path';

/** Not an appropriate namespace name, but makes it simpler to filter debug statements */
const debug = _debug('jest-mongodb:mongoose-module');

export const _mongooseModuleForRoot = _MongooseModule.forRootAsync({
  useFactory: async () => {
    /**
     * For testing purposes only.
     *
     * Its not possible to access `process.env` changes from the
     * `testEnvironment.ts` file, only from the `globalSetup.ts` file.
     *
     * File access is required if using a unique database per test file.
     * If not, just set `process.env['MONGODB_URL']` in the `globalSetup.ts`
     * file and use it here.
     */
    const testMongoDbUrl = await getTestMongoDbUrl();

    debug('MongooseModule.forRootAsync.useFactory');
    debug('testMongoDbUrl', testMongoDbUrl);
    debug('process.env[MONGODB_URL]', process.env['MONGODB_URL']);

    return {
      uri: testMongoDbUrl ?? process.env['MONGODB_URL']!,
    };
  },
});

@Module({
  imports: [_mongooseModuleForRoot],
})
export class MongooseModule {}

async function getTestMongoDbUrl(): Promise<string | undefined> {
  const configPath = join(process.cwd(), 'globalConfig.json');
  const configJson = await readFile(configPath, 'utf-8');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const config = JSON.parse(configJson);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return config?.mongoUri as string | undefined;
}
