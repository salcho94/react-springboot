package com.back.salcho.health.service;


import com.back.salcho.health.entity.HealthEntity;

import java.util.List;

public interface HealthService {
    public int createHealth(HealthEntity health);

    public List<HealthEntity> getHealthList(int memberId);

    public int insertHistory(HealthEntity health);

    public int deleteHealth(HealthEntity health);

    public List<HealthEntity> getHistory(HealthEntity health);

    public List<HealthEntity> getStatistics(HealthEntity health);

    public int updateHealth(HealthEntity health);

}
