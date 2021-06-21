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
      '@babel/preset-typescript',
      '@vue/babel-preset-jsx'
    ],
    plugins: [],
  };
};

