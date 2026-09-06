## format check and fix, lint check and fix

```bash

npm install -D prettier husky lint-staged @commitlint/cli @commitlint/config-conventional

npm install -D eslint-config-prettier

```

## STEP 2 — Prettier setup (formatting)

# .prettierrc

```json
{
    "trailingComma": "none",
    "tabWidth": 4,
    "semi": true,
    "singleQuote": true,
    "bracketSameLine": true,
    "printWidth": 150,
    "singleAttributePerLine": true,
    "endOfLine": "auto"
}
```

.prettierignore

```bash

node_modules
dist
build
.env

```

## STEP 3 — ESLint config (JS / JSX only)

```javascript
// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: ['dist/**', 'node_modules/**', 'build/**']
    },

    js.configs.recommended,

    reactRefresh.configs.vite, // handles Fast Refresh + basic React setup

    prettierConfig, // last → disables style conflicts

    {
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 'latest',
            sourceType: 'module', // ← fixes import/export parsing
            parserOptions: {
                ecmaFeatures: { jsx: true } // ← enables <JSX> parsing
            }
        },

        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'warn',

            // Fast Refresh rule – keep warn, but allow non-component exports
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true } // allows export const useSomething = ...
            ]
        }
    }
];
```

Add script in package.json

```json
"lint:check": "eslint .",
"lint:fix": "eslint . --fix",

"format:check": "prettier --check .",
"format:fix": "prettier --write ."

```

# Husky Setup --

Husky is a tool that runs automated checks (like code formatting, linting, tests) before you commit or push code to Git.
Why use it? It prevents bad code from entering your repository by catching errors early and enforcing code quality standards automatically.

```bash

npm husky-init
```

it will create the husky folder with
pre-commit example file

we need to change that to

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

and create the commit-msg file manually
and add the below content

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

#### finally add the lint-staged.config.js file and commitlint.config.cjs file

- lint-staged file

    ```javascript
    const config = {
        '*.{js,jsx}': ['npm run format:fix', 'npm run lint:fix'],
        '*.{json,md,html,yml,yaml,css}': ['npm run format:fix']
    };
    export default config;
    ```

- commitlint file

    ```javascript
    module.exports = {
        extends: ['@commitlint/config-conventional'],
        rules: {
            'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']],
            'subject-case': [2, 'always', 'sentence-case']
        }
    };
    ```

### Test everything

- Test formatting

    ```bash
    npm run format:check
     npm run format:fix
    ```

- Test linting

    ```bash
    npm run lint:check
    npm run lint:fix
    ```

- Test commit flow

    ```bash
    git add .
    git commit -m "feat: Initial project setup"
    ```

    - if we give commit it as save are simple it will not allowed and it is not commited
    - it should start with command and message first letter start wiht caps

### if Husky not works

- change the script to

```json
{
    "scripts": {
        "prepare": "husky"
    }
}
```

- and run the npm run prepare

- run the command and check it show .husky on terminal

    ```bash
       git config core.hooksPath

    ```

- Update .husky/pre-commit:

```bash
  npx lint-staged
```

- Update .husky/commit-msg:

```bash
 npx --no -- commitlint --edit $1
```

- test with proper commit

```bash
 git add .
 git commit -m "chore: Update Husky configuration"
```
