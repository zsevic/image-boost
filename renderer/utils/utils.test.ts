import assert from 'node:assert/strict';
import { getNumberWithOrdinal } from '.';

describe('orders', (): void => {
  it('should return st for 21', (): void => {
    assert.strictEqual(getNumberWithOrdinal(21), 'st');
  });

  it('should return nd for 32', (): void => {
    assert.strictEqual(getNumberWithOrdinal(32), 'nd');
  });

  it('should return th for 114', (): void => {
    assert.strictEqual(getNumberWithOrdinal(114), 'th');
  });

  it('should return rd for 123', (): void => {
    assert.strictEqual(getNumberWithOrdinal(123), 'rd');
  });
});
