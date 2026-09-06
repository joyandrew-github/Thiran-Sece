#!/usr/bin/env node
import { spawnSync } from 'child_process';

const isCheck = process.argv[2] === 'check';

// ── ANSI helpers ──────────────────────────────────────────────
const c = {
    green:  s => `\x1b[32m${s}\x1b[0m`,
    red:    s => `\x1b[31m${s}\x1b[0m`,
    yellow: s => `\x1b[33m${s}\x1b[0m`,
    dim:    s => `\x1b[2m${s}\x1b[0m`,
    bold:   s => `\x1b[1m${s}\x1b[0m`,
};

// ── Workspaces to format ───────────────────────────────────────
const targets = [
    { name: 'client', patterns: ['client/'] },
    { name: 'server', patterns: ['server/'] },
    { name: 'admin',  patterns: ['admin/'] },
    { name: 'root',   patterns: ['*.json', '*.md', '*.js', '*.cjs', '.prettierrc'] }
];

// ── Header ─────────────────────────────────────────────────────
console.log('');
console.log(c.bold(isCheck ? '🔍  Checking format...' : '🎨  Formatting files...'));
console.log('');

let hasErrors = false;
const startAll = Date.now();

// ── Run per workspace ──────────────────────────────────────────
for (const { name, patterns } of targets) {
    const start = Date.now();

    const args = isCheck
        ? ['prettier', '--check', ...patterns]
        : ['prettier', '--write', ...patterns];

    const result = spawnSync('npx', args, { encoding: 'utf8', shell: true });
    const ms = Date.now() - start;
    const time = c.dim(`${ms}ms`);

    if (isCheck) {
        const warnLines = (result.stdout + result.stderr)
            .split('\n')
            .filter(l => l.includes('[warn]'));

        if (result.status !== 0) {
            hasErrors = true;
            console.log(`  ${c.red('✗')}  ${c.bold(name.padEnd(8))}  ${c.red(`${warnLines.length} file(s) need formatting`)}  ${time}`);
            warnLines.forEach(l => {
                const file = l.replace('[warn] ', '').trim();
                console.log(`       ${c.dim('→')} ${c.dim(file)}`);
            });
        } else {
            console.log(`  ${c.green('✓')}  ${c.bold(name.padEnd(8))}  ${c.dim('all good')}  ${time}`);
        }

    } else {
        const lines = result.stdout.split('\n').filter(Boolean);
        const changed = lines.filter(l => !l.includes('(unchanged)')).length;
        const total = lines.length;

        const detail = changed > 0
            ? `${c.yellow(`${changed} fixed`)} ${c.dim(`/ ${total} files`)}`
            : c.dim(`${total} files — no changes`);

        console.log(`  ${c.green('✓')}  ${c.bold(name.padEnd(8))}  ${detail}  ${time}`);
    }
}

// ── Footer ─────────────────────────────────────────────────────
const total = Date.now() - startAll;
console.log('');

if (isCheck && hasErrors) {
    console.log(c.yellow('  ⚠  Some files need formatting.'));
    console.log(c.dim('     Run: npm run format:fix'));
    console.log('');
    process.exit(1);
} else if (isCheck) {
    console.log(c.green('  ✨ All files are properly formatted!'));
} else {
    console.log(c.green('  ✨ Done') + c.dim(`  in ${total}ms`));
}
console.log('');
