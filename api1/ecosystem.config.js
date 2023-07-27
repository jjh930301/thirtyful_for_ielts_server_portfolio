module.exports = [
  {
    script: 'dist/main.js',
    name: 'api1',
    exec_mode: 'cluster',
    instances: 3,
  },
];