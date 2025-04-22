package com.example.blog.bloghub.repository;

import org.apache.ibatis.annotations.*;
import com.example.blog.bloghub.entity.User;

import java.sql.Timestamp;

@Mapper
public interface UserRepository{
    //通过用户名和密码查询用户
    @Select("SELECT * FROM users WHERE username = #{username} AND password = #{password}")
    @Results(id = "users", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "username", column = "username"),
            @Result(property = "password", column = "password"),
            @Result(property = "email", column = "email"),
            @Result(property = "role", column = "firstName"),
            @Result(property = "created_at", column = "createdAt"),
    })
    User getUserByNameAndPassword(String username, String password);

    //注册新用户
    @Insert("INSERT INTO users (username, password, email, created_at) VALUES (#{username}, #{password}, #{email}, NOW())")
    @Results(id = "users",value = {
            @Result(property = "username", column = "username"),
            @Result(property = "password", column = "password"),
            @Result(property = "email", column = "email"),
            @Result(property = "created_at", column = "createdAt")
    })
    boolean saveUser(String username, String password, String email, Timestamp timestamp);

    // 根据用户名查询用户
    @Select("SELECT username FROM users WHERE username = #{username}")
    @Result(property = "username", column = "username")
    String getByName(String username);


}
