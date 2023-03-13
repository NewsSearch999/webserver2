export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: [
    'node_modules',
    '<rootDir>/libs',
    '<rootDir>/apps',
  ],
  moduleNameMapper: {
    '^@app\/common\/entity\/(.*)$': '<rootDir>/libs/common/src/entity/$1',
    '^@app\/common\/rmq\/(.*)$': '<rootDir>/libs/common/src/rmq/$1',
    '^@app/(.*)$': '<rootDir>/libs/common/src/$1',
  },
};