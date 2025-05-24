package com.back.salcho.member.service;


import com.back.salcho.member.entity.MemberEntity;
import com.back.salcho.menu.entity.MenuEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface MemberService {

    public MemberEntity  duplicateCheck(MemberEntity member);

    public int signupMember(MemberEntity member);

    public int updateTarget(MemberEntity member);

    public MemberEntity loginMember(MemberEntity member);

    Map<String, Object> getStatistics(Map<String, String> reqMap);

    Map<String, String> getMember(String memberId);

    List<Map<String,Object>> getCateData(Map<String, String> reqMap);

    List<MemberEntity> getMemberList();

    public void authUpdate(MemberEntity member);

    public void memberDelete(MemberEntity member);
}
