module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/recommended',
        '@vue/typescript'
    ],
    plugins: ['eslint-plugin-member-order'],
    rules: {
        // from TSLINT
        // '@typescript-eslint/member-ordering': 'warn',    // Causes Issues for more enable if you want ( cant auto fix )
        // 'variable-name': [                               // Removed as it doesnt exist on eslint and couldnt find a replacement
        //     'warn',
        //     [
        //         'ban-keywords',
        //         'check-format',
        //         'allow-leading-underscore',
        //         'allow-trailing-underscore',
        //         'allow-pascal-case'
        //     ]
        // ],
        'getter-return': 'off',
        'vue/valid-v-for': 'off',
        'vue/html-indent': ['warn', 4],
        'vue/no-lone-template': 'error',
        'vue/no-parsing-error': [
            'error',
            {
                'missing-semicolon-after-character-reference': false
            }
        ],
        '@typescript-eslint/member-delimiter-style': [
            'warn',
            {
                multiline: {
                    delimiter: 'none',
                    requireLast: true
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false
                }
            }
        ],
        '@typescript-eslint/adjacent-overload-signatures': 'warn',
        '@typescript-eslint/array-type': [
            'warn',
            {
                default: 'array'
            }
        ],
        '@typescript-eslint/ban-types': [
            'warn',
            {
                types: {
                    Function: false,
                    Object: false,
                    Boolean: {
                        message:
                            'Avoid using the `Boolean` type. Did you mean `boolean`?',
                        fixWith: 'boolean'
                    },
                    Number: {
                        message:
                            'Avoid using the `Number` type. Did you mean `number`?',
                        fixWith: 'number'
                    },
                    String: {
                        message:
                            'Avoid using the `String` type. Did you mean `string`?',
                        fixWith: 'string'
                    },
                    Symbol: {
                        message:
                            'Avoid using the `Symbol` type. Did you mean `symbol`?'
                    }
                }
            }
        ],
        '@typescript-eslint/consistent-type-assertions': 'warn',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-misused-new': 'warn',
        '@typescript-eslint/no-namespace': 'warn',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-shadow': [
            'off',
            {
                hoist: 'all'
            }
        ],
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/prefer-for-of': 'off',
        '@typescript-eslint/unified-signatures': 'off',
        'constructor-super': 'warn',
        'new-parens': 'warn',
        'no-bitwise': 'off',
        'no-caller': 'warn',
        'no-cond-assign': 'warn',
        'no-console': 'off',
        'no-debugger': 'error',
        'no-empty': 'warn',
        'no-empty-function': 'off',
        'no-eval': 'warn',
        'no-fallthrough': 'off',
        'no-invalid-this': 'off',
        'no-multiple-empty-lines': 'off',
        'no-new-wrappers': 'warn',
        'no-shadow': 'off',
        'no-throw-literal': 'warn',
        'no-trailing-spaces': 'warn',
        'no-undef-init': 'warn',
        'no-unsafe-finally': 'off',
        'no-unused-expressions': 'error',
        'no-unused-labels': 'error',
        'no-use-before-define': 'off',
        'no-var': 'warn',
        'object-shorthand': 'warn',
        'one-var': ['warn', 'never'],
        'prefer-const': 'warn',
        'use-isnan': 'warn',
        'valid-typeof': 'off',
        'no-useless-escape': 'off',

        // New Rules
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        'no-prototype-builtins': 'off',
        'no-case-declarations': 'off',
        'no-useless-catch': 'off',
        'no-async-promise-executor': 'off'
    },
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    globals: {
        NodeJS: true,
        Dictionary: 'readonly',
        __ENV: 'readonly',
        __VERSION: 'readonly'
    }
}
