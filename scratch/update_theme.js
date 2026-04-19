import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

const classMap = {
  // Backgrounds
  'bg-terminal-950': 'bg-slate-100',
  'bg-terminal-900': 'bg-slate-50',
  'bg-terminal-800': 'bg-white',
  'bg-terminal-700': 'bg-slate-100',
  'bg-terminal-600': 'bg-slate-200',
  
  // Text
  'text-terminal-50': 'text-slate-900',
  'text-terminal-100': 'text-slate-800',
  'text-terminal-200': 'text-slate-700',
  'text-terminal-300': 'text-slate-600',
  'text-terminal-400': 'text-slate-500',
  'text-terminal-500': 'text-slate-400',
  'text-terminal-600': 'text-slate-300',
  'text-terminal-700': 'text-slate-200',
  
  // Borders
  'border-terminal-800': 'border-slate-100',
  'border-terminal-700': 'border-slate-200',
  'border-terminal-600': 'border-slate-300',
  'border-terminal-500': 'border-slate-400',
  
  // Divide
  'divide-terminal-800': 'divide-slate-100',
  'divide-terminal-700': 'divide-slate-200',
  'divide-terminal-600': 'divide-slate-300',
  
  // Rings
  'ring-terminal-700': 'ring-slate-200',
  
  // Gradients (from/to)
  'from-terminal-900': 'from-slate-50',
  'from-terminal-800': 'from-white',
  'to-terminal-900': 'to-slate-50',
  'to-terminal-800': 'to-white',
  
  // Opacity variants
  'bg-terminal-800/50': 'bg-white/50',
  'bg-terminal-800/80': 'bg-white/80',
  'bg-terminal-700/50': 'bg-slate-100/50',
  'bg-terminal-700/30': 'bg-slate-100/50',
};

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.svelte') || file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles(srcDir);
let changedFilesCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // We sort the keys by length descending to replace the longest matches first (e.g., bg-terminal-800/50 before bg-terminal-800)
  const sortedKeys = Object.keys(classMap).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const value = classMap[key];
    // Use regex with word boundaries to ensure exact class match
    const regex = new RegExp(`\\b${key.replace(/\//g, '\\/')}\\b`, 'g');
    content = content.replace(regex, value);
  }

  // Also replace some hardcoded instances in specific patterns
  content = content.replace(/var\(--color-terminal-[0-9]+\)/g, (match) => {
    const numMatch = match.match(/\d+/);
    if (!numMatch) return match;
    const num = numMatch[0];
    const key = `text-terminal-${num}`; // just to map it roughly, or replace directly
    if (num === '900') return 'var(--color-slate-50)';
    if (num === '800') return '#ffffff';
    if (num === '100') return 'var(--color-slate-800)';
    if (num === '200') return 'var(--color-slate-700)';
    if (num === '400') return 'var(--color-slate-500)';
    if (num === '700') return 'var(--color-slate-200)';
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    changedFilesCount++;
    console.log(`Updated ${path.relative(srcDir, file)}`);
  }
}

console.log(`\nSuccessfully updated ${changedFilesCount} files.`);
