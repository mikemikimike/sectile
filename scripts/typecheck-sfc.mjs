import { createRequire } from 'node:module';
import { resolve } from 'node:path';

// Resolve the SFC compiler and its TypeScript bridge from the calling package.
const require = createRequire(resolve('package.json'));
const { run } = require('vue-tsc');
run(require.resolve('typescript-sfc/lib/tsc'));
