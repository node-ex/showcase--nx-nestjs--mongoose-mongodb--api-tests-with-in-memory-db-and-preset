import { Test } from '@nestjs/testing';
import { MongooseModule } from '../../../src/modules/mongoose/mongoose.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { debug as _debug } from 'debug';

const debug = _debug('jest-mongodb:setupFilesAfterEnv:setupDatabaseConnection');

beforeAll(async () => {
  /**
   * Create a new NestJS application with the MongooseModule that uses
   * the connection string from the environment variable set in the
   * testEnvironment.ts file.
   */
  const app = await Test.createTestingModule({
    imports: [MongooseModule],
  }).compile();

  const connection = app.get<Connection>(getConnectionToken());
  globalThis.connection = connection;
});

afterEach(async () => {
  debug('dropping all collections');

  const collections = await globalThis.connection.db.collections();
  const collectionNames = collections.map(
    (collection) => collection.collectionName,
  );
  debug('collectionNames', collectionNames);

  await Promise.all(
    collections.map((collection) =>
      globalThis.connection.db.dropCollection(collection.collectionName),
    ),
  );
});

afterAll(async () => {
  await globalThis.connection.destroy();
});
