import { debug as _debug } from 'debug';

const debug = _debug('jest-mongodb:test');

describe('Index', () => {
  it('test1', async () => {
    // https://github.com/shelfio/jest-mongodb#3-configure-mongodb-client
    debug("process.env['MONGO_URL']", process.env['MONGO_URL']);
    debug(
      'globalThis.__MONGO_URI__',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (globalThis as any).__MONGO_URI__,
    );
    debug(
      'globalThis.__MONGO_DB_NAME__',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (globalThis as any).__MONGO_DB_NAME__,
    );
    debug("process.env['MONGODB_URL']", process.env['MONGODB_URL']);
    debug('globalThis.connection.name', globalThis.connection.name);

    await globalThis.connection.db
      .collection('test1')
      .insertOne({ test: 'test' });
    const collectionNames = (await globalThis.connection.db.collections()).map(
      (collection) => collection.collectionName,
    );
    debug('test1 collectionNames', collectionNames);

    expect(true).toBe(true);
  });

  it('test2', async () => {
    await globalThis.connection.db
      .collection('test2')
      .insertOne({ test: 'test' });
    const collectionNames = (await globalThis.connection.db.collections()).map(
      (collection) => collection.collectionName,
    );
    debug('test2 collectionNames', collectionNames);
  });
});
