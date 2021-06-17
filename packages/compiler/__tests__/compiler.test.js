'use strict';

const { compileJs } = require('../lib');

describe('@any/compiler', () => {
    it('compileJs', () => {
        compileJs('examples/a.ts')
    });
});
