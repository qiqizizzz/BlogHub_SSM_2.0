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

    // 更新评论头像
    document.getElementById('commentUserAvatar').src = '/img/userImg.PNG';

    return true;
} else {
    // 显示登录注册按钮
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('registerBtn').style.display = 'block';

    // 隐藏用户菜单
    document.querySelector('.user-menu').style.display = 'none';

    // 设置默认评论头像
    document.getElementById('commentUserAvatar').src = '/img/default-avatar.png';

    return false;
}
}

    // 处理点赞
    function handleLike(button) {
    if (!checkAuth()) {
    window.location.href = '/login';
    return;
}

    button.classList.toggle('active');
    if (button.classList.contains('active')) {
    button.innerHTML = '<i class="fas fa-heart"></i> 已点赞';
} else {
    button.innerHTML = '<i class="far fa-heart"></i> 点赞';
}
}

    // 处理收藏
    function handleFavorite(button) {
    if (!checkAuth()) {
    window.location.href = '/login';
    return;
}

    button.classList.toggle('active');
    if (button.classList.contains('active')) {
    button.innerHTML = '<i class="fas fa-bookmark"></i> 已收藏';
} else {
    button.innerHTML = '<i class="far fa-bookmark"></i> 收藏';
}
}

    // 处理分享
    function handleShare(button) {
    // 这里可以实现分享功能，例如复制链接到剪贴板
    alert('分享链接已复制到剪贴板');
}

    // 评论点赞
    function likeComment(button) {
    if (!checkAuth()) {
    window.location.href = '/login';
    return;
}

    button.classList.toggle('active');
    const icon = button.querySelector('i');
    const count = parseInt(button.textContent.trim());

    if (button.classList.contains('active')) {
    icon.classList.remove('far');
    icon.classList.add('fas');
    button.innerHTML = `<i class="fas fa-heart"></i> ${count + 1}`;
} else {
    icon.classList.remove('fas');
    icon.classList.add('far');
    button.innerHTML = `<i class="far fa-heart"></i> ${count - 1}`;
}
}

    // 回复评论
    function replyToComment(button) {
    if (!checkAuth()) {
    window.location.href = '/login';
    return;
}

    const commentItem = button.closest('.comment-item');
    const commentAuthor = commentItem.querySelector('.comment-author').textContent;
    const commentInput = document.getElementById('commentInput');

    commentInput.value = `@${commentAuthor} `;
    commentInput.focus();
}

    // 提交评论
    function submitComment() {
    if (!checkAuth()) {
    window.location.href = '/login';
    return;
}

    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();

    if (commentText === '') {
    alert('请输入评论内容');
    return;
}

    // 这里应该调用后端API提交评论
    console.log('提交评论:', commentText);

    // 模拟添加评论到页面
    const commentsList = document.querySelector('.comments-list');
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    newComment.innerHTML = `
            <div class="comment-avatar">
                <img src="/img/userImg.PNG" alt="用户头像">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${name}</span>
                    <span class="comment-date">刚刚</span>
                </div>
                <div class="comment-text">
                    <p>${commentText}</p>
                </div>
                <div class="comment-actions">
                    <button class="comment-action" onclick="likeComment(this)"><i class="far fa-heart"></i> 0</button>
                    <button class="comment-action" onclick="replyToComment(this)"><i class="far fa-comment"></i> 回复</button>
                </div>
            </div>
        `;

    commentsList.insertBefore(newComment, commentsList.firstChild);
    commentInput.value = '';

    // 更新评论数量
    const commentsTitle = document.querySelector('.comments-title');
    const countMatch = commentsTitle.textContent.match(/\((\d+)\)/);
    if (countMatch) {
    const count = parseInt(countMatch[1]) + 1;
    commentsTitle.textContent = `评论区 (${count})`;
}
}

    // 用户菜单下拉框控制
    document.addEventListener('DOMContentLoaded', function() {
    checkAuth();

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

    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    checkAuth();
    window.location.href = '/login';
});
});



// 收藏文章
async function toggleBookmark() {
    try {
        const response = await fetch(`/api/articles/${getArticleId()}/bookmark`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const result = await response.json();
            updateBookmarkButton(result.isBookmarked);
        } else {
            throw new Error('收藏操作失败');
        }
    } catch (error) {
        console.error('收藏文章时出错:', error);
        alert('收藏操作失败，请稍后重试');
    }
}

