package com.heesun.blog.controller;

import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.heesun.blog.model.Users;
import com.heesun.blog.service.BlogService;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {

	@Autowired
	private BlogService blogService;

	//@Secured({"ROLE_USER","ROLE_ADMIN"})
	@RequestMapping(value = "/", method = { RequestMethod.GET,
			RequestMethod.POST })
	public String home(Locale locale, Model model) {
		// this.userService.selectSample();
		return "/board/template.html";
	}

	@RequestMapping(value = "/list")
	@ResponseBody
	public List<Users> AjaxUserList(@ModelAttribute Users user) {
		return this.blogService.userList();
	}
	
	@RequestMapping(value = "/test")
	public String test(Locale locale, Model model){
		return "/board/template.html"; 
	}
	
	@RequestMapping(value = "/loginUser")
	@ResponseBody
	public String LoginSuccess(HttpSession session){

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		System.out.println(auth.toString());
		
		System.out.println(auth.getName() + "/" + auth.getDetails());
		session.setAttribute("userLoginInfo", auth);
		return "";
	}
	
	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	@ResponseBody
	public  List<Users> admin() {
		return this.blogService.userList();
	}

}
