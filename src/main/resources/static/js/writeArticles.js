document.addEventListener('DOMContentLoaded', function () {
    // 初始化 EasyMDE 编辑器
    const easyMDE = new EasyMDE({
        element: document.getElementById("editor"),
        spellChecker: false,
        placeholder: "请输入文章内容，支持 Markdown 格式...",
        autosave: {
            enabled: true,
            uniqueId: "articleContent",
            delay: 1000,
        },
        renderingConfig: {
            codeSyntaxHighlighting: true,
        }
    });

    // 表单提交事件处理
    document.getElementById("articleForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const category = document.getElementById("category").value;
        const tags = document.getElementById("tags").value.trim();
        const content = easyMDE.value();  // 使用 EasyMDE 获取编辑器内容

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('tags', tags);
        formData.append('content', content);

        if (!title || !content || !category) {
            alert("请填写完整的标题、分类和内容！");
            return;
        }

        axios.post("/api/articles", formData, {
        }).then(res => {
            alert("发布成功！");
            window.location.href = "/api";
        }).catch(err => {
            console.error(err);
            alert("发布失败，请重试！");
        });
    });
});

