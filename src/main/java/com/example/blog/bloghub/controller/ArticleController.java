package com.example.blog.bloghub.controller;

import com.example.blog.bloghub.entity.User;
import com.example.blog.bloghub.service.ArticleService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Random;

@Controller
@RequestMapping("/api/articles")
public class ArticleController {
    @Autowired
    private ArticleService articleService;

    //根据id获取文章详情
    @GetMapping("{id}")
    public String getArticle(@PathVariable("id") int id, Model model) {
        // 假设你从数据库或其他地方根据 ID 获取文章内容
        String title = "";
        String markdownContent = "";
        String category = "";
        String tags = "";
        int viewCount = 0;


        //从数据库中获取文章内容
        markdownContent=articleService.getArticleContentById(id);
        title=articleService.getArticleTitleById(id);
        category=articleService.getArticleCategoryById(id);
        tags=articleService.getArticleTagsById(id);
        viewCount=articleService.getArticleViewCountById(id);

        // 将 Markdown 内容传递到 Thymeleaf 模板中
        model.addAttribute("markdownContent", markdownContent);
        model.addAttribute("title", title);
        model.addAttribute("category", category);
        model.addAttribute("tags", tags);
        model.addAttribute("viewCount", viewCount);

        return "/Article/articles";
    }

    //发布文章
    @PostMapping
    public ResponseEntity<String> createArticle(@RequestParam String title,
                                                @RequestParam String category,
                                                @RequestParam(required = false) String tags,
                                                @RequestParam String content,
                                                HttpSession session
                                                ) {
        //获取用户信息
        User user = (User) session.getAttribute("User");
        if (user == null) {
            return ResponseEntity.status(401).body("用户未登录");
        }

        int authorId = user.getId();
        // 获取上海时区的当前时间
        ZonedDateTime shanghaiTime = ZonedDateTime.now(ZoneId.of("Asia/Shanghai"));
        System.out.println("ZonedDateTime in Shanghai: " + shanghaiTime);  // 打印上海时间

        // 格式化为数据库可以存储的时间格式（yyyy-MM-dd HH:mm:ss）
        String formattedCreateTime = shanghaiTime.toLocalDateTime().toString().replace("T", " ").substring(0, 19);
        String formattedUpdateTime = shanghaiTime.toLocalDateTime().toString().replace("T", " ").substring(0, 19);

        // 转换为 Timestamp
        Timestamp createTime = Timestamp.valueOf(formattedCreateTime);
        Timestamp updateTime = Timestamp.valueOf(formattedUpdateTime);

        // 打印格式化后的时间
        System.out.println("Formatted Create Time (Shanghai): " + formattedCreateTime);
        System.out.println("Formatted Update Time (Shanghai): " + formattedUpdateTime);


        Random random = new Random();
        int viewCount = random.nextInt(10000);

        try {
            articleService.saveArticle(title, content, authorId, category, tags,viewCount, createTime, updateTime);
            return ResponseEntity.ok("文章发布成功");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("文章发布失败，请重试");
        }
    }


}
