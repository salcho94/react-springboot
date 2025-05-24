package com.back.salcho.board.mapper;

import com.back.salcho.board.entity.BoardEntity;
import org.apache.ibatis.annotations.Mapper;


import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper{
    List<BoardEntity> getBoardList();
    Integer insertBoard(BoardEntity board);

    Integer insertFile(BoardEntity board);

    BoardEntity checkPass(BoardEntity board);

    List<BoardEntity> getBoard(Map<String, Object> params);

    List<BoardEntity> getComment(Map<String, Object> params);

    void deleteFileById(int fileId);

    void updateBoard(BoardEntity board);

    void updateCount(Map<String, Object> params);

    void deleteBoard(BoardEntity board);

    void deleteBoardFiles(BoardEntity board);

    void insertComment(BoardEntity board);

    void commentDelete(BoardEntity board);
}
