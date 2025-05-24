package com.back.salcho.menu.service;


import com.back.salcho.menu.entity.MenuEntity;
import com.back.salcho.menu.mapper.MenuMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MenuServiceImpl implements MenuService {
    @Autowired
    MenuMapper menuMapper;

    @Override
    public List<MenuEntity> getMenuList(Map<String, Object> params) {
        return menuMapper.getMenuList(params);
    }

    @Override
    public void sortUpdate(List<MenuEntity> menuList) {
        menuMapper.sortUpdate(menuList);
    }

    @Override
    public void menuUpdate(MenuEntity menu) {
        menuMapper.menuUpdate(menu);
    }

    @Override
    public void menuDelete(MenuEntity menu) {
        menuMapper.menuDelete(menu);
    }

    @Override
    public void menuInsert(MenuEntity menu) {
        menuMapper.menuInsert(menu);
    }
}
