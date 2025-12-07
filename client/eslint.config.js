// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const rxjs = require('@smarttools/eslint-plugin-rxjs');
const parser = require('@typescript-eslint/parser');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    ignores: [
      '**/proxy.conf.ts',
      '**/*.spec.ts',
      '**/server.ts',
      '**/main.ts',
      '**/polyfills.ts',
      '**/test.ts',
      '**/main.server.ts',
      '**/environment.ts',
      '**/environment.*.ts',
      '**/*.routes.ts',
    ],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      rxjs.configs.recommended,
      eslintPluginPrettierRecommended,
    ],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 'latest',        // or a year, e.g., 2021
        sourceType: 'module',         // default is usually fine for Angular
        project: './tsconfig.json',   // enables rules requiring type info
        ecmaFeatures: {
          jsx: false,                  // or true if using JSX/TSX
        },
        // More parser options as needed, see docs below
      },
    },

    plugins: {
      rxjs,
    },
    processor: angular.processInlineTemplates,
    rules: {
      'prettier/prettier': [
        'error',
        {
          "useTabs": false,
          "tabWidth": 2,
          "trailingComma": "all",
          "semi": true,
          "singleQuote": true,
          "printWidth": 80,
          "bracketSameLine": false,
          "bracketSpacing": true,
          "plugins": ["prettier-plugin-organize-imports"]
        }
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'mb',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'mb',
          style: 'kebab-case',
        },
      ],
      '@smarttools/rxjs/no-implicit-any-catch': [
        "error",
        { "allowExplicitAny": true }
      ],
      '@smarttools/rxjs/no-nested-subscribe': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/typedef': [
        'error',
        {
          arrayDestructuring: true,
          arrowParameter: true,
          memberVariableDeclaration: true,
          objectDestructuring: true,
          parameter: true,
          propertyDeclaration: true,
          variableDeclaration: true,
          variableDeclarationIgnoreFunction: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      'no-restricted-syntax': [
        'error',
        {
          message:
            'Unexpected use of `window`. Use inject(DOCUMENT)?.defaultView instead.',
          selector: 'ExpressionStatement[expression.name="window"]',
        },
        {
          message:
            'Unexpected use of `document`. Use inject(DOCUMENT) instead.',
          selector: 'ExpressionStatement[expression.name="document"]',
        },
        {
          message:
            'Unexpected use of `document.*`. Use inject(DOCUMENT)?.* instead.',
          selector: 'MemberExpression[object.name="document"]',
        },
        {
          message:
            'Unexpected use of `window.*`. Use inject(DOCUMENT)?.defaultView.* instead.',
          selector: 'MemberExpression[object.name="window"]',
        },
        {
          message: 'Empty constructor can be removed.',
          selector:
            'ClassDeclaration > ClassBody > MethodDefinition[kind="constructor"][value.params.length=0][value.body.body.length=0]',
        },
        {
          selector:
            'CallExpression[callee.object.name=/^(localStorage|sessionStorage)$/][callee.property.name=/^(getItem|setItem|removeItem)$/][arguments.0.type="Literal"]',
          message:
            'Use an app-wide enum to store keys for working with localStorage/sessionStorage.',
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit', // require explicit visibility
          overrides: {
            accessors: 'explicit',
            constructors: 'off',     // you may set to "explicit" if you want for constructors too
            methods: 'explicit',
            properties: 'explicit',       // set to "explicit" if you want for class properties too
            parameterProperties: 'explicit',
          },
        },
      ],

    },
  },
  {
    files: ['**/*.html'],
    ignores: ['**/src/index.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      eslintPluginPrettierRecommended,
    ],
    rules: {
      '@angular-eslint/template/click-events-have-key-events': 'off',
      'prettier/prettier': [
        'error',
        {
          tabWidth: 2,
          useTabs: false,
          singleQuote: true,
          endOfLine: 'lf',
          printWidth: 80,
        },
      ],
      "@angular-eslint/template/elements-content": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/alt-text": "off",
    },
  },
);
