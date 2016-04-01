package com.heesun.blog.service;

import java.util.List;

import com.heesun.blog.model.Board;
import com.heesun.blog.model.Comment;
import com.heesun.blog.model.Users;

public interface BlogService {
	public List<Users> userList();

	public boolean idCheck(Users user);

	public void joinUser(Users user);

	public void insert(Board board);
	
	public List<Board> selectList(Board board);
	
	public Board selectPost(Board board);
	
	public int selectByPostMaxId(Board board);
	
	public void delete(Board board);
	
	public void update(Board board);
	
	public void insertComment(Comment cmt);
	
	public List<Board> selectCommentList(Comment cmt);
	
	public int selectCategoryById(Board board);
	
	public void deleteCmt(Comment cmt);
	
	public void updateCmt(Comment cmt);
	
	public int pagingNumber(Board board);
	
	public int cmtPagingNumber(Comment cmt);

}