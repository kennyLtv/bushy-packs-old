import execAsync from '../src/execAsync';
import * as path from 'path';

jest.setTimeout(5 * 60 * 1000);

test('lazy test for shell output', async (): Promise<void> => {
  const cmd = 'echo foo';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..')
  });
  await expect(prom).resolves.toEqual('foo');
});

test('fails from missing directory arg', async (): Promise<void> => {
  const cmd = 'npm run build && npm run start -- -c busheezy/bushy-packs-test-config -p test';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..')
  });
  await expect(prom).rejects.toThrow('You did not specify which directory.');
});

test('fails from missing preset arg', async (): Promise<void> => {
  const cmd = 'npm run build && npm run start -- -c busheezy/bushy-packs-test-config -d ./tests/test-output';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..')
  });
  await expect(prom).rejects.toThrow('You did not specify which preset.');
});

test('fails from missing config arg', async (): Promise<void> => {
  const cmd = 'npm run build && npm run start -- -d ./tests/test-output -p test';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..')
  });
  await expect(prom).rejects.toThrow('You did not specify a config repo.');
});

test('run', async (): Promise<void> => {
  const cmd = 'npm run build && npm run start -- -c busheezy/bushy-packs-test-config -d ./tests/test-output -p test';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..')
  });

  await expect(prom).resolves.toBeDefined();
});

test('check if shell runs', async (): Promise<void> => {
  const cmd = 'npm run build && npm run start -- -c busheezy/bushy-packs-test-config -d ./tests/test-output -p test -r busheezy/bushy-packs-tests';
  const prom = execAsync(cmd, {
    cwd: path.join(__dirname, '..')
  });
  
  await expect(prom).resolves.toContain('The shell has ran.');
});
