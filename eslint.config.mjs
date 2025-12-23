import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
  // Next.js core web vitals rules
  ...nextVitals,

  // TypeScript rules
  ...nextTs,

  // Custom plugins and rules
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      // Simple Import Sort Plugin rules
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // Unused Imports Plugin rules
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // React and Next.js rules
      'react/no-unescaped-entities': 'off',
      'no-prototype-builtins': 'off',
      '@next/next/no-img-element': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // Import path rules - prefer alias imports over relative imports
      'no-relative-import-paths/no-relative-import-paths': [
        'warn',
        {
          allowSameFolder: true,
          rootDir: 'src',
          prefix: '@',
        },
      ],
    },
  },

  // Override for shared-fe submodule - disable no-relative-import-paths rule
  {
    files: ['src/shared-fe/**/*.ts', 'src/shared-fe/**/*.tsx'],
    rules: {
      'no-relative-import-paths/no-relative-import-paths': 'off',
      // Enforce relative imports in shared-fe
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/*', '~/*', '~/shared-fe/*'],
              message:
                'Use relative imports (./path or ../path) instead of path aliases in shared-fe submodule.',
            },
          ],
        },
      ],
    },
  },

  // Prettier config (must come after other configs to disable conflicting rules)
  prettier,

  // Global ignores
  globalIgnores([
    // Next.js defaults
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Project-specific ignores
    'node_modules/**',
    '**/*.d.ts',
    'src/lib/mongo-db-client/**',
    'helm-values/**',
    '**/*.yaml',
    '**/*.yml',
    '**/*.json',
    '**/*.md',
  ]),
]);

export default eslintConfig;
