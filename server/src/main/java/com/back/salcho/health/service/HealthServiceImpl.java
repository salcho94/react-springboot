package com.back.salcho.health.service;


import com.back.salcho.health.entity.HealthEntity;
import com.back.salcho.health.mapper.HealthMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthServiceImpl implements HealthService {
    @Autowired
    HealthMapper healthMapper;


    @Override
    public int createHealth(HealthEntity health) {
        return healthMapper.createHealth(health);
    }

    @Override
    public List<HealthEntity> getHealthList(int memberId) {
        return healthMapper.getHealthList(memberId);
    }

    @Override
    public int insertHistory(HealthEntity health) {
        return healthMapper.insertHistory(health);
    }

    @Override
    public int deleteHealth(HealthEntity health) {
        return healthMapper.deleteHealth(health);
    }

    @Override
    public List<HealthEntity> getHistory(HealthEntity health) {
        return healthMapper.getHistory(health);
    }

    @Override
    public List<HealthEntity> getStatistics(HealthEntity health) {
        {
            return healthMapper.getStatistics(health);
        }
    }

    @Override
    public int updateHealth(HealthEntity health) {
        return healthMapper.updateHealth(health);
    }


}
