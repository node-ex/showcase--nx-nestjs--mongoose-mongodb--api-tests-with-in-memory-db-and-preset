import type { Connection } from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var connection: Connection;
}

export {};
