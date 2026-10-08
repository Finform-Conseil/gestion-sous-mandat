import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('src');
const ALLOWED_ROOT = path.resolve('src/styles/finform');
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.scss', '.css']);

const FORBIDDEN_THEME_LITERALS = [
  '#FAFAFC', '#FCFCFD', '#F0F1F5', '#EEF0F4', '#F7F7F8', '#F7F8FA', '#F7F8FB',
  '#F5F6F9', '#FBFCFE', '#EFF3FB', '#EEF1FF', '#F4F6FF', '#F3F6FC',
  '#FBF7EE', '#FFF8E9', '#FFFCF4', '#FFFCF5', '#FFFCF6', '#FBF1DD',
  '#E4F5EF', '#EAF8F3', '#F1FAF6', '#F4FBF8', '#F3FBF8', '#F5FCF9', '#F6FBF9',
  '#FBE9E7', '#FDECEA', '#FFF8F7', '#FFF4F2', '#FDEEEE', '#FFF7F6', '#FFF3F1',
  '#D8DFEF', '#CDE9DF', '#B8DFD2', '#CFE9DF', '#CBEADF', '#CDEADF',
  '#B9E2D5', '#B9E3D4', '#F1CFCB', '#ECC2BD', '#F3C4BF', '#F0C9C4',
  '#F0D2CF', '#F1D6D2', '#EAD9AD', '#E6D4AC', '#ECD6A4', '#E9CF91', '#8A6A16',
];

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

const violations = [];
for (const file of await walk(ROOT)) {
  if (file.startsWith(ALLOWED_ROOT + path.sep)) continue;
  const source = await fs.readFile(file, 'utf8');
  const lines = source.split('\n');

  lines.forEach((line, index) => {
    for (const literal of FORBIDDEN_THEME_LITERALS) {
      if (line.toUpperCase().includes(literal)) {
        violations.push({
          file: path.relative(process.cwd(), file),
          line: index + 1,
          literal,
          source: line.trim(),
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error('FINFORM_THEME_CONTRACT_VIOLATION');
  console.error(JSON.stringify(violations, null, 2));
  process.exit(1);
}

console.log('FINFORM_THEME_CONTRACT_OK');
