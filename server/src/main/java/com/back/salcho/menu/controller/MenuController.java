package com.back.salcho.menu.controller;

import com.back.salcho.menu.entity.MenuEntity;
import com.back.salcho.menu.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    MenuService menuService;

    @GetMapping("/getMenuList")
    @ResponseBody
    public List<MenuEntity> getMenuList(@RequestParam Map<String, Object> params) {
        return menuService.getMenuList(params);
    }

    @PostMapping("/sortUpdate")
    @ResponseBody
    public ResponseEntity<String> sortUpdate(@RequestBody List<MenuEntity> menuList) {
        menuService.sortUpdate(menuList);
        return ResponseEntity.ok("Sort order updated successfully.");
    }


    @PostMapping("/menuUpdate")
    @ResponseBody
    public ResponseEntity<String> menuUpdate(@RequestBody MenuEntity menu) {
        try {
            menuService.menuUpdate(menu);  // 메뉴 업데이트 호출
            // 업데이트가 성공적으로 이루어졌다면 200 OK와 함께 성공 메시지 반환
            return ResponseEntity.ok("업데이트에 성공하였습니다.");
        } catch (Exception e) {
            // 예외가 발생한 경우, 예를 들어 데이터베이스 오류 등
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("메뉴를 수정하는중 오류가 발생하였습니다. " + e.getMessage());
        }
    }


    @PostMapping("/menuInsert")
    @ResponseBody
    public ResponseEntity<String> menuInsert(@RequestBody MenuEntity menu) {
        try {
            menuService.menuInsert(menu);  // 메뉴 업데이트 호출
            // 등록이 성공적으로 이루어졌다면 200 OK와 함께 성공 메시지 반환
            return ResponseEntity.ok("등록이 성공하였습니다.");
        } catch (Exception e) {
            // 예외가 발생한 경우, 예를 들어 데이터베이스 오류 등
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("메뉴를 등록하는중 오류가 발생하였습니다. " + e.getMessage());
        }
    }

    @PostMapping("/menuDelete")
    @ResponseBody
    public ResponseEntity<String> menuDelete(@RequestBody MenuEntity menu) {
        try {
            menuService.menuDelete(menu);  // 메뉴 업데이트 호출
            // 삭제가 성공적으로 이루어졌다면 200 OK와 함께 성공 메시지 반환
            return ResponseEntity.ok("삭제가 성공하였습니다.");
        } catch (Exception e) {
            // 예외가 발생한 경우, 예를 들어 데이터베이스 오류 등
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("메뉴를 삭제하는중 오류가 발생하였습니다. " + e.getMessage());
        }
    }
}