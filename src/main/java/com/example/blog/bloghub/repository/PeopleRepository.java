package com.example.blog.bloghub.repository;

import com.example.blog.bloghub.entity.Article;
import org.apache.ibatis.annotations.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Mapper
public interface PeopleRepository {
    @Select("SELECT password FROM users WHERE username = #{username}")
    @Result(property = "password", column = "password")
    String SearchOldPasswordByName(String username);

    @Update("UPDATE users SET email = #{email}, password = #{newPassword} WHERE username = #{username}")
    @Results(id="users",value = {
            @Result(property = "username", column = "username"),
            @Result(property = "email", column = "email"),
            @Result(property = "password", column = "password")
    })
    void updateProfile(String email,  String newPassword, String username);

    @Select("SELECT * FROM articles")
    @Results(id = "articles", value = {
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
    List<Article> findAllArticles();

    @Delete("DELETE FROM articles WHERE id = #{id}")
    @Result(property = "id", column = "id")
    void deleteById(int id);

    @Select("SELECT * FROM articles WHERE author_id = #{id} ORDER BY created_at DESC LIMIT #{offset}, #{size}")
    @Results(id = "myArticles", value = {
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
    List<Article> findMyPosts(@Param("id") Integer id,
                              @Param("offset") int offset,
                              @Param("size") int size);

    @Select("SELECT COUNT(*) FROM articles WHERE author_id = #{id}")
    int countMyPosts(Integer id);
}
