package com.heesun.blog.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.heesun.blog.mapper.BoardMapper;
import com.heesun.blog.mapper.UserMapper;
import com.heesun.blog.model.Board;
import com.heesun.blog.model.Comment;
import com.heesun.blog.model.User;

/**
 * Handles requests for the application home page.
 */
@Service
public class BlogServiceImpl implements BlogService {

	@Resource(name = "userMapper")
	private UserMapper userMapper;
	@Resource(name = "boardMapper")
	private BoardMapper boardMapper;

	@Override
	public List<User> userList() {
		List<User> userList = userMapper.selectByAll();
		return userList;
	}

	@Override
	public boolean idCheck(User user) {
		User result = userMapper.selectById(user);
		Boolean getResult = false;
		if (result != null) {
			getResult = false;

		} else {
			getResult = true;
		}

		return getResult;
	}

	@Override
	public void joinUser(User user) {
		userMapper.insert(user);
	}

	@Override
	public User loginCheck(User user) {
		User userInfo = userMapper.selectUserInfo(user);
		
		Collection<SimpleGrantedAuthority> roles = new ArrayList<SimpleGrantedAuthority>();
		roles.add(new SimpleGrantedAuthority("ROLE_USER"));
		
		return userInfo;
	}

	@Override
	public void insert(Board board) {
		boardMapper.insert(board);
	}

	@Override
	public List<Board> selectList(Board board) {
		return boardMapper.selectList(board);
	}

	@Override
	public Board selectPost(Board board) {
		return boardMapper.selectPost(board);
	}

	@Override
	public int selectByPostMaxId(Board board) {
		return boardMapper.selectByPostMaxId(board);
	}

	@Override
	public void insertComment(Comment cmt) {
		boardMapper.insertComment(cmt);

	}

	@Override
	public List<Board> selectCommentList(Comment cmt) {
		return boardMapper.selectCommentList(cmt);
	}

	@Override
	public void delete(Board board) {
		boardMapper.delete(board);
	}

	@Override
	public void update(Board board) {
		boardMapper.update(board);
	}

	@Override
	public int selectCategoryById(Board board) {
		return boardMapper.selectCategoryById(board);
	}

	@Override
	public void deleteCmt(Comment cmt) {
		boardMapper.deleteCmt(cmt);

	}

	@Override
	public void updateCmt(Comment cmt) {
		boardMapper.updateCmt(cmt);
	}

	@Override
	public int pagingNumber(Board board) {
		return boardMapper.pagingNumber(board);
	}

	@Override
	public int cmtPagingNumber(Comment cmt) {
		return boardMapper.cmtPagingNumber(cmt);
	}

}
