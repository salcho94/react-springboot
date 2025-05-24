package com.back.salcho.menu.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class MenuEntity {
    private int id;
    private int sort;
    private String name;
    private String path;
    private String auth;
}
