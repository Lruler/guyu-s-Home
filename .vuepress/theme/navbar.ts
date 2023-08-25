export const navbar = [
    { text: "主页", link: "/" },
    { text: "前端", link: "/docs/fe/html" },
    { text: "后端", link: "/docs/be/database" },
    { text: "运维", link: "/docs/ops/devops" },
    { text: "算法", link: "/docs/algorithm/base" },
    { text: "人工智能", link: "/docs/ai/ai" },
    {
        text: "我的江湖",
        children: [
        { text: "github", link: "https://github.com/Lruler" },
        { text: "茶馆", link: "http://forum.muxixyz.com/" },
        { text: "bilibili", link: "https://space.bilibili.com/628418245?spm_id_from=333.1007.0.0" },
        ],
    }
]