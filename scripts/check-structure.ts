import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const maximumLines = 150;
const sourceDirectories = ['apps', 'packages', 'scripts', 'tests'];

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) {
        return sourceFiles(file);
      }
      return file.endsWith('.ts') ? [file] : [];
    }),
  );
  return nested.flat();
}

/** Ограничение размера действует на исходники, данные курсов, скрипты и тесты. */
async function checkStructure() {
  const files = (await Promise.all(sourceDirectories.map(sourceFiles))).flat().sort();
  const violations: string[] = [];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const lines = source.replace(/\r\n/g, '\n').trimEnd().split('\n').length;
    if (lines > maximumLines) {
      violations.push(`${file}: ${lines} строк (максимум ${maximumLines})`);
    }
  }

  if (violations.length) {
    console.error(violations.join('\n'));
    process.exitCode = 1;
    return;
  }
  console.log(`Проверено ${files.length} TypeScript-файлов: каждый не больше ${maximumLines} строк.`);
}

await checkStructure();
