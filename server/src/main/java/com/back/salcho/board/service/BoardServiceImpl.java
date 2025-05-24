package com.back.salcho.board.service;


import com.back.salcho.board.entity.BoardEntity;
import com.back.salcho.board.mapper.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class BoardServiceImpl implements BoardService{
    @Autowired
    BoardMapper boardMapper;
    @Override
    public List<BoardEntity> getBoardList() {
        return boardMapper.getBoardList();
    }

    @Override
    public int insertBoard(BoardEntity board){
        return boardMapper.insertBoard(board);
    }

    @Override
    public int insertFile(BoardEntity board){
        return boardMapper.insertFile(board);
    }

    @Override
    public BoardEntity checkPass(BoardEntity board) {
        return boardMapper.checkPass(board);
    }

    @Override
    public List<BoardEntity> getBoard(Map<String, Object> params) {
        return boardMapper.getBoard(params);
    }

    public List<BoardEntity> getComment(Map<String, Object> params) {
        return boardMapper.getComment(params);
    }

    @Override
    public void deleteFileById(int fileId) {
        boardMapper.deleteFileById(fileId);
    }

    @Override
    public void updateBoard(BoardEntity board){
        boardMapper.updateBoard(board);
    }

    @Override
    public void updateCount(Map<String, Object> params) {
        boardMapper.updateCount(params);
    }

    @Override
    public void deleteBoard(BoardEntity board){
        boardMapper.deleteBoardFiles(board);
        boardMapper.deleteBoard(board);
    }

    @Override
    public void insertComment(BoardEntity board){
        boardMapper.insertComment(board);
    }

    @Override
    public void commentDelete(BoardEntity board){
        boardMapper.commentDelete(board);
    }

}
