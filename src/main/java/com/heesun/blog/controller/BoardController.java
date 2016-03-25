package com.heesun.blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.heesun.blog.service.BlogService;
import com.heesun.blog.model.Board;
import com.heesun.blog.model.Comment;

/**
 * Handles requests for the application home page.
 */
@Controller
@RequestMapping("/board")
public class BoardController {

	@Autowired
	private BlogService blogService;

	@RequestMapping(value = "/writing")
	public String writing() {
		return "/board/writing.html";
	}
	
	@RequestMapping(value = "/post")
	public String viewPost(){
		return "/board/post.html";
	}
	
	@RequestMapping(value = "/insertPost")
	@ResponseBody
	public void insertPost(@ModelAttribute Board board){
		blogService.insert(board);
	}
	
	@RequestMapping(value = "/viewList")
	@ResponseBody
	public  List<Board> selectList(@ModelAttribute Board board){
		return blogService.selectList(board);
	}
	
	@RequestMapping(value = "/selectPost")
	@ResponseBody
	public Board selectPost(@ModelAttribute Board board){
		return blogService.selectPost(board);
	}
	
	@RequestMapping(value = "/selectByPostMaxId")
	@ResponseBody
	public int selectByPostMaxId(@ModelAttribute Board board){
		return blogService.selectByPostMaxId(board);
	}
	
	@RequestMapping(value = "/insertComment")
	public void insertComment(@ModelAttribute Comment cmt){
		blogService.insertComment(cmt);
	}
	
	@RequestMapping(value = "/selectCommentList")
	@ResponseBody
	public List<Board> selectCommentList(@ModelAttribute Comment cmt){
		return blogService.selectCommentList(cmt);
	}
	
	@RequestMapping(value = "/deletePost")
	public void deletePost(@ModelAttribute Board board){
		blogService.delete(board);
	}
	
	@RequestMapping(value = "/updatePost")
	public void updatePost(@ModelAttribute Board board){
		blogService.update(board);
	}
	
	@RequestMapping(value = "/deleteCmt")
	public void deleteCmt(@ModelAttribute Comment cmt){
		blogService.deleteCmt(cmt);
	}
	
	@RequestMapping(value = "/selectCategoryById")
	@ResponseBody
	public int selectCategoryById(@ModelAttribute Board board){
		return blogService.selectCategoryById(board);
	}
	
	@RequestMapping(value ="/updateCmt" )
	public void updateCmt(@ModelAttribute Comment cmt){
		blogService.updateCmt(cmt);
	}
	
	@RequestMapping(value = "/pagingNumber")
	@ResponseBody
	public int pagingNumber(@ModelAttribute Board board){
		return blogService.pagingNumber(board);
	}
	
	@RequestMapping(value = "/cmtPagingNumber")
	@ResponseBody
	public int cmtPagingNumber(@ModelAttribute Comment cmt){
		return blogService.cmtPagingNumber(cmt);
	}
	
}
