const { spawnSync } = require('child_process');
const { existsSync, mkdirSync, readdirSync, rmSync, copyFileSync, writeFileSync } = require('fs');
const { resolve, join } = require('path');

const root = resolve(process.cwd());
const worktree = resolve(root, '..', 'point_keeper-gh-pages');
const outDir = resolve(root, 'out');
const nextBin = resolve(root, 'node_modules', 'next', 'dist', 'bin', 'next');
const exportScript = resolve(root, 'scripts', 'export-gh-pages.js');

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`);
  }
}

function copyDirectory(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function clearWorktree(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    rmSync(join(dir, entry.name), { recursive: true, force: true });
  }
}

function gitWorktree(args) {
  return run('git', args, { cwd: root });
}

function tryCreateWorktree() {
  try {
    gitWorktree(['worktree', 'add', '-B', 'gh-pages', worktree, 'origin/gh-pages']);
  } catch (error) {
    console.log('origin/gh-pages not available, creating local gh-pages branch instead...');
    gitWorktree(['worktree', 'add', '-B', 'gh-pages', worktree]);
  }
}

(function main() {
  if (!existsSync(nextBin)) {
    throw new Error('Next binary not found. Run npm install before publishing.');
  }

  console.log('Building the app...');
  run('node', [nextBin, 'build'], { cwd: root });

  console.log('Exporting static pages...');
  run('node', [exportScript], { cwd: root });

  if (!existsSync(outDir)) {
    throw new Error('Export directory not found: out/');
  }

  if (existsSync(worktree)) {
    console.log('Removing existing gh-pages worktree...');
    gitWorktree(['worktree', 'remove', '-f', worktree]);
  }

  console.log('Creating gh-pages worktree...');
  tryCreateWorktree();

  console.log('Clearing old files from gh-pages worktree...');
  clearWorktree(worktree);

  console.log('Copying exported files into gh-pages...');
  copyDirectory(outDir, worktree);

  console.log('Installing .nojekyll...');
  writeFileSync(join(worktree, '.nojekyll'), '');

  console.log('Committing and pushing gh-pages...');
  run('git', ['add', '-A'], { cwd: worktree });
  const commit = spawnSync('git', ['commit', '-m', 'Publish static site to gh-pages'], { cwd: worktree, stdio: 'inherit' });
  if (commit.status !== 0) {
    console.log('No new changes to commit. Skipping commit.');
  }
  run('git', ['push', '-u', 'origin', 'gh-pages'], { cwd: worktree });

  console.log('Deployment complete.');
})();
