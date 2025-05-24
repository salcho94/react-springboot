package com.back.salcho.health.mapper;

import com.back.salcho.health.entity.HealthEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface HealthMapper {
    Integer createHealth(HealthEntity health);

    List<HealthEntity> getHealthList(int memberId);

    Integer insertHistory(HealthEntity health);

    Integer deleteHealth(HealthEntity health);

    List<HealthEntity> getHistory(HealthEntity health);

    List<HealthEntity> getStatistics(HealthEntity health);

    Integer updateHealth(HealthEntity health);



}
