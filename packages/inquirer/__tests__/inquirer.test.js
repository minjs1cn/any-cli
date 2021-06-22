'use strict';

const assert = require('assert')
const { getPages } = require('../lib')

describe('@any/inquirer', () => {
    
	it('getPages', () => {
		const pages = getPages('examples', 'index.js')
		assert.strictEqual(pages.length, 2)
	})
})
