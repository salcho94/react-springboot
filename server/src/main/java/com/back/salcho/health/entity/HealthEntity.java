package com.back.salcho.health.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class HealthEntity {
   private int healthId;
   private int memberId;
   private int repsCount;
   private int setsCount;
   private int completedSets;
   private int goalSets;
   private int actualSets;
   private String workoutName;
   private String createdAt;
   private String status;
   private String recordedAt;
   private String originalSetsCount;
}
