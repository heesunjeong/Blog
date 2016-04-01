package com.heesun.blog.controller;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class LoginController {
	
	@RequestMapping(value="/login.do", method = RequestMethod.GET)
	public String login(HttpSession session) {
		return "/user/login.html";
		
	}
	
	@RequestMapping(value="/fail.do", method = RequestMethod.GET)
	public String failLogin(HttpSession session) {
		return "/user/login-fail.html";
		
	}

}
