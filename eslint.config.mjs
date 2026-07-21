import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**', '.vscode-test/**'],
    },
    ...tseslint.configs.recommended,
    {
        rules: {
            curly: 'warn',
            eqeqeq: 'warn',
            'no-throw-literal': 'warn',
        },
    },
);
