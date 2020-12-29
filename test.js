import tap from 'tap';
import { API } from '../api.js';
import { AccessRight, Role } from '../types.js';

const api = new API();

tap.test('reporter can sumbit data', test => {
  test.doesNotThrow(() =>
    api.handleRequest(Role.Reporter, 'add', 'rnd', { measurment: 42 }),
  );
  test.end();
});

tap.test('moderator can read data', test => {
  const data = { measurment: 42 };
  api.handleRequest(Role.Reporter, 'add', 'rnd', data);
  test.equal(api.handleRequest(Role.Moderator, 'read', 'rnd'), data);
  test.end();
});

tap.test('reporter can not read data', test => {
  test.throws(() => api.handleRequest(Role.Reporter, 'read', 'rnd'));
  test.end();
});
