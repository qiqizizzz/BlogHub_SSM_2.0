document.getElementById('registerForm').addEventListener('submit',  async function(event) {
    event.preventDefault(); // 阻止表单默认提交行为

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // 验证密码是否一致
    if (password !== confirmPassword) {
        alert('密码和确认密码不一致，请重新输入！');
        return; // 直接返回，不继续执行
    }

    // 验证通过，可以提交表单
    //向后端发送请求，注册用户
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'username=' + document.getElementById('username').value + '&password=' + password + '&email=' + document.getElementById('email').value
        });

        // 处理响应
        if (response.ok) {
            alert('注册成功，请登录！');
            window.location.href = '/login'; // 修复：添加前导斜杠，确保正确跳转
        } else {
            // 处理错误信息
            const error = await response.text();
            alert(error);
        }
    } catch (error) {
        console.error('注册请求失败:', error);
        alert('注册失败，请稍后重试');
    }
});

