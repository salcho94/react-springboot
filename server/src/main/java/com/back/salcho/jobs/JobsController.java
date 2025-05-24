package com.back.salcho.jobs;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;


@RestController
public class JobsController {

    // private final ExecutorService executor = Executors.newFixedThreadPool(10);

    @GetMapping("/api/jobs/list")
    public Map<String, Object> getJobListings(@RequestParam(defaultValue = "10") int maxPages) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, String>> jobList = Collections.synchronizedList(new ArrayList<>());

        List<Thread> threads = new ArrayList<>();
        for (int page = 1; page <= maxPages; page++) {
            int finalPage = page;
            Thread thread = new Thread(() -> fetchJobs(finalPage, jobList));
            threads.add(thread);
            thread.start();
        }

        // 모든 스레드가 끝날 때까지 대기
        for (Thread thread : threads) {
            try {
                thread.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        response.put("jobs", jobList);
        return response;
    }

    private void fetchJobs(int page, List<Map<String, String>> jobList) {
        int retryCount = 0;
        while (retryCount < 3) { // 최대 3번 재시도
            try {
                String baseUrl = "https://www.saramin.co.kr/zf_user/search?search_done=y&search_optional_item=n&searchType=search&searchword=개발자";
                String url = baseUrl + "&recruitPage=" + page;

                Connection.Response response = Jsoup.connect(url)
                        .userAgent(getRandomUserAgent()) // User-Agent 무작위 변경 이유는 하나로 요청하면 제한걸어뒀을수 있음

                        .timeout(10000) // 타임아웃 10초 증가
                        .maxBodySize(0) // 응답 크기 제한 해제
                        .ignoreHttpErrors(true)
                        .execute();

                Document doc = Jsoup.parse(response.body());
                Elements jobCards = doc.select(".content .item_recruit");

                for (Element jobCard : jobCards) {
                    String title = jobCard.select(".job_tit a").text();
                    if (!title.isEmpty()) {
                        Map<String, String> jobItem = new HashMap<>();
                        jobItem.put("title", title);
                        jobItem.put("link", "https://www.saramin.co.kr" + jobCard.select(".job_tit a").attr("href"));
                        jobItem.put("deadline", jobCard.select(".job_date .date").text());
                        jobItem.put("location", jobCard.select(".job_condition span:nth-child(1)").text());
                        jobItem.put("experience", jobCard.select(".job_condition span:nth-child(2)").text());
                        jobItem.put("education", jobCard.select(".job_condition span:nth-child(3)").text());
                        jobItem.put("employmentType", jobCard.select(".job_condition span:nth-child(4)").text());
                        jobItem.put("category", jobCard.select(".job_sector a").text());
                        jobItem.put("postedDate", jobCard.select(".job_day").text().replace("등록일 ", ""));
                        jobList.add(jobItem);
                    }
                }

                break; // 성공하면 while 루프 종료

            } catch (Exception e) {
                retryCount++;
                System.out.println("⏳ 페이지 " + page + " 가져오기 실패. 재시도 중... (" + retryCount + "/3)");
                if (retryCount == 3) {
                    e.printStackTrace();
                }
            }
        }
    }

    private String getRandomUserAgent() {
        List<String> userAgents = Arrays.asList(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Mozilla/5.0 (Linux; Android 10; SM-G977N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
        );
        return userAgents.get(new Random().nextInt(userAgents.size()));
    }
}
