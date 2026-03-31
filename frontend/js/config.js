/**
 * 系统配置文件
 * 修改这里的参数来调整系统行为
 */

// 系统配置对象
const SYSTEM_CONFIG = {
    // 学生信息
    student: {
        id: "423830219",      // 学号
        name: "刘梓威",       // 姓名
        department: "人工智能学院",  // 学院
        enrollmentYear: "2023"  // 入学年份
    },

    // 显示设置
    display: {
        theme: "blue",        // 主题颜色: blue/green/purple/dark
        autoRefresh: true,    // 是否自动刷新
        refreshInterval: 5000, // 刷新间隔(毫秒)
        showTime: true        // 是否显示时间
    },

    // 系统信息
    system: {
        version: "1.0.0",
        author: "你的名字",
        lastUpdate: "2026-03-31"
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SYSTEM_CONFIG;
}