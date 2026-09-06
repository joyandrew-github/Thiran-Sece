# Running the Project

## Prerequisites

Make sure you have these installed before starting:

- [Node.js](https://nodejs.org/) — v18 or above
- npm — comes with Node.js
- [Git](https://git-scm.com/)

---

## Step 1 — Clone the Repo

```bash
git clone https://github.com/joyandrew-github/Thiran-Sece.git
cd Thiran-Sece
```

---

## Step 2 — Environment Setup

The server needs a `.env` file to run. Copy the example file:

```bash
cp server/.env.example server/.env
```

Then open `server/.env` and fill in the required values (ask your team lead).

---

## Step 3 — Install Dependencies

Run this **once** from the root directory to install everything:

```bash
npm run ci
```

> Installs root tools (husky, prettier, commitlint) **+** `client/`, `server/`, and `admin/` dependencies — all in one command.

---

## Step 4 — Run Dev Servers

Open **separate terminals** for each:

```bash
# Terminal 1 — Client (React / Vite)
npm run client      # → http://localhost:5173

# Terminal 2 — Server (Node / Express)
npm run server      # → http://localhost:5000

# Terminal 3 — Admin (React / Vite)
npm run admin       # → http://localhost:5174
```

---

## Formatting

```bash
npm run format:check    # see what needs formatting
npm run format:fix      # auto-fix all files
```

---

## Committing Code

Commits are validated automatically on every `git commit`. Follow this format:

```bash
git add .
git commit -m "type: Sentence case message"
```

**Allowed types:**

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

> ❌ Commits like `"fixed stuff"` or `"add login"` will be **blocked** — no type, lowercase subject.

---

## Troubleshooting

**Port already in use?** Vite will auto-pick the next port (5174, 5175…) and print it in the terminal.

**node_modules missing after pull?** Re-run `npm run ci`.
