import { series } from "./series";
import { navbar } from "./navbar";

export const themeConfig = {
  style: "@vuepress-reco/style-default",
  logo: "/logo.png",
  author: '谷雨',
  lastUpdatedText: '最后更新时间',
  docsBranch: "main",
  docsDir: '/docs',
  series,
  navbar,
  docsRepo: 'https://github.com/vuepress-reco/vuepress-theme-reco',
  bulletin: {
    body: [
      {
        type: "text",
        content: `🎉🎉🎉 reco 主题 2.x 已经接近 Beta 版本，在发布 Latest 版本之前不会再有大的更新，大家可以尽情尝鲜了，并且希望大家在 QQ 群和 GitHub 踊跃反馈使用体验，我会在第一时间响应。`,
        style: "font-size: 12px;",
      },
      {
        type: "hr",
      },
      {
        type: "title",
        content: "QQ 群",
      },
      {
        type: "text",
        content: `
        <ul>
          <li>QQ群1：1037296104</li>
          <li>QQ群2：1061561395</li>
          <li>QQ群3：962687802</li>
        </ul>`,
        style: "font-size: 12px;",
      },
      {
        type: "hr",
      },
      {
        type: "title",
        content: "GitHub",
      },
      {
        type: "text",
        content: `
        <ul>
          <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/issues">Issues<a/></li>
          <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1">Discussions<a/></li>
        </ul>`,
        style: "font-size: 12px;",
      },
      {
        type: "hr",
      },
      {
        type: "buttongroup",
        children: [
          {
            text: "打赏",
            link: "/docs/others/donate.html",
          },
        ],
      },
    ],
  },
  algolia: {
    appId: '38R2J3MTQC',
    apiKey: '583d3caf699630b08a9bc2d12d599701',
    indexName: 'v2-vuepress-reco-recoluan',
    // inputSelector: '### REPLACE ME ####',
    // algoliaOptions: { 'facetFilters': ["lang:$LANG"] },
    // debug: false // Set debug to true if you want to inspect the dropdown
  },
};
