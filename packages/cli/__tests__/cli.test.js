'use strict';
const { getConfig } = require('../lib')

describe('@any/cli', () => {
    it('compileJs', () => {
        const config = getConfig()
        console.log(config)
    });
});
