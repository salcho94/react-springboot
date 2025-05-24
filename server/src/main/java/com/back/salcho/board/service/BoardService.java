package com.back.salcho.board.service;


import com.back.salcho.board.entity.BoardEntity;

import java.util.List;
import java.util.Map;

public interface BoardService {
    public List<BoardEntity> getBoardList();

    public int insertBoard(BoardEntity board);

    public int insertFile(BoardEntity board);

    public BoardEntity checkPass(BoardEntity board);

    public List<BoardEntity> getBoard(Map<String, Object> params);

    public List<BoardEntity> getComment(Map<String, Object> params);

    public void deleteFileById(int fileId);

    public void updateBoard(BoardEntity board);

    public void updateCount(Map<String, Object> params);

    public void deleteBoard(BoardEntity board);

    public void insertComment(BoardEntity board);

    public void commentDelete(BoardEntity board);
}
