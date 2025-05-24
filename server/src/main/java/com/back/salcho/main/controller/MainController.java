package com.back.salcho.main.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class MainController {

    @GetMapping("/")
    public String home() {
        return "Welcome to the home page!";
    }

}
