import { series } from "./series";
import { navbar } from "./navbar";

export const themeConfig = {
  locales: {
    '/': {
      selectLanguageText: '选择语言',
      selectLanguageName: '简体中文',
      lastUpdatedText: '最后更新时间',
      series,
      navbar,
    },
  },
  style: "@vuepress-reco/style-default",
  author: '谷雨',
  logo: "/logo.png",
  docsBranch: "main",
  docsDir: '/docs',
  docsRepo: 'https://github.com/Lruler/guyu.inn.git',
  algolia: {
    appId: 'HRQZBOY0RP',
    apiKey: '105cb0ff327e4d9f7d46a33c8315ae03',
    indexName: 'guyu-inn',
    debug: false // Set debug to true if you want to inspect the dropdown
  },
};
