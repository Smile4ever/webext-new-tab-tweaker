const
	assert = require('assert'),
	Ordering = require('../../src/common/ordering');
	Version = require('../../src/configuration/version.js');

describe('current version descriptor', function()
{
	it ('should have the correct major, minor, and patch fields', function()
	{
		assert.strictEqual(1, Version.CURRENT.major);
		assert.strictEqual(0, Version.CURRENT.minor);
		assert.strictEqual(2, Version.CURRENT.patch);
	});
});
describe('valid version-object determination', function()
{
	const is_valid = Version.is_valid;

	it('should indicate missing fields are invalid', function()
	{
		assert(!is_valid({minor: 1, patch: 1}));  // missing 'major'
		assert(!is_valid({major: 1, patch: 1}));  // missing 'minor'
		assert(!is_valid({major: 1, minor: 1}));  // missing 'patch'
	});
	it('should indicate non-integers are invalid', function()
	{
		assert(!is_valid({major: 1.1, minor: 1, patch: 1}));
		assert(!is_valid({major: 1, minor: 1.1, patch: 1}));
		assert(!is_valid({major: 1, minor: 1, patch: 1.1}));
	});
	it('should indicate negative values are invalid', function()
	{
		assert(!is_valid({major: -1, minor: 1, patch: 1}));
		assert(!is_valid({major: 1, minor: -1, patch: 1}));
		assert(!is_valid({major: 1, minor: 1, patch: -1}));
	});
	it('should validate positive, non-negative integers', function()
	{
		assert(is_valid({major: 0, minor: 0, patch: 0}));
		assert(is_valid({major: 0, minor: 0, patch: 1}));
		assert(is_valid({major: 0, minor: 1, patch: 0}));
		assert(is_valid({major: 1, minor: 0, patch: 0}));
	});
});
describe('comparison between versions', function()
{
	const compare = Version.compare;

	const
		v1_0_0 = {major: 1, minor: 0, patch: 0},
		v0_1_0 = {major: 0, minor: 1, patch: 0},
		v0_0_1 = {major: 0, minor: 0, patch: 1};

	it('should compare in order: (1) major, (2) minor, (3) patch', function()
	{
		assert.strictEqual(Ordering.Equal, compare(v1_0_0, v1_0_0));
		assert.strictEqual(Ordering.Greater, compare(v1_0_0, v0_1_0));
		assert.strictEqual(Ordering.Greater, compare(v1_0_0, v0_0_1));

		assert.strictEqual(Ordering.Equal, compare(v0_1_0, v0_1_0));
		assert.strictEqual(Ordering.Less, compare(v0_1_0, v1_0_0));
		assert.strictEqual(Ordering.Greater, compare(v0_1_0, v0_0_1));

		assert.strictEqual(Ordering.Equal, compare(v0_0_1, v0_0_1));
		assert.strictEqual(Ordering.Less, compare(v0_0_1, v1_0_0));
		assert.strictEqual(Ordering.Less, compare(v0_0_1, v0_1_0));
	});
});
