import path from 'path';
import vue from '@vitejs/plugin-vue';
import md from './plugin/md';
import docs from './plugin/docs';
import vueJsx from '@vitejs/plugin-vue-jsx';

/**
 * @type {import('vite').UserConfig}
 */
export default {
  resolve: {
    alias: {
      // moment: 'moment/dist/moment.js',
      vue: 'vue/dist/vue.esm-bundler.js',
      'ant-design-vue': path.resolve(__dirname, './components'),
    },
  },
  plugins: [
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
      mergeProps: false,
      enableObjectSlots: false,
    }),
    docs(),
    md(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
  ],
  optimizeDeps: {
    include: [
      'fetch-jsonp',
      '@ant-design/icons-vue',
      'lodash-es',
      'vue',
      'vue-router',
      'moment',
      'async-validator',
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
};