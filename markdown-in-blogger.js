//
// markdown-highlight-in-blogger.js -- Markdown in Blogger with Thumbnail Support
// Based on Francis Tang's http://blog.chukhang.com/2011/09/markdown-in-blogger.html
//
var MarkdownHighlightInBlogger = {};

// HTML 엔티티 복원 함수 (기존 유지)
MarkdownHighlightInBlogger.unescapeHTML = function (html) {
  var htmlNode = document.createElement("DIV");
  htmlNode.innerHTML = html;
  if(htmlNode.innerText !== undefined)
    return htmlNode.innerText; // IE
  return htmlNode.textContent; // FF
};

MarkdownHighlightInBlogger.convertMD = function () {
  try {
    console.info('Converting markdown using jQuery (<pre class="markdown"> style)');

    // 1. Showdown 컨버터 설정 (기존 설정 및 깃허브 플레이버 유지)
    var converter = new showdown.Converter({});
    converter.setFlavor('github');

    // 2. <pre class="markdown"> 태그를 순회하며 변환 진행
    $('pre.markdown').each(function (i, block) {
      // 본문 텍스트 추출 (Blogger 에디터 특성에 맞춰 복원 함수 거치기)
      var rawtext = MarkdownHighlightInBlogger.unescapeHTML(block.innerHTML);
      
      // 마크다운을 HTML로 변환
      var md_html = converter.makeHtml(rawtext);
      var $md = $(md_html);

      // [핵심] 블로거 썸네일러가 코드를 즉시 읽을 수 있도록 
      // 변환된 HTML 요소를 원래 <pre> 태그 바로 앞에 완벽한 Dom 형태로 삽입합니다.
      $md.insertBefore(block);
      
      // 기존 block을 hidden으로 숨기면 블로거 엔진이 썸네일을 누락할 수 있으므로,
      // 완벽한 치환을 위해 화면에서 완전히 제거(remove)하거나 깔끔히 비워줍니다.
      $(block).remove(); 
    });

    // 3. 코드 하이라이트 적용 (기존 스타일 유지, 최신 hljs 메서드 예외처리 추가)
    $('pre code').each(function (i, block) {
      if (typeof hljs.highlightElement === 'function') {
        hljs.highlightElement(block);
      } else {
        hljs.highlightBlock(block);
      }
    });

  } catch (exc) {
    console.error('Markdown conversion error:', exc);
  }
};

// DOM 로드가 완료되면 즉시 실행하여 썸네일 채집에 대응합니다.
$(document).ready(MarkdownHighlightInBlogger.convertMD);
