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
    localStorage.removeItem('user');
    checkAuth();
    window.location.href = '/login';
});

// 联系表单提交
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // 发送表单数据到后端
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('留言已发送成功！');
                document.getElementById('contactForm').reset();
            } else {
                alert('发送失败：' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('发送失败，请稍后重试');
        });
});

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
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
    }

    // 表单验证
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                alert('请填写所有必填字段');
                return;
            }

            if (!isValidEmail(email)) {
                alert('请输入有效的电子邮件地址');
                return;
            }

            // 这里可以添加发送表单数据的代码
            alert('消息已发送！');
            contactForm.reset();
        });
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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