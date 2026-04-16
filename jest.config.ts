import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
};

export default config;
