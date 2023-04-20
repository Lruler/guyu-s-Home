import { defineUserConfig } from 'vuepress'
import { recoTheme } from 'vuepress-theme-reco'
import { themeConfig } from './theme/config'

export default defineUserConfig({
    title: "谷雨小栈",
    description: "我的一些生活切片",
    head: [
      [
        'link',{ rel: 'icon', href: './logo.png' }
      ]
    ],
  theme: recoTheme(themeConfig),
})