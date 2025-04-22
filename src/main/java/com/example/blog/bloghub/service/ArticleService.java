package com.example.blog.bloghub.service;

import com.example.blog.bloghub.entity.Article;
import com.example.blog.bloghub.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ArticleService {
    @Autowired
    private ArticleRepository articleRepository;

    //分页查询并 返回文章列表
    public List<Article> getArticlesByPage(int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        return articleRepository.getArticlesByPage(offset, pageSize);
    }

    //根据文章id查询文章内容
    public String getArticleContentById(int id) {
        return articleRepository.getArticleContentById(id);
    }

    //根据文章id查询标题
    public String getArticleTitleById(int id) {
        return articleRepository.getTitleById(id);
    }

    //根据id得到文章的分类
    public String getArticleCategoryById(int id) {
        return articleRepository.getCategoryById(id);
    }

    //根据文章id查询文章标签
    public String getArticleTagsById(int id) {
        return articleRepository.getTagsById(id);
    }

    //根据文章id查询文章浏览量
    public int getArticleViewCountById(int id) {
        return articleRepository.getViewCountById(id);
    }

    //查询总文章数
    public int getTotalArticles() {
        return articleRepository.getTotalArticles();
    }

    //保存文章
    public void saveArticle(String title, String content, int authorId, String category, String tags,int viewCount, Timestamp createdAt, Timestamp updatedAt) {
        articleRepository.saveArticle(title, content, authorId, category, tags, viewCount, createdAt, updatedAt);
    }



}
