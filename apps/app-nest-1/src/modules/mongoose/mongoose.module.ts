import { Module } from '@nestjs/common';
import { MongooseModule as _MongooseModule } from '@nestjs/mongoose';
import { debug as _debug } from 'debug';

/** Not an appropriate namespace name, but makes it simpler to filter debug statements */
const debug = _debug('jest-mongodb:mongoose-module');

export const _mongooseModuleForRoot = _MongooseModule.forRootAsync({
  useFactory: () => {
    debug('MongooseModule.forRootAsync.useFactory');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    debug('globalThis.__MONGO_URI__', (globalThis as any).__MONGO_URI__);
    debug('process.env[MONGODB_URL]', process.env['MONGODB_URL']);

    return {
      uri: process.env['MONGODB_URL']!,
    };
  },
});

@Module({
  imports: [_mongooseModuleForRoot],
})
export class MongooseModule {}
