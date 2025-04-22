// 初始化Markdown编辑器
const easyMDE = new EasyMDE({
    element: document.getElementById('postContent'),
    spellChecker: false,
    autosave: {
        enabled: true,
        uniqueId: "postContent",
        delay: 1000,
    },
});

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

// 分页功能
let currentPage = 1;
const pageSize = 5;

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
    fetch(`/api/articles?page=${currentPage}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
        .then(data => {
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
                                <div class="post-tags">
                                    ${generateTags(article.tags)}
                                </div>
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
            console.error('加载文章失败:', error);
            const articleList = document.getElementById('articleList');
            articleList.innerHTML = '<div class="error-message">加载文章失败，请刷新页面重试</div>';
        });
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 截断文本
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// 生成标签HTML
function generateTags(tagsString) {
    if (!tagsString) return '';
    const tags = tagsString.split(',');
    return tags.map(tag => `<span class="tag">${tag.trim()}</span>`).join('');
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
    const totalPages = parseInt(document.querySelector('.page-number:last-child').getAttribute('data-page'));
    if (currentPage < totalPages) {
        currentPage++;
        loadArticles();
    }
});

// 文章发布表单提交
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const article = {
        title: document.getElementById('postTitle').value,
        content: easyMDE.value(),
        category: document.getElementById('postCategory').value,
        tags: document.getElementById('postTags').value.split(',').map(tag => tag.trim()),
        isTop: document.getElementById('postTop').checked
    };

    fetch('/api/article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(article)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('文章发布成功');
                document.getElementById('editorModal').style.display = 'none';
                loadArticles(); // 重新加载文章列表
            } else {
                alert('文章发布失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('文章发布失败，请重试');
        });
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadArticles();
});

// 搜索功能
document.querySelector('.search-input').addEventListener('input', function() {
    const searchTerm = this.value.trim();
    if (searchTerm.length > 2) {
        // 这里应该调用后端API进行搜索
        console.log('搜索:', searchTerm);
    }
});

// 搜索按钮点击事件
document.querySelector('.search-button').addEventListener('click', function() {
    const searchTerm = document.querySelector('.search-input').value.trim();
    if (searchTerm.length > 0) {
        // 这里应该调用后端API进行搜索
        console.log('搜索:', searchTerm);
    }
});

// 搜索框回车事件
document.querySelector('.search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const searchTerm = this.value.trim();
        if (searchTerm.length > 0) {
            // 这里应该调用后端API进行搜索
            console.log('搜索:', searchTerm);
        }
    }
});
