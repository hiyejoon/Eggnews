// metadata.js 수정 제안
try {
  const response = await fetch(dbUrl);
  const data = await response.json();

  // 필드 존재 여부를 체크하며 안전하게 추출
  const title = data.fields?.title?.stringValue || "계란News";
  const rawContent = data.fields?.content?.stringValue || "";
  const content = rawContent.substring(0, 80).replace(/\n/g, ' ');
  const image = data.fields?.imgurUrl?.stringValue || "https://i.imgur.com/기본이미지.jpg";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${content}">
        <meta property="og:image" content="${image}">
        <meta property="og:url" content="${url.href}">
      </head>
      <body></body>
    </html>
  `;
  return new Response(html, { headers: { "content-type": "text/html" } });
} catch (e) {
  // 에러 발생 시 로그를 확인하고 싶다면 console.log(e) 추가 가능
  return; 
}
