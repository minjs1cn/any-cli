module.exports = function(api) {
  if (api) {
    api.cache.never();
  }

  const useESModules = process.env.MODULE_ENV !== 'commonjs'

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: useESModules ? false : 'commonjs',
          useBuiltIns: 'usage',
          corejs: '3'
        }
      ],
      '@babel/preset-typescript'
    ],
    plugins: [
      '@vue/babel-plugin-jsx',
      '@babel/plugin-syntax-import-meta',
      [
        require('@babel/plugin-transform-typescript'),
        { isTSX: true, allowExtensions: true }
      ]
    ],
  };
};

