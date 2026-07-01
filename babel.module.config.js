export default {
  presets: [
    ['./config/babel/preset', {
      modules: false,
    }],
  ],
  targets: 'maintained node versions',
};
