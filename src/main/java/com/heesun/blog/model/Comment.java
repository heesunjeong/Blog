package com.heesun.blog.model;

public class Comment {
	private String user;
	private String board;
	private String comment_content;
	private String comment_create_date;
	private String user_id;
	private String name;
	private String id;
	private String comment_parent;
	private String depth;
	private String delete_flag;
	private int pageNum;
	
	
	public String getDepth() {
		return depth;
	}
	public void setDepth(String depth) {
		this.depth = depth;
	}
	public String getComment_parent() {
		return comment_parent;
	}
	public void setComment_parent(String comment_parent) {
		this.comment_parent = comment_parent;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getComment_create_date() {
		return comment_create_date;
	}
	public void setComment_create_date(String comment_create_date) {
		this.comment_create_date = comment_create_date;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getBoard() {
		return board;
	}
	public void setBoard(String board) {
		this.board = board;
	}
	public String getComment_content() {
		return comment_content;
	}
	public void setComment_content(String comment_content) {
		this.comment_content = comment_content;
	}
	public String getDelete_flag() {
		return delete_flag;
	}
	public void setDelete_flag(String delete_flag) {
		this.delete_flag = delete_flag;
	}
	public int getPageNum() {
		return pageNum;
	}
	public void setPageNum(int pageNum) {
		this.pageNum = pageNum;
	}
	
}