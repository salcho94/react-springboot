package com.back.salcho.member.service;


import com.back.salcho.board.mapper.BoardMapper;
import com.back.salcho.member.entity.MemberEntity;
import com.back.salcho.member.mapper.MemberMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MemberServiceImpl implements MemberService {
    @Autowired
    MemberMapper memberMapper;
    @Autowired
    PasswordEncoder bCryptPasswordEncoder;
    public MemberEntity  duplicateCheck(MemberEntity member){
        return memberMapper.duplicateCheck(member);
    }

    @Override
    public int signupMember(MemberEntity member) {
        return memberMapper.signupMember(member);
    }

    @Override
    public int updateTarget(MemberEntity member) {
        return memberMapper.updateTarget(member);
    }

    @Override
    public MemberEntity loginMember(MemberEntity member) {
        return memberMapper.loginMember(member);
    }

    @Override
    public Map<String, Object> getStatistics(Map<String, String> reqMap) {

        return memberMapper.getStatistics(reqMap);
    }

    @Override
    public Map<String, String> getMember(String memberId) {
        return memberMapper.getMember(memberId);
    }

    @Override
    public List<Map<String,Object>> getCateData(Map<String, String> reqMap) {
        return memberMapper.getCateData(reqMap);
    }

    @Override
    public List<MemberEntity> getMemberList() {
        return memberMapper.getMemberList();
    }

    @Override
    public void authUpdate(MemberEntity member) {
        memberMapper.authUpdate(member);
    }

    @Override
    public void memberDelete(MemberEntity member) {
        memberMapper.memberDelete(member);
    }


}
