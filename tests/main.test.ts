import execAsync from '../src/execAsync';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vdf from 'simple-vdf';

import fileAccess from '../src/fileAccess';

jest.setTimeout(5 * 60 * 1000);

const testOutputDir = path.join(__dirname, '..', 'tests', 'test-output');
const compareToDir = path.join(__dirname, '..', 'tests', 'compare-to');

try {
  fs.accessSync(testOutputDir);
  try {
    fs.removeSync(testOutputDir);
    fs.mkdirpSync(testOutputDir);
  } catch {
    console.error('error remaking test output dir');
  }
} catch {}

test('lazy test for shell output', async (): Promise<void> => {
  const cmd = 'echo foo';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..'),
  });
  await expect(prom).resolves.toEqual('foo');
});

test('fails from missing directory arg', async (): Promise<void> => {
  const cmd = 'npm run start -- -c busheezy/bushy-packs-test-config -p test';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..'),
  });
  await expect(prom).rejects.toThrow('You did not specify which directory.');
});

test('fails from missing preset arg', async (): Promise<void> => {
  const cmd =
    'npm run start -- -c busheezy/bushy-packs-test-config -d ./tests/test-output';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..'),
  });
  await expect(prom).rejects.toThrow('You did not specify which preset.');
});

test('fails from missing config arg', async (): Promise<void> => {
  const cmd = 'npm run start -- -d ./tests/test-output -p test';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..'),
  });
  await expect(prom).rejects.toThrow('You did not specify a config repo.');
});

test('run', async (): Promise<void> => {
  const cmd =
    'npm run start -- -c busheezy/bushy-packs-test-config -d ./tests/test-output -p test';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..'),
  });

  await expect(prom).resolves.toBeDefined();
});

test('shell & scripting runs', async (): Promise<void> => {
  const cmd =
    'npm run start -- -c busheezy/bushy-packs-test-config -d ./tests/test-output -p test -r busheezy/bushy-packs-tests';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..'),
  });

  await expect(prom).resolves.toContain('The shell has ran.');
  await expect(prom).resolves.toContain('Running: benchmark.sp');
  await expect(prom).resolves.toContain('Running: cstrike-test.sp');
});

test('normal file is copied', async (): Promise<void> => {
  await expect(
    fileAccess(path.join(testOutputDir, 'file.copy.txt')),
  ).resolves.toBeTruthy();
});

test('fails on file is not there', async (): Promise<void> => {
  await expect(
    fileAccess(path.join(testOutputDir, 'file.not.here.txt')),
  ).resolves.toBeFalsy();
});

test('ensure file was deleted from delete.txt', async (): Promise<void> => {
  await expect(
    fileAccess(path.join(testOutputDir, 'file.delete.txt')),
  ).resolves.toBeFalsy();
});

test('folder is copied', async (): Promise<void> => {
  await expect(
    fileAccess(path.join(testOutputDir, 'folder.copy')),
  ).resolves.toBeTruthy();
  await expect(
    fileAccess(path.join(testOutputDir, 'folder.copy', 'test1.txt')),
  ).resolves.toBeTruthy();
  await expect(
    fileAccess(path.join(testOutputDir, 'folder.copy', 'test2.txt')),
  ).resolves.toBeTruthy();
});

test('vdf merged', async (): Promise<void> => {
  const outputBuffer = await fs.readFile(
    path.join(testOutputDir, 'databases.cfg'),
  );
  const outputString = outputBuffer.toString();
  const outputObj = vdf.parse(outputString);

  expect(outputObj).toMatchObject({
    Databases: {
      test1: {
        driver: '1',
        host: '2',
        database: '3',
        user: '4',
        pass: '5',
        port: '6',
      },
      test2: {
        driver: '1',
        host: '2',
        database: '3',
        user: '4',
        pass: '5',
        port: '6',
      },
    },
  });
});

test('handlebars var', async (): Promise<void> => {
  const outputBuffer = await fs.readFile(
    path.join(testOutputDir, 'file.copy.hb', 'test1.txt'),
  );
  const compareBuffer = await fs.readFile(
    path.join(compareToDir, 'file.copy.hb', 'test1.txt'),
  );

  expect(outputBuffer).toEqual(compareBuffer);
});

test('handlebars merged var', async (): Promise<void> => {
  const outputBuffer = await fs.readFile(
    path.join(testOutputDir, 'file.copy.hb', 'test2.txt'),
  );
  const compareBuffer = await fs.readFile(
    path.join(compareToDir, 'file.copy.hb', 'test2.txt'),
  );

  expect(outputBuffer).toEqual(compareBuffer);
});

test('handlebars incrementer', async (): Promise<void> => {
  const outputBuffer = await fs.readFile(
    path.join(testOutputDir, 'file.copy.hb', 'test3.txt'),
  );
  const compareBuffer = await fs.readFile(
    path.join(compareToDir, 'file.copy.hb', 'test3.txt'),
  );

  expect(outputBuffer).toEqual(compareBuffer);
});

test('handlebars condition', async (): Promise<void> => {
  const outputBuffer = await fs.readFile(
    path.join(testOutputDir, 'file.copy.hb', 'test4.txt'),
  );
  const compareBuffer = await fs.readFile(
    path.join(compareToDir, 'file.copy.hb', 'test4.txt'),
  );

  expect(outputBuffer).toEqual(compareBuffer);
});
