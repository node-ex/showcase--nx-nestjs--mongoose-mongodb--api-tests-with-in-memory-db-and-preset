/* eslint-disable */
import type { Config } from '@jest/types';

export default {
  displayName: 'app-nest-1',
  preset: '../../jest.preset.js',
  // Commented out to avoid conflict with `@shelf/jest-mongodb`
  // testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        /*
         * Disable type-checking to speed up test runs
         *
         * https://kulshekhar.github.io/ts-jest/docs/getting-started/options/
         * https://github.com/kulshekhar/ts-jest/blob/main/website/docs/getting-started/options/diagnostics.md
         * https://github.com/kulshekhar/ts-jest/issues/822#issuecomment-1961616203
         */
        diagnostics: false,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  watchPathIgnorePatterns: [
    // https://github.com/shelfio/jest-mongodb#6-jest-watch-mode-gotcha
    'globalConfig',
  ],
  coverageDirectory: '../../coverage/apps/app-nest-1',
  globalSetup: './jest/standalone/globalSetup.ts',
  globalTeardown: './jest/standalone/globalTeardown.ts',
  testEnvironment: './jest/standalone/testEnvironment.ts',
  setupFilesAfterEnv: [
    './jest/standalone/setupFilesAfterEnv/setupDatabaseConnection.ts',
  ],
} as Config.InitialOptions;
