package com.example.blog.bloghub.controller;

import com.example.blog.bloghub.entity.Article;
import com.example.blog.bloghub.entity.User;
import com.example.blog.bloghub.service.ArticleService;
import com.example.blog.bloghub.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private ArticleService articleService;

    private static final int PAGE_SIZE = 5;

    //登陆
    @GetMapping("/login")
    public String loginPage() {
        return "/LoginOrRegister/login";  // 返回登录页面的视图名，假设有一个 login.html 页面
    }

    // 注册
    @GetMapping("/register")
    public String registerPage() {
        return "/LoginOrRegister/register";  // 返回注册页面的视图名，假设有一个 register.html 页面
    }

    //注册验证
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestParam String username, @RequestParam String password, @RequestParam String email, Model model) {
        // 获取上海时区的当前时间
        ZonedDateTime shanghaiTime = ZonedDateTime.now(ZoneId.of("Asia/Shanghai"));
        System.out.println("ZonedDateTime in Shanghai: " + shanghaiTime);  // 打印上海时间

        // 格式化为数据库可以存储的时间格式（yyyy-MM-dd HH:mm:ss）
        String formattedCreateTime = shanghaiTime.toLocalDateTime().toString().replace("T", " ").substring(0, 19);

        // 转换为 Timestamp
        Timestamp timestamp = Timestamp.valueOf(formattedCreateTime);

        // 打印格式化后的时间
        System.out.println("Formatted Create Time (Shanghai): " + formattedCreateTime);
        System.out.println("Timestamp: " + timestamp);

        boolean success= userService.registerUser(username, password, email, timestamp);
        if (success) {
            return ResponseEntity.ok("注册成功");  // 注册成功
        } else {
            model.addAttribute("error", "该用户名已被注册");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("该用户名已被注册");  // 注册失败
        }
    }


    // 登录验证
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password, HttpServletRequest request, Model model) {
        User user = userService.validateUser(username, password);
        if (user != null) {
            int id= user.getId();
            // 登录成功，存入 session
            request.getSession().setAttribute("User", user);  // 存入 User 对象
            request.getSession().setAttribute("username", username); // 存入 username
            request.getSession().setAttribute("id", id); // 存入 id
            return ResponseEntity.ok("Login success");  // 登录成功
        } else {
            model.addAttribute("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");  // 登录失败
        }
    }

    //首页
    @GetMapping("/api")
    public String apiPage(HttpServletRequest request, Model model,
                          @RequestParam(defaultValue = "1") int page) {
        User user = (User) request.getSession().getAttribute("User");

        if (user == null) {
            return "redirect:/login";
        }

        // 获取分页文章
        List<Article> articles = articleService.getArticlesByPage(page, PAGE_SIZE);
        int totalArticles = articleService.getTotalArticles();
        int totalPages = (int) Math.ceil((double) totalArticles / PAGE_SIZE);

        // 将数据添加到Model中
        model.addAttribute("User", user);
        model.addAttribute("username", request.getSession().getAttribute("username"));
        model.addAttribute("articles", articles);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("totalArticles", totalArticles);

        return "api";
    }

    //关于作者
    @GetMapping("/api/about")
    public String aboutPage(HttpServletRequest request, Model model) {
        User user = (User) request.getSession().getAttribute("User");

        if (user == null) {
            return "redirect:/login";
        }

        return "/Myself/about";
    }

    //联系作者
    @GetMapping("/api/contact")
    public String contactPage(HttpServletRequest request, Model model) {
        User user = (User) request.getSession().getAttribute("User");

        if (user == null) {
            return "redirect:/login";
        }

        return "/Myself/contact";
    }

    // 获取文章列表的API
    @GetMapping("/api/articles")
    @ResponseBody
    public ResponseEntity<?> getArticles(@RequestParam(defaultValue = "1") int page) {
        try {
            List<Article> articles = articleService.getArticlesByPage(page, PAGE_SIZE);
            int totalArticles = articleService.getTotalArticles();
            int totalPages = (int) Math.ceil((double) totalArticles / PAGE_SIZE);

            Map<String, Object> response = new HashMap<>();
            response.put("articles", articles);
            response.put("totalPages", totalPages);
            response.put("totalArticles", totalArticles);
            response.put("currentPage", page);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取文章列表失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    //发布文章
    @GetMapping("/api/writeArticles")
    public String writeArticlePage(HttpServletRequest request, Model model) {
        User user = (User) request.getSession().getAttribute("User");

        if (user == null) {
            return "redirect:/login";
        }

        return "/Article/writeArticles";
    }

    //隐私政策
    @GetMapping("/api/privacy")
    public String privacyPage(HttpServletRequest request, Model model) {
        User user = (User) request.getSession().getAttribute("User");

        if (user == null) {
            return "redirect:/login";
        }

        return "/PrivacyOrUsage/privacy";
    }

    //使用条款
    @GetMapping("/api/usage")
    public String termsPage(HttpServletRequest request, Model model) {
        User user = (User) request.getSession().getAttribute("User");

        if (user == null) {
            return "redirect:/login";
        }

        return "/PrivacyOrUsage/usage";
    }


    // 响应消息类
    private static class ResponseMessage {
        private boolean success;
        private String message;

        public ResponseMessage(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        // getters and setters
    }

    // 文章响应类
    private static class ArticleResponse {
        private List<Article> articles;
        private int totalPages;
        private int totalArticles;

        public ArticleResponse(List<Article> articles, int totalPages, int totalArticles) {
            this.articles = articles;
            this.totalPages = totalPages;
            this.totalArticles = totalArticles;
        }

        // getters and setters
    }
}
