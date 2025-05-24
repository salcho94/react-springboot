package com.back.salcho.menu.mapper;

import com.back.salcho.menu.entity.MenuEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MenuMapper {
    List<MenuEntity> getMenuList(Map<String, Object> params);

    void sortUpdate(List<MenuEntity> menuList);

    void menuUpdate(MenuEntity menu);

    void menuDelete(MenuEntity menu);

    void menuInsert(MenuEntity menu);

}
