// dashboardData.ts
export const inspirationData = [
  {
    category: "长视频",
    tag: { label: "长视频", color: "bg-blue-100 text-blue-700" },
    count: 3,
    items: [
      { title: "AI 创作工具深度评测", time: "今天", likes: 0, comments: 0 },
      { title: "创作者经济现状分析", time: "昨天", likes: 5, comments: 2 },
      { title: "未来内容创作趋势", time: "3天前", likes: 8, comments: 4 },
    ],
  },
  {
    category: "短视频",
    tag: { label: "短视频", color: "bg-purple-100 text-purple-700" },
    count: 4,
    items: [
      { title: "60秒学会 Prompt 技巧", time: "2天前", likes: 12, comments: 3 },
      { title: "高效内容创作流程", time: "3天前", likes: 15, comments: 7 },
      { title: "创作灵感来源分享", time: "5天前", likes: 20, comments: 9 },
      { title: "快速剪辑技巧", time: "1周前", likes: 18, comments: 6 },
    ],
  },
  {
    category: "博客",
    tag: { label: "博客", color: "bg-green-100 text-green-700" },
    count: 3,
    items: [
      { title: "创作者经济的未来趋势", time: "1周前", likes: 8, comments: 5 },
      { title: "内容创作工具推荐", time: "1周前", likes: 20, comments: 12 },
      { title: "写作技巧分享", time: "2周前", likes: 15, comments: 8 },
    ],
  },
  {
    category: "推文灵感",
    tag: { label: "推文", color: "bg-blue-100 text-blue-700" },
    count: 2,
    items: [
      {
        title: "刚发现一个超棒的AI工具，能帮创作者节省80%的时间！分享给大家 ✨",
        time: "",
        isTweet: true,
        status: "建议发布"
      },
      {
        title: "今天的创作心得：灵感来源于生活的每一个细节 💡 #创作者日常",
        time: "",
        isTweet: true,
        status: "待优化"
      }
    ]
  }
];

export const wipData = [
  {
    category: "视频制作",
    tag: { label: "视频制作", color: "bg-red-100 text-red-700" },
    count: 2,
    items: [
      { title: "Creator OS 产品介绍", progress: 65, deadline: "明天截止" },
      { title: "创作者访谈系列", progress: 25, deadline: "下周一" },
    ],
  },
  {
    category: "文章写作",
    tag: { label: "文章写作", color: "bg-yellow-100 text-yellow-700" },
    count: 2,
    items: [
      { title: "内容创作最佳实践", progress: 40, deadline: "本周五" },
      { title: "AI工具使用指南", progress: 80, deadline: "明天" },
    ],
  },
  {
    category: "博文写作",
    tag: { label: "博文写作", color: "bg-pink-100 text-pink-700" },
    count: 1,
    items: [{ title: "品牌视觉升级", progress: 55, deadline: "下周三" }],
  },
  {
    category: "推文写作",
    tag: { label: "推文", color: "bg-blue-100 text-blue-700" },
    count: 2,
    items: [
      { title: "产品发布推文", progress: 75, deadline: "今晚完成" },
      { title: "技术分享推文", progress: 30, deadline: "明天完成" },
    ],
  },
];

export const completedData = [
  {
    category: "发布任务",
    tag: { label: "发布任务", color: "bg-indigo-100 text-indigo-700" },
    count: 2,
    items: [
      { title: "社交媒体发布计划", time: "14:30", stat1: "❤️ 24", stat2: "🔄 8" },
      { title: "YouTube 视频上传", time: "16:15", stat1: "👀 156", stat2: "💬 23" },
    ],
  },
  {
    category: "博文写作",
    tag: { label: "博文写作", color: "bg-teal-100 text-teal-700" },
    count: 1,
    items: [{ title: "品牌视觉设计更新", time: "11:20", stat1: "❤️ 18", stat2: "💬 12" }],
  },
  {
    category: "分析报告",
    tag: { label: "分析报告", color: "bg-orange-100 text-orange-700" },
    count: 2,
    items: [
      { title: "月度数据分析报告", time: "09:45", stat1: "👀 156", stat2: "📥 23" },
      { title: "用户反馈整理", time: "13:30", stat1: "💬 32", stat2: "⭐ 4.8" },
    ],
  },
  {
    category: "推文发布",
    tag: { label: "推文", color: "bg-blue-100 text-blue-700" },
    count: 3,
    items: [
      { title: "创作者工具推荐", time: "12:30" },
      { title: "工作流程分享", time: "15:45" },
    ],
  },
];