/**
 * 学号姓名展示系统 - 主逻辑文件
 */

// 全局变量
let currentConfig = { ...SYSTEM_CONFIG };
let autoRefreshTimer = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initSystem();
    loadConfig();
    updateDisplay();
    startAutoRefresh();
});

// 初始化系统
function initSystem() {
    console.log('系统初始化...');

    // 设置版本号
    document.getElementById('appVersion').textContent = currentConfig.system.version;

    // 更新时间显示
    updateTime();
    setInterval(updateTime, 1000);
}

// 加载配置
function loadConfig() {
    // 尝试从本地存储加载用户配置
    const savedConfig = localStorage.getItem('studentInfoConfig');
    if (savedConfig) {
        try {
            const userConfig = JSON.parse(savedConfig);
            currentConfig = { ...currentConfig, ...userConfig };
            console.log('从本地存储加载配置成功');
        } catch (error) {
            console.error('配置加载失败:', error);
        }
    }
}

// 保存配置到本地存储
function saveConfigToStorage() {
    try {
        localStorage.setItem('studentInfoConfig', JSON.stringify(currentConfig));
        console.log('配置已保存到本地存储');
        return true;
    } catch (error) {
        console.error('保存配置失败:', error);
        return false;
    }
}

// 更新显示
function updateDisplay() {
    // 更新学生信息
    document.getElementById('studentId').textContent = currentConfig.student.id;
    document.getElementById('studentName').textContent = currentConfig.student.name;
    document.getElementById('studentDepartment').textContent = currentConfig.student.department;
    document.getElementById('enrollmentYear').textContent = currentConfig.student.enrollmentYear;

    // 更新配置面板的值
    document.getElementById('configStudentId').value = currentConfig.student.id;
    document.getElementById('configStudentName').value = currentConfig.student.name;
    document.getElementById('configDepartment').value = currentConfig.student.department;
    document.getElementById('configTheme').value = currentConfig.display.theme;
    document.getElementById('configAutoRefresh').checked = currentConfig.display.autoRefresh;

    // 更新主题
    updateTheme();
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN');
    const dateString = now.toLocaleDateString('zh-CN') + ' ' + timeString;

    document.getElementById('currentTime').textContent = timeString;
    document.getElementById('lastUpdate').textContent = dateString;
}

// 更新主题
function updateTheme() {
    // 移除所有主题类
    document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();

    // 添加当前主题类
    if (currentConfig.display.theme) {
        document.body.classList.add(`theme-${currentConfig.display.theme}`);
    }
}

// 开始自动刷新
function startAutoRefresh() {
    if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
    }

    if (currentConfig.display.autoRefresh) {
        autoRefreshTimer = setInterval(() => {
            updateTime();
            console.log('自动刷新完成');
        }, currentConfig.display.refreshInterval);
    }
}

// 刷新数据
function refreshData() {
    updateTime();
    showMessage('数据已刷新', 'success');
}

// 打开配置面板
function openConfig() {
    document.getElementById('configModal').classList.add('active');
}

// 关闭配置面板
function closeConfig() {
    document.getElementById('configModal').classList.remove('active');
}

// 保存配置
function saveConfig() {
    // 从表单获取新配置
    currentConfig.student.id = document.getElementById('configStudentId').value.trim();
    currentConfig.student.name = document.getElementById('configStudentName').value.trim();
    currentConfig.student.department = document.getElementById('configDepartment').value.trim();
    currentConfig.display.theme = document.getElementById('configTheme').value;
    currentConfig.display.autoRefresh = document.getElementById('configAutoRefresh').checked;

    // 验证输入
    if (!currentConfig.student.id || !currentConfig.student.name) {
        showMessage('学号和姓名不能为空', 'error');
        return;
    }

    // 保存到本地存储
    if (saveConfigToStorage()) {
        // 更新显示
        updateDisplay();

        // 重启自动刷新
        startAutoRefresh();

        // 显示成功消息
        showMessage('配置已保存并应用', 'success');

        // 关闭配置面板
        setTimeout(() => {
            closeConfig();
        }, 1500);
    } else {
        showMessage('保存失败，请检查浏览器设置', 'error');
    }
}

// 导出配置
function exportConfig() {
    const configData = {
        exportTime: new Date().toISOString(),
        ...currentConfig
    };

    const dataStr = JSON.stringify(configData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student-config-${new Date().getTime()}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showMessage('配置已导出为JSON文件', 'success');
}

// 显示消息
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `
        <i class="fas fa-${getMessageIcon(type)}"></i>
        <span>${message}</span>
    `;

    // 样式
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: ${getMessageColor(type).text};
        background: ${getMessageColor(type).bg};
        border: 1px solid ${getMessageColor(type).border};
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(messageEl);

    // 3秒后移除
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}

// 获取消息图标
function getMessageIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

// 获取消息颜色
function getMessageColor(type) {
    const colors = {
        info: { bg: '#e6fffa', border: '#81e6d8', text: '#234e52' },
        success: { bg: '#c6f6d5', border: '#9ae6b4', text: '#22543d' },
        error: { bg: '#fed7d7', border: '#fc8181', text: '#742a2a' },
        warning: { bg: '#feebc8', border: '#fbd38d', text: '#744210' }
    };
    return colors[type] || colors.info;
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 全局导出函数
window.refreshData = refreshData;
window.openConfig = openConfig;
window.closeConfig = closeConfig;
window.saveConfig = saveConfig;
window.exportConfig = exportConfig;