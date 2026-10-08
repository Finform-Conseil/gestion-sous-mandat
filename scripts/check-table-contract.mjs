import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('src');
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (EXTENSIONS.has(path.extname(entry.name))) files.push(absolute);
  }
  return files;
}

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length;
}

const violations = [];

for (const file of await walk(ROOT)) {
  const source = await fs.readFile(file, 'utf8');
  const relative = path.relative(process.cwd(), file);

  for (const match of source.matchAll(/<table\b[\s\S]*?>/g)) {
    const openingTag = match[0];
    if (!openingTag.includes('minWidth:')) continue;
    if (!openingTag.includes('gsm-table--banking')) {
      violations.push({
        rule: 'WIDE_TABLE_REQUIRES_BANKING_GRAMMAR',
        file: relative,
        line: lineOf(source, match.index),
        source: openingTag.replace(/\s+/g, ' ').trim(),
      });
    }
  }

  for (const match of source.matchAll(/className="[^"]*overflow-x-auto[^"]*"/g)) {
    const tail = source.slice(match.index, match.index + 500);
    if (/<table\b/.test(tail)) {
      violations.push({
        rule: 'TABLE_SCROLL_REQUIRES_SHARED_WRAPPER',
        file: relative,
        line: lineOf(source, match.index),
        source: match[0],
      });
    }
  }
}

const gsmStyles = await fs.readFile(path.resolve('src/styles/gsm.scss'), 'utf8');
const mobileFallbackContract = [
  '@media (max-width: 768px)',
  '.gsm-app-root table:not(.gsm-table--banking)',
  'overflow-x: auto',
  'white-space: nowrap !important',
  'overflow-wrap: normal !important',
  'word-break: normal !important',
];

for (const requirement of mobileFallbackContract) {
  if (!gsmStyles.includes(requirement)) {
    violations.push({
      rule: 'MOBILE_TABLE_HORIZONTAL_SCROLL_CONTRACT',
      file: 'src/styles/gsm.scss',
      line: 1,
      source: `Missing responsive table contract fragment: ${requirement}`,
    });
  }
}

if (violations.length > 0) {
  console.error('GSM_TABLE_CONTRACT_VIOLATION');
  console.error(JSON.stringify(violations, null, 2));
  process.exit(1);
}

console.log('GSM_TABLE_CONTRACT_OK');
