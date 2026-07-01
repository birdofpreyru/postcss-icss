export default {
  presets: [
    ['./config/babel/preset', {
      modules: 'commonjs',
    }],
  ],
  targets: 'maintained node versions',
};
