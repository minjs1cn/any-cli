'use strict';

const assert = require('assert')
const { reName, revokeName } = require('../lib')

describe('@any/file-hash', () => {
    
	it('reName revokeName', () => {
		try {
            reName('examples/a.js', 8)
        } catch (error) {
            revokeName('examples/a.3b3b3fe2.js', 8)
        }
	})
})
