package com.heesun.blog.service;

import java.util.ArrayList;
import java.util.Collection;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.heesun.blog.mapper.UserMapper;
import com.heesun.blog.model.Users;

public class LoginService implements UserDetailsService {

	@Resource(name = "userMapper")
	private UserMapper userMapper;

	private SqlSession sqlSession;

	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}

	@Override
	public UserDetails loadUserByUsername(String userName)
			throws UsernameNotFoundException {
		Users userInfo = userMapper.selectById(userName);

		System.out.println(sqlSession);
		Collection<SimpleGrantedAuthority> roles = new ArrayList<SimpleGrantedAuthority>();
		roles.add(new SimpleGrantedAuthority("ROLE_USER"));
		UserDetails user = new User(userInfo.getUser_id(), userInfo.getPassword(), roles);

		return user;
	}

}
