import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';
import _JestMongoDbEnvironment from '@shelf/jest-mongodb/lib/environment';
import { TestEnvironment as NodeEnvironment } from 'jest-environment-node';
import { debug as _debug } from 'debug';
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';

const debug = _debug('jest-mongodb:environment:custom');

const JestMongoDbEnvironment =
  _JestMongoDbEnvironment as typeof NodeEnvironment;

export default class TestEnvironment extends JestMongoDbEnvironment {
  globalConfigPath!: string;
  mongo: any;
  globalMongoClient: MongoClient | undefined;
  testFilePath: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    debug('standalone TestEnvironment.constructor');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    debug('local mongo instance class', this.mongo?.constructor?.name);

    this.testFilePath = context.testPath;

    debug('this.testFilePath', this.testFilePath);
  }

  override async setup() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const globalConfig = JSON.parse(
      readFileSync(this.globalConfigPath, 'utf-8'),
    );

    debug('standalone TestEnvironment.setup - before super');
    try {
      const connection = await MongoClient.connect(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        globalConfig.mongoUri as string,
      );
      // const db = connection.db();
      await connection.close();
      debug('global mongo instance state', 'running');
    } catch (e) {
      const error = e as Error;
      debug('global mongo instance state', 'not running', error.message);
    }

    await super.setup();

    debug('standalone TestEnvironment.setup - after super');
    debug('this.global.__MONGO_URI__', this.global['__MONGO_URI__']);
    debug(
      /* `undefined` here, but defined when inspected inside the test */
      'globalThis.__MONGO_URI__',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (globalThis as any).__MONGO_URI__,
    );
    debug('this.global.__MONGO_DB_NAME__', this.global['__MONGO_DB_NAME__']);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    debug('local mongo instance state', this.mongo?.state);

    /**
     * Requirements for the DB name:
     * - Can contain only ASCII characters
     * - Cannot contain any of the following characters: /\. "$*<>:|?
     * - Cannot contain a null character
     * - Must be at least 1 character long and no more than 64 bytes long
     *
     * MD5 hash in a hexadecimal format is 32 characters long and contains only
     * ASCII letters and numbers, so it should be a valid DB name.
     *
     * Sources
     * - https://www.mongodb.com/docs/manual/reference/limits/#naming-restrictions
     */
    const dbName = createHash('md5').update(this.testFilePath).digest('hex');

    const mongoUri = this.global['__MONGO_URI__'] as string;
    const mongoUriWithDbName = mongoUri + dbName;
    /**
     * When MONGODB_URL is set via process.env here, tests do not see this
     * change because they are run inside the `this.global` vm context that is
     * isolated from the global Node.js context. Only environment variables
     * present in the global Node.js context (process.env) at the time of
     * isolated context creation are available to the tests.
     *
     * But setting it via this.global.process.env works.
     */
    this.global.process.env['MONGODB_URL'] = mongoUriWithDbName;

    debug('process.env[MONGODB_URL]', process.env['MONGODB_URL']);
    debug(
      'this.global.process.env[MONGODB_URL]',
      this.global.process.env['MONGODB_URL'],
    );
  }

  override async teardown() {
    debug('standalone TestEnvironment.teardown - before super');

    await super.teardown();

    debug('standalone TestEnvironment.teardown - after super');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    debug('local mongo instance state', this.mongo?.state);

    try {
      const connection = await MongoClient.connect(
        this.global['__MONGO_URI__'] as string,
      );
      // const db = connection.db();
      await connection.close();
      debug('global mongo instance state', 'running');
    } catch (e) {
      const error = e as Error;
      debug('global mongo instance state', 'not running', error.message);
    }
  }

  override getVmContext() {
    /* A lot of calls... */
    // debug('standalone TestEnvironment.getVmContext');
    return super.getVmContext();
  }
}
