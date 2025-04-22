package com.example.blog.bloghub.controller;

import com.example.blog.bloghub.entity.Article;
import com.example.blog.bloghub.entity.User;
import com.example.blog.bloghub.service.PeopleService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/people")
public class PeopleController {
    @Autowired
    private PeopleService peopleService;

    //编辑个人信息
    @GetMapping("/editProfile")
    public String editPage(HttpServletRequest request, Model model) {
        User user = (User) request.getSession().getAttribute("User");
        model.addAttribute("username", request.getSession().getAttribute("username"));
        return "/User/editProfile";  // 返回 edit 页面的视图名，假设有一个 editProfile.html 页面
    }

    //更新个人信息
    @PostMapping("/editProfile")
    public ResponseEntity<?> updateProfile(@RequestParam String email,@RequestParam String oldPassword,@RequestParam String newPassword ,@RequestParam String confirmPassword,@RequestParam String username, Model model) {
        System.out.println("username: 名字"+username);
        String oldPsd = peopleService.getOldPassword(username);

        //确认密码是否正确
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("两次密码输入不一致");
        }
        if (oldPsd.equals(oldPassword)) {//判断原密码是否正确
            peopleService.updateProfile(email,  newPassword, username);
            return ResponseEntity.ok("更新成功");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("原密码错误");
        }
    }


    //查看个人信息
    @GetMapping("/viewProfile")
    public String viewPage(HttpServletRequest request, Model model) {
        User user = (User) request.getSession().getAttribute("User");
        model.addAttribute("username", request.getSession().getAttribute("username"));
        return "/User/viewProfile";  // 返回 view 页面的视图名，假设有一个 viewProfile.html 页面
    }

    //用户控制台主页
    @GetMapping("/consoleDash")
    public String consoleDash(@RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "20") int size,
                              HttpServletRequest request,
                              Model model) {
        User user = (User) request.getSession().getAttribute("User");
        model.addAttribute("username", request.getSession().getAttribute("username"));

        return "/User/consoleDash";  // 返回 console-dash 页面的视图名，假设有一个 consoleDash.html 页面
    }

    //分页获取所有文章
    @GetMapping("/consoleDash/articles")
    @ResponseBody
    public Map<String, Object> getAllArticles(@RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "20") int size) {
        Page<Article> articlePage = peopleService.loadArticles(page, size);

        Map<String, Object> result = new HashMap<>();
        result.put("articles", articlePage.getContent()); // 当前页文章
        result.put("totalPages", articlePage.getTotalPages()); // 总页数
        result.put("totalElements", articlePage.getTotalElements()); // 总条数
        result.put("currentPage", page);

        return result;
    }


    // 删除文章
    @DeleteMapping("/deleteArticle/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable int id) {
        boolean success = peopleService.deleteArticleById(id);
        if (success) {
            return ResponseEntity.ok("文章删除成功");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("删除失败");
        }
    }

    //查看我的文章
    @GetMapping("/myPosts")
    public String myPosts(@RequestParam(defaultValue = "1") int page,
                          @RequestParam(defaultValue = "5") int pageSize,
                          HttpServletRequest request,
                          Model model) {
        User user = (User) request.getSession().getAttribute("User");
        model.addAttribute("username", request.getSession().getAttribute("username"));

        if (user == null) {
            return "redirect:/login";
        }

        List<Article> articles = peopleService.loadMyPosts(user.getId(), page, pageSize);
        int totalArticles = peopleService.countMyPosts(user.getId());
        int totalPages = (int) Math.ceil(totalArticles / (double) pageSize);

        model.addAttribute("articles", articles); // 当前页文章
        model.addAttribute("totalPages", totalPages); // 总页数
        model.addAttribute("totalArticles", totalArticles); // 总条数
        model.addAttribute("pageSize", pageSize);// 每页显示条数
        model.addAttribute("currentPage", page);// 当前页数
        return "/User/myPosts";
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/myPosts/articles")
    @ResponseBody
    public ResponseEntity<?> getArticles(@RequestParam(defaultValue = "1") int page,
                                         @RequestParam(defaultValue = "5") int size,
                                         HttpServletRequest request) {
        try {
            User user = (User) request.getSession().getAttribute("User");
            if (user == null) {
                System.out.println("用户未登录");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "用户未登录"));
            }

            List<Article> articles = peopleService.loadMyPosts(user.getId(), page, size);

            int totalArticles = peopleService.countMyPosts(user.getId());
            int totalPages = (int) Math.ceil(totalArticles / (double) size);

            Map<String, Object> response = new HashMap<>();
            response.put("articles", articles);
            response.put("totalPages", totalPages);
            response.put("totalArticles", totalArticles);
            response.put("currentPage", page);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("处理请求时发生错误: " + e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "获取文章列表失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }



}
