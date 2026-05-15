const { rm, mkdir, cp } = require('fs/promises');
const { resolve } = require('path');

async function run() {
  const root = resolve(process.cwd());
  const sourceApp = resolve(root, '.next', 'server', 'app');
  const sourceStatic = resolve(root, '.next', 'static');
  const sourcePublic = resolve(root, 'public');
  const outDir = resolve(root, 'out');

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  await cp(sourceApp, outDir, { recursive: true });
  await cp(sourcePublic, outDir, { recursive: true });
  await mkdir(resolve(outDir, '_next', 'static'), { recursive: true });
  await cp(sourceStatic, resolve(outDir, '_next', 'static'), { recursive: true });

  console.log('Exported static site to out/');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
