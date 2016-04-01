package com.heesun.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.heesun.blog.model.Users;
import com.heesun.blog.service.BlogService;

/**
 * Handles requests for the application home page.
 */
@Controller
@RequestMapping("/user")
public class UserController {

	@Autowired
	private BlogService blogService;

	@RequestMapping(value = "/join")
	public String join() {
		return "/user/join.html";

	}

	@RequestMapping(value = "/idCheck")
	@ResponseBody
	public boolean idCheck(@ModelAttribute Users user) {
		boolean result = this.blogService.idCheck(user);
		return result;
	}

	@RequestMapping(value = "/joinUser")
	public void joinUser(@ModelAttribute Users user) {
		this.blogService.joinUser(user);
	}

/*	@RequestMapping(value = "/loginUser")
	@ResponseBody
	public List<User> loginUser(@ModelAttribute User user, HttpSession session) {
		List<User> userInfo = this.blogService.selectUserInfo(user);
		session.setAttribute("userInfo", userInfo);
		return userInfo;
	}*/
}
