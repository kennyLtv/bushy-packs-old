test('adds 1 + 2 to equal 3', async (): Promise<void> => {
  await expect(Promise.resolve(3)).resolves.toBe(4);
});
