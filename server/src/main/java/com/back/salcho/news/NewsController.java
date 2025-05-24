package com.back.salcho.news;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class NewsController {

    @GetMapping("/api/news/list")
    public Map<String, Object> getNews() {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, String>> newsList = new ArrayList<>();

        try {
            // 웹 페이지 가져오기
            String url = "https://news.naver.com/";
            Document doc = Jsoup.connect(url).get();

            // CSS 선택자로 뉴스 제목, 링크 및 썸네일 이미지 추출
            Elements newsCards = doc.select(".main_brick_item._channel_main_news_card_wrapper");

            // 뉴스 카드 하나씩 처리
            if (newsCards.isEmpty()) {
                response.put("message", "뉴스 헤드라인을 찾을 수 없습니다.");
            } else {
                for (Element newsCard : newsCards) {
                    // 뉴스 제목, 링크 및 썸네일 추출
                    String title = newsCard.select(".cnf_news_title").text();
                    String link = newsCard.select("a.cnf_news_area").attr("href");
                    String thumbnailUrl = newsCard.select(".cnf_news_thumb img").attr("src");

                    // 뉴스 항목을 Map에 담기
                    Map<String, String> newsItem = new HashMap<>();
                    newsItem.put("title", title);
                    newsItem.put("link", link);
                    newsItem.put("thumbnail", thumbnailUrl);

                    // 리스트에 추가
                    newsList.add(newsItem);
                }
                response.put("news", newsList);
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Error occurred while fetching the news.");
        }

        // 결과 반환
        return response;
    }
}
