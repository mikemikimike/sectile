import { defineConfig } from 'vite';
import virtualPackage from '@sectile/virtual/package.json' with { type: 'json' };

export default defineConfig(() => {
  const provenance = process.env['SECTILE_BENCHMARK_SOURCE'];
  if (provenance === undefined) throw new Error('Run pnpm build:benchmark or pnpm dev:benchmark from the repository root to supply build provenance.');
  const source = JSON.parse(provenance) as { gitCommit?: unknown; gitDirty?: unknown; buildFingerprint?: unknown };
  if (typeof source.gitCommit !== 'string' || typeof source.gitDirty !== 'boolean' || typeof source.buildFingerprint !== 'string') {
    throw new Error('Benchmark build provenance is invalid.');
  }
  return {
    define: {
      __BENCHMARK_SOURCE__: JSON.stringify(source),
      __SECTILE_VIRTUAL_VERSION__: JSON.stringify(virtualPackage.version),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    resolve: { dedupe: ['vue'] },
  };
});
