# Running the Project

## First Time Setup

Install dependencies for all workspaces from the root:

```bash
npm run ci
```

> This runs `npm ci` inside `client/`, `server/`, and `admin/` separately.

---

## Running Dev Servers

From the **root** directory:

```bash
# Run client (React / Vite)
npm run client

# Run server (Node / Express)
npm run server

# Run admin
npm run admin
```

Each command runs `npm run dev` inside the respective workspace.

> Open separate terminals to run multiple at the same time.

---

## Formatting

```bash
# Check formatting across all files
npm run format:check

# Auto-fix formatting across all files
npm run format:fix
```

---

## Committing Code

Commits are validated automatically by Husky on every `git commit`.

```bash
git add .
git commit -m "feat: Your message here"
```

**Commit format:** `type: Sentence case message`

| Type       | When to use                      |
| ---------- | -------------------------------- |
| `feat`     | New feature                      |
| `fix`      | Bug fix                          |
| `docs`     | Documentation changes            |
| `style`    | Formatting, no logic change      |
| `refactor` | Code restructure, no feature/fix |
| `perf`     | Performance improvement          |
| `test`     | Adding or updating tests         |
| `build`    | Build system changes             |
| `ci`       | CI/CD configuration              |
| `chore`    | Maintenance tasks                |
| `revert`   | Revert a previous commit         |

**Examples:**

```bash
git commit -m "feat: Add user login page"
git commit -m "fix: Resolve cors error on auth route"
git commit -m "chore: Update dependencies"
```

> ❌ Bad commits like `"fixed stuff"` or `"add login"` will be **blocked**.
