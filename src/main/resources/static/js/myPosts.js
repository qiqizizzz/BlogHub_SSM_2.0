// 处理点赞
function handleLike(button) {
    if (!checkAuth()) {
        window.location.href = '/login';
        return;
    }

    button.classList.toggle('active');
    button.innerHTML = button.classList.contains('active')
        ? '<i class="fas fa-heart"></i> 已点赞'
        : '<i class="far fa-heart"></i> 点赞';
}

// 处理收藏
function handleFavorite(button) {
    if (!checkAuth()) {
        window.location.href = '/login';
        return;
    }

    button.classList.toggle('active');
    button.innerHTML = button.classList.contains('active')
        ? '<i class="fas fa-bookmark"></i> 已收藏'
        : '<i class="far fa-bookmark"></i> 收藏';
}

// 截断文本
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// 分页功能
let currentPage = 1;
let totalPages = 1; // 用来缓存页码
let pageSize = 5; // 每页显示的文章数

// 文章列表每页显示的文章数
function updatePagination(totalPages) {
    const pageNumbers = document.getElementById('pageNumbers');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    // 更新页码显示
    let pageHtml = '';
    const maxVisiblePages = 5; // 最多显示5个页码
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 添加第一页和省略号
    if (startPage > 1) {
        pageHtml += `<span class="page-number" data-page="1">1</span>`;
        if (startPage > 2) {
            pageHtml += `<span class="page-ellipsis">...</span>`;
        }
    }

    // 添加页码
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            pageHtml += `<span class="page-number active">${i}</span>`;
        } else {
            pageHtml += `<span class="page-number" data-page="${i}">${i}</span>`;
        }
    }

    // 添加最后一页和省略号
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageHtml += `<span class="page-ellipsis">...</span>`;
        }
        pageHtml += `<span class="page-number" data-page="${totalPages}">${totalPages}</span>`;
    }

    pageNumbers.innerHTML = pageHtml;

    // 更新按钮状态
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    // 添加页码点击事件
    document.querySelectorAll('.page-number').forEach(page => {
        page.addEventListener('click', () => {
            const newPage = parseInt(page.getAttribute('data-page'));
            if (newPage !== currentPage) {
                currentPage = newPage;
                loadArticles();
            }
        });
    });
}

// 加载文章列表
function loadArticles() {
    const url = `/people/myPosts/articles?page=${currentPage}&size=${pageSize}`;
    console.log('请求URL:', url); // 调试日志

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin' // 确保发送cookies和session信息
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('接收到的数据:', data);

            if (!data.success) {
                throw new Error(data.message || '加载失败');
            }

            const articleList = document.getElementById('articleList');
            let html = '';

            if (data.articles && data.articles.length > 0) {
                data.articles.forEach(article => {
                    html += `
                    <article class="post-card" onclick="window.location.href='/api/articles/${article.id}'">
                        <img src="/img/airticle${article.id % 10}.jpg" alt="文章配图">
                        <div class="post-content">
                            <h2 class="post-title">${article.title}</h2>
                            <div class="post-meta">
                                <span><i class="far fa-calendar"></i> ${formatDate(article.createdAt)}</span>
                                <span><i class="far fa-eye"></i> ${article.viewCount}</span>
                                <span><i class="far fa-comment"></i> 0</span>
                                <span><i class="far fa-heart"></i> 0</span>
                                <span><i class="far fa-bookmark"></i> 0</span>
                            </div>
                            <p class="post-excerpt">${truncateText(article.content, 100)}</p>
                            <div class="post-tags">${generateTags(article.tags)}</div>
                        </div>
                        <div class="post-actions">
                            <button class="btn btn-primary" onclick="event.stopPropagation(); handleLike(this)">
                                <i class="far fa-heart"></i> 点赞
                            </button>
                            <button class="btn btn-success" onclick="event.stopPropagation(); handleFavorite(this)">
                                <i class="far fa-bookmark"></i> 收藏
                            </button>
                        </div>
                    </article>
                `;
                });
            } else {
                html = '<div class="no-articles">暂无文章</div>';
            }

            articleList.innerHTML = html;
            updatePagination(data.totalPages);
        })
        .catch(error => {
            console.error('请求失败:', error);
            const articleList = document.getElementById('articleList');
            articleList.innerHTML = `
            <div class="error-message">
                加载失败：${error.message}<br>
                请检查网络连接或重新登录
            </div>`;
        });
}

// 工具函数
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 生成标签
function generateTags(tagsString) {
    if (!tagsString) return '';
    return tagsString.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('');
}

// 上一页
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadArticles();
    }
});

// 下一页
document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadArticles();
    }
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    try {
        console.log('页面初始化开始');
        if (typeof checkAuth === 'function') {
            checkAuth();
        } else {
            console.warn('checkAuth 函数未定义');
        }
        loadArticles();
    } catch (error) {
        console.error('初始化失败:', error);
    }
});
