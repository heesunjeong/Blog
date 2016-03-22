package com.heesun.blog.mapper;

import java.util.List;

import com.heesun.blog.model.User;

public interface UserMapper extends BaseMapper<User> {
	List<User> selectLoginCheck(User user);

	User selectUserInfo(User user);
}
