export default async (request, context) => {
  const url = new URL(request.url);
  const articleId = url.searchParams.get("id");
  const userAgent = request.headers.get("user-agent") || "";

  // 카카오톡, 페이스북 등 봇인지 확인
  const isBot = /facebookexternalhit|kakaotalk-scrap|Twitterbot|bitlybot/i.test(userAgent);

  // 봇이면서 기사 ID가 있는 경우에만 처리
  if (isBot && articleId) {
    // Firebase에서 직접 데이터를 가져오기 (Fetch API 사용)
    const firebaseProject = "betear-3915d"; // 본인 프로젝트 ID
    const dbUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProject}/databases/(default)/documents/articles/${articleId}`;
    
    try {
      const response = await fetch(dbUrl);
      const data = await response.json();
      
      const title = data.fields.title.stringValue;
      const content = data.fields.content.stringValue.substring(0, 80).replace(/\n/g, ' ');
      const image = data.fields.imgurUrl ? data.fields.imgurUrl.stringValue : "";

      // 봇에게 보여줄 가짜 HTML 생성
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="og:title" content="${title}">
            <meta property="og:description" content="${content}">
            <meta property="og:image" content="${image}">
          </head>
          <body></body>
        </html>
      `;
      return new Response(html, { headers: { "content-type": "text/html" } });
    } catch (e) {
      return; // 에러 시 원래 페이지로 진행
    }
  }

  // 봇이 아니면 그냥 원래 index.html을 보여줌
  return;
};
