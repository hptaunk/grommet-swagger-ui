import path from 'path';

export default {
  dist: path.resolve(__dirname, 'dist'),
  copyAssets: [
    'README.md',
    'package.json',
    {
      asset: 'src/js/**',
      babel: true
    },
    {
      asset: 'src/scss/**',
      dist: 'dist/scss/'
    }
  ],
  scssAssets: ['src/scss/**/*.scss'],
  jsAssets: [
    'src/js/**/*.js'
  ],
  mainJs: 'src/js/index.js',
  mainScss: 'src/scss/grommetreact-swagger-ui/index.scss',
  webpack: {
    output: {
      filename: 'grommetreact-swagger-ui.min.js',
      libraryTarget: 'var',
      library: 'GrommetReactSwaggerUI'
    },
    resolve: {
      modulesDirectories: ['node_modules', 'src/js', 'src/scss']
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'grommet': 'grommet'
    }
  },
  distPreprocess: ['dist-css']
};
