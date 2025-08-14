import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts', 'src/modules/**/*.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  target: 'es2022',
});
