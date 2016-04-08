package com.heesun.blog.mapper;

import java.util.List;

import com.heesun.blog.model.Board;
import com.heesun.blog.model.Comment;

public interface BoardMapper extends BaseMapper<Board> {
	List<Board> selectList(Board board);

	Board selectPost(Board board);

	int selectByPostMaxId(Board board);

	void insertComment(Comment cmt);

	List<Board> selectCommentList(Comment cmt);

	int selectCategoryById(Board board);

	void deleteCmt(Comment cmt);

	void updateCmt(Comment comt);

	int pagingNumber(Board board);
	
	int cmtPagingNumber(Comment cmt);
	
	int selectByCmtMaxId(Comment cmt);

}
