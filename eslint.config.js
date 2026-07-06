const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    js.configs.recommended,
    prettierConfig,
    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            prettier: prettierPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },
            'import/resolver': {
                typescript: {},
            },
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
            'import/no-extraneous-dependencies': [
                2,
                { devDependencies: ['**/test.tsx', '**/test.ts'] },
            ],
            'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
            'max-len': [
                2,
                {
                    code: 100,
                    ignorePattern: '^import [^,]+ from |^export | implements',
                },
            ],
            'no-duplicate-imports': ['error'],
            'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
            'no-unused-vars': 'off',
            'no-undef': 'off',
            'object-curly-newline': ['error', { consistent: true }],
            semi: [2, 'always'],
            'space-before-function-paren': [
                'error',
                { anonymous: 'never', named: 'never', asyncArrow: 'ignore' },
            ],
            '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
            '@typescript-eslint/no-explicit-any': [0],
            '@typescript-eslint/no-unused-vars': [2, { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-use-before-define': [0],
            'import/no-default-export': ['error'],
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
            'prettier/prettier': 'error',
        },
    },
];
