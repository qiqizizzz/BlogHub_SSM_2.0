package com.example.blog.bloghub.service;

import com.example.blog.bloghub.entity.Article;
import com.example.blog.bloghub.repository.PeopleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PeopleService {
    @Autowired
    private PeopleRepository peopleRepository;

    //获取旧密码
    public String getOldPassword(String username) {
        return peopleRepository.SearchOldPasswordByName(username);
    }

    //更新个人信息
    public void updateProfile(String email, String newPassword, String username) {
        peopleRepository.updateProfile(email, newPassword, username);
    }

    //加载文章(字段包括文章ID,标题,分类,标签,浏览量)
    public Page<Article> loadArticles(int page, int size) {
        List<Article> articleList = peopleRepository.findAllArticles();
        int start = page * size;
        int end = Math.min((page + 1) * size, articleList.size());
        List<Article> pageContent = articleList.subList(start, end);
        return new PageImpl<>(pageContent, PageRequest.of(page, size), articleList.size());
    }

    //删除文章
    public boolean deleteArticleById(int id) {
        try {
            peopleRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    //分页查询我的文章
    public List<Article> loadMyPosts(Integer id, int page, int size) {
        int offset = (page - 1) * size;
        return peopleRepository.findMyPosts(id, offset, size);
    }

    //查询我的文章总数
    public int countMyPosts(Integer id) {
        return peopleRepository.countMyPosts(id);
    }
}
