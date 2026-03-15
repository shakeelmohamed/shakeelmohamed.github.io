const prettierConfig = require('eslint-config-prettier');
const playwrightPlugin = require('eslint-plugin-playwright');

module.exports = [
    {
        ignores: [
            'node_modules/**',
            'docs/**',
            '.cache/**',
            'test-results/**',
            'src/scripts/**/*.min.js',
            'src/scripts/**/*.css',
            'src/scripts/fontsampler/**',
        ],
    },
    {
        files: ['tests/**/*.js'],
        plugins: {
            playwright: playwrightPlugin,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            ...playwrightPlugin.configs.recommended.rules,
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            indent: ['error', 4],
            'no-multi-spaces': 'off',
            'playwright/no-networkidle': 'off',
            'playwright/no-wait-for-timeout': 'off',
            'playwright/no-conditional-in-test': 'off',
            'playwright/no-eval': 'off',
            'playwright/expect-expect': 'off',
        },
    },
    {
        files: ['scripts/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                require: 'readonly',
                module: 'readonly',
                __dirname: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
            indent: ['error', 4],
            'no-multi-spaces': 'error',
        },
    },
    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                require: 'readonly',
                module: 'readonly',
                __dirname: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
            indent: ['error', 4],
            'no-multi-spaces': 'off',
        },
    },
];
