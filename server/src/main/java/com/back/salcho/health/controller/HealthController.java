package com.back.salcho.health.controller;

import com.back.salcho.board.entity.BoardEntity;
import com.back.salcho.health.entity.HealthEntity;
import com.back.salcho.health.service.HealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    HealthService healthService;


    @GetMapping("/list")
    @ResponseBody
    public List<HealthEntity> healthList(@RequestParam int memberId) {
        return healthService.getHealthList(memberId);
    }


    @PostMapping("/create")
    @ResponseBody
    public String createHealth(
            @ModelAttribute HealthEntity health) {
        healthService.createHealth(health);
        return "운동 계획 생성을 완료되었습니다.";
    }

    @PostMapping("/insertHistory")
    @ResponseBody
    public String insertHistory(
            @ModelAttribute HealthEntity health) {
        healthService.insertHistory(health);
        return "Y";
    }

    @PostMapping("/deleteHealth")
    @ResponseBody
    public String deleteHealth(
            @ModelAttribute HealthEntity health) {
        healthService.deleteHealth(health);
        return "Y";
    }

    @GetMapping("/getHistory")
    @ResponseBody
    public List<HealthEntity> getHistory(@RequestParam String createdAt, @RequestParam int memberId) {
        HealthEntity health = new HealthEntity();
        health.setMemberId(memberId);
        health.setCreatedAt(createdAt);
        return healthService.getHistory(health);
    }

    @GetMapping("/getStatistics")
    @ResponseBody
    public List<HealthEntity> getStatistics(@RequestParam String createdAt, @RequestParam int memberId) {
        HealthEntity health = new HealthEntity();
        health.setMemberId(memberId);
        health.setCreatedAt(createdAt);
        return healthService.getStatistics(health);
    }


    @PostMapping("/updateHealth")
    @ResponseBody
    public  String updateHealth(
            @RequestBody HealthEntity health) {
        healthService.updateHealth(health);
        return "해당 운동을 업데이트 하였습니다.";
    }
}