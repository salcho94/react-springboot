package com.back.salcho.menu.service;


import com.back.salcho.menu.entity.MenuEntity;

import java.util.List;
import java.util.Map;

public interface MenuService {
    public List<MenuEntity> getMenuList(Map<String, Object> params);

    public void sortUpdate(List<MenuEntity> menuList);

    public void menuUpdate(MenuEntity menu);

    public void menuDelete(MenuEntity menu);

    public void menuInsert(MenuEntity menu);
}
