// https://github.com/typegoose/mongodb-memory-server#available-options-for-mongomemoryserver
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '7.0.12',
      skipMD5: true,
    },
    autoStart: false,
    /*
     * Use the same database server with a dynamic name for all test suites.
     * See https://github.com/shelfio/jest-mongodb#2-create-jest-mongodb-configjs for more details.
     */
    instance: {
      /* If `dbName` is not provided, a random name will be generated for the in-memory DB */
    },
  },
  useSharedDBForAllJestWorkers: true,
};
