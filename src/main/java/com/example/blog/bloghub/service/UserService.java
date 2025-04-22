package com.example.blog.bloghub.service;

import com.example.blog.bloghub.entity.User;
import com.example.blog.bloghub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    //验证用户是否存在
    public User validateUser(String username, String password) {
        return userRepository.getUserByNameAndPassword(username, password);
    }

    //判断是否注册成功
    public boolean registerUser(String username, String password, String email, Timestamp timestamp) {
        // 判断用户名是否已存在
        if (userRepository.getByName(username)!= null) {
            return false;
        }
        return userRepository.saveUser(username, password, email, timestamp);
    }
}
