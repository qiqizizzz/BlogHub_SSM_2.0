let currentPage = 0;  // 当前页，从0开始
let totalPages = 1;   // 总页数

function fetchArticles(page = 0, size = 20) {
    // 确保请求的页码在有效范围内
    page = Math.max(0, page);

    axios.get(`/people/consoleDash/articles?page=${page}&size=${size}`)
        .then(response => {
            // 后端返回的数据结构通常包含 content, totalPages, number (当前页)等
            const pageData = response.data;
            const articles = pageData.articles; // 获取文章列表
            totalPages = pageData.totalPages;   // 更新总页数
            currentPage = pageData.currentPage; // 更新当前页码 (确保与后端一致)

            const tableBody = document.getElementById('article-list');
            tableBody.innerHTML = ''; // 清空现有表格内容

            if (!articles || articles.length === 0) {
                // 如果没有文章，显示提示信息
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="5" style="text-align: center;">您还没有发布任何文章。</td>`;
                tableBody.appendChild(row);
            } else {
                articles.forEach(article => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${article.id}</td>
                        <td>${article.title}</td>
                        <td>${article.category ? article.category : '未分类'}</td>
                        <td>${article.viewCount}</td>
                        <td><button class="delete-btn" onclick="deleteArticle(${article.id})">删除</button></td>
                    `;
                    tableBody.appendChild(row);
                });
            }
            updatePaginationControls(); // 更新分页控件状态
        })
        .catch(error => {
            console.error('获取文章时出错:', error);
            const tableBody = document.getElementById('article-list');
            tableBody.innerHTML = `<td colspan="5" style="text-align: center;">加载文章失败，请稍后重试。</td>`;
            totalPages = 1;
            currentPage = 0;
            updatePaginationControls(); // 即使出错也要更新分页状态
        });
}

// 更新分页控件的显示和状态
function updatePaginationControls() {
    const pageInfo = document.getElementById('page-info');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const firstButton = document.getElementById('first-page');
    const lastButton = document.getElementById('last-page');

    if (pageInfo) {
        // 页码从0开始，显示时+1
        pageInfo.textContent = `第 ${currentPage + 1} 页 / 共 ${totalPages} 页`;
    }
    if (prevButton) {
        prevButton.disabled = currentPage === 0;
    }
    if (nextButton) {
        nextButton.disabled = currentPage >= totalPages - 1;
    }
    if (firstButton) {
        firstButton.disabled = currentPage === 0;
    }
    if (lastButton) {
        lastButton.disabled = currentPage >= totalPages - 1 || totalPages === 0;
    }

}


// 删除文章
function deleteArticle(id) {
    if (!confirm('确定要删除这篇文章吗？')) {
        return;
    }
    axios.delete(`/people/deleteArticle/${id}`)
        .then(response => {
            alert('文章删除成功');
            // 删除后留在当前页或如果当前页为空则跳转到前一页
            const tableBody = document.getElementById('article-list');
            if(tableBody.rows.length <= 1 && currentPage > 0) { // 如果删除的是当前页最后一条且不是第一页
                fetchArticles(currentPage - 1);
            } else {
                fetchArticles(currentPage); // 刷新当前页文章列表
            }
        })
        .catch(error => {
            console.error('删除文章时出错:', error);
            alert('删除失败，请重试');
        });
}

// 改变页数
function changePage(page) {
    if (page < 0 || page >= totalPages) {
        console.log(`无效的页码请求: ${page}, 总页数: ${totalPages}`);
        return;  // 防止页数越界
    }
    fetchArticles(page);  // 获取并渲染指定页的文章
}


// 调用页面加载时获取第一页文章数据
document.addEventListener('DOMContentLoaded', () => fetchArticles(0));