// 分享文章
function shareArticle() {
    const url = window.location.href;
    const title = document.querySelector('.article-title').textContent;

    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(error => {
            console.error('分享失败:', error);
            fallbackShare(url, title);
        });
    } else {
        fallbackShare(url, title);
    }
}

// 备用分享方法
function fallbackShare(url, title) {
    const shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank');
}

// 将评论添加到DOM
function addCommentToDOM(comment) {
    const commentsList = document.querySelector('.comments-list');
    const commentElement = createCommentElement(comment);
    commentsList.insertBefore(commentElement, commentsList.firstChild);
}

// 将回复添加到DOM
function addReplyToDOM(commentId, reply) {
    const repliesList = document.querySelector(`#replies-${commentId}`);
    const replyElement = createReplyElement(reply);
    repliesList.appendChild(replyElement);
}

// 创建评论元素
function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.id = `comment-${comment.id}`;

    div.innerHTML = `
        <div class="comment-avatar">
            <img src="${comment.user.avatar || '/images/default-avatar.png'}" alt="${comment.user.username}">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-author">${comment.user.username}</span>
                <span class="comment-date">${formatDate(comment.createdAt)}</span>
            </div>
            <div class="comment-text">${comment.content}</div>
            <div class="comment-actions">
                <button class="comment-action" onclick="likeComment(${comment.id})">
                    <i class="fas fa-heart"></i>
                    <span class="like-count">${comment.likes}</span>
                </button>
                <button class="comment-action" onclick="showReplyForm(${comment.id})">
                    <i class="fas fa-reply"></i>
                    回复
                </button>
            </div>
            <div class="replies-list" id="replies-${comment.id}"></div>
        </div>
    `;

    return div;
}

// 创建回复元素
function createReplyElement(reply) {
    const div = document.createElement('div');
    div.className = 'reply-item';
    div.id = `reply-${reply.id}`;

    div.innerHTML = `
        <div class="comment-avatar">
            <img src="${reply.user.avatar || '/images/default-avatar.png'}" alt="${reply.user.username}">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-author">${reply.user.username}</span>
                <span class="comment-date">${formatDate(reply.createdAt)}</span>
            </div>
            <div class="comment-text">${reply.content}</div>
            <div class="comment-actions">
                <button class="comment-action" onclick="likeComment(${reply.id})">
                    <i class="fas fa-heart"></i>
                    <span class="like-count">${reply.likes}</span>
                </button>
            </div>
        </div>
    `;

    return div;
}

// 显示回复表单
function showReplyForm(commentId) {
    const repliesList = document.querySelector(`#replies-${commentId}`);
    const existingForm = document.querySelector(`#replyForm-${commentId}`);

    if (existingForm) {
        existingForm.remove();
        return;
    }

    const form = document.createElement('div');
    form.className = 'reply-form';
    form.id = `replyForm-${commentId}`;

    form.innerHTML = `
        <div class="comment-input-container">
            <textarea id="replyInput-${commentId}" placeholder="写下你的回复..."></textarea>
            <div class="comment-form-actions">
                <button class="btn btn-primary" onclick="replyToComment(${commentId})">回复</button>
            </div>
        </div>
    `;

    repliesList.appendChild(form);
}

// 更新点赞数
function updateLikeCount(commentId, likes) {
    const likeCount = document.querySelector(`#comment-${commentId} .like-count`);
    if (likeCount) {
        likeCount.textContent = likes;
    }
}

// 切换点赞按钮状态
function toggleLikeButton(commentId) {
    const button = document.querySelector(`#comment-${commentId} .comment-action`);
    button.classList.toggle('active');
}

// 更新收藏按钮状态
function updateBookmarkButton(isBookmarked) {
    const button = document.querySelector('.bookmark-btn');
    button.classList.toggle('active', isBookmarked);
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 获取文章ID
function getArticleId() {
    const path = window.location.pathname;
    return path.split('/').pop();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // 绑定评论提交事件
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', submitComment);
    }

    // 绑定收藏按钮事件
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', toggleBookmark);
    }

    // 绑定分享按钮事件
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareArticle);
    }
});

