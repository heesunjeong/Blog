package com.heesun.blog.mapper;

import java.util.List;

import com.heesun.blog.model.Users;

public interface UserMapper extends BaseMapper<Users> {
	List<Users> selectLoginCheck(Users user);

	Users selectById(String userName);
}
