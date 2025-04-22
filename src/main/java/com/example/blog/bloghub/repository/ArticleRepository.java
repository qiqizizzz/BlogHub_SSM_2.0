package com.example.blog.bloghub.repository;

import com.example.blog.bloghub.entity.Article;
import org.apache.ibatis.annotations.*;

import java.sql.Timestamp;
import java.util.List;

@Mapper
public interface ArticleRepository{
    //分页查询
    @Select("SELECT * FROM articles ORDER BY created_at DESC LIMIT #{offset}, #{pageSize}")
    @Results(id = "articleMap", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "title", column = "title"),
            @Result(property = "content", column = "content"),
            @Result(property = "authorId", column = "author_id"),
            @Result(property = "category", column = "category"),
            @Result(property = "tags", column = "tags"),
            @Result(property = "viewCount", column = "view_count"),
            @Result(property = "createdAt", column = "created_at"),
            @Result(property = "updatedAt", column = "updated_at")
    })
    List<Article> getArticlesByPage(@Param("offset") int offset, @Param("pageSize") int pageSize);

    //查询总数
    @Select("SELECT COUNT(*) FROM articles")
    int getTotalArticles();

    //保存文章
    @Insert("INSERT INTO articles (title, content, author_id, category, tags, view_count, created_at, updated_at) " +
            "VALUES (#{title}, #{content}, #{authorId}, #{category}, #{tags}, #{viewCount}, NOW(), NOW())")
    @Results(id = "articles",value = {
            @Result(property = "title", column = "title"),
            @Result(property = "content", column = "content"),
            @Result(property = "authorId", column = "author_id"),
            @Result(property = "category", column = "category"),
            @Result(property = "tags", column = "tags"),
            @Result(property = "viewCount", column = "view_count"),
            @Result(property = "createdAt", column = "created_at"),
            @Result(property = "updatedAt", column = "updated_at")
    })
    void saveArticle(String title, String content, int authorId, String category, String tags, int viewCount, Timestamp createdAt, Timestamp updatedAt);

    //根据文章id查询标题
    @Select("SELECT title FROM articles where id=#{id}")
    String getTitleById(int id);

    //根据文章id查询文章内容
    @Select("SELECT content FROM articles where id=#{id}")
    String getArticleContentById(int id);

    //根据文章id查询分类
    @Select("SELECT category FROM articles where id=#{id}")
    String getCategoryById(int id);

    //根据文章id查询标签
    @Select("SELECT tags FROM articles where id=#{id}")
    String getTagsById(int id);

    //根据文章id查询文章浏览量
    @Select("SELECT view_count FROM articles where id=#{id}")
    int getViewCountById(int id);
}