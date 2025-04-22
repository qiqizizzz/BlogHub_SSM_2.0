// 用户认证相关
let name = localStorage.getItem('username');
let pwd = localStorage.getItem('password');

// 检查用户登录状态
function checkAuth() {
    if (name && pwd) {
        // 隐藏登录注册按钮
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('registerBtn').style.display = 'none';

        // 显示用户菜单
        const userMenu = document.querySelector('.user-menu');
        userMenu.style.display = 'flex';

        // 更新导航栏用户信息
        document.getElementById('navUserName').textContent = name;

        return true;
    } else {
        // 显示登录注册按钮
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('registerBtn').style.display = 'block';

        // 隐藏用户菜单
        document.querySelector('.user-menu').style.display = 'none';

        return false;
    }
}

// 退出登录
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
});

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    // 用户菜单下拉功能
    const userMenu = document.querySelector('.user-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdownArrow = document.querySelector('.dropdown-arrow');

    if (userMenu) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            dropdownArrow.classList.toggle('active');
        });

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
            dropdownArrow.classList.remove('active');
        });

        // 点击下拉菜单内部不关闭
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 检查用户登录状态
    checkAuth();

    // 从后端获取用户信息
    if (token) {
        fetch('/api/user/info', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    currentUser = data.data;
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    checkAuth(); // 重新检查并更新显示
                }
            })
            .catch(error => {
                console.error('获取用户信息失败:', error);
            });
    }
});

// 用户菜单下拉框控制
document.addEventListener('DOMContentLoaded', function() {
    const userMenu = document.querySelector('.user-menu');
    const dropdownMenu = userMenu.querySelector('.dropdown-menu');
    const userInfo = userMenu.querySelector('.user-info');
    const dropdownArrow = userMenu.querySelector('.dropdown-arrow');

    // 点击用户信息区域显示/隐藏下拉菜单
    userInfo.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
        dropdownArrow.classList.toggle('active');
    });

    // 点击下拉菜单内部不关闭
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 点击页面其他地方关闭下拉菜单
    document.addEventListener('click', function() {
        dropdownMenu.classList.remove('show');
        dropdownArrow.classList.remove('active');
    });
});