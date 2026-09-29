import DefaultTheme from 'vitepress/theme';
import ReferenceArea from './ReferenceArea.vue';
import AzIndex from './AzIndex.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReferenceArea', ReferenceArea);
    app.component('AzIndex', AzIndex);
  },
};
