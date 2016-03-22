package com.heesun.blog.mapper;

import java.util.List;

public interface BaseMapper<T> {
	T selectById(T obj);
	List<T> selectByName(String name);
	List<T> selectByAll();
	void insert(T obj);
	void update(T obj);
	void delete(T obj);
}
