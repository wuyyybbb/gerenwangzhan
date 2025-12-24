export default {
  js2svg: {
    pretty: false,
    indent: 0
  },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupNumericValues: {
            floatPrecision: 0
          }
        }
      }
    },
    'removeDimensions',
    'removeMetadata',
    'removeEditorsNSData',
    'removeUselessDefs',
    'cleanupIds'
  ]
};
