//
// markdown-highlight-in-blogger.js -- Optimized for Blogger Thumbnail Extraction
//
var MarkdownHighlightInBlogger = {};

// HTML 엔티티 복원 함수 (기존 유지)
MarkdownHighlightInBlogger.unescapeHTML = function (html) {
  var htmlNode = document.createElement("DIV");
  htmlNode.innerHTML = html;
  if(htmlNode.innerText !== undefined)
    return htmlNode.innerText;
  return htmlNode.textContent;
};

MarkdownHighlightInBlogger.convertMD = function () {
  try {
    console.info('Converting markdown and preparing thumbnails...');

    // 1. 블로거의 포스트 본문 영역을 타겟팅합니다. 
    // (블로거 테마에 따라 .post-body, .entry-content 등이 쓰입니다. 일반적인 .post-body 기준)
    var $postBody = $('.post-body');

    if ($postBody.length > 0) {
      $postBody.each(function() {
        var $this = $(this);
        // 현재 본문의 순수 텍스트(마크다운 포함)를 가져옵니다.
        var rawText = $this.html(); 

        // 2. [핵심] 정규식을 이용해 마크다운 이미지 문법(![텍스트](주소))을 
        // 블로거 엔진이 즉시 인식할 수 있는 HTML <img> 태그로 최우선 변환합니다.
        // 메인 화면 썸네일 추출러가 이 단계에서 생성된 <img> 태그를 채집합니다.
        var imgRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
        rawText = rawText.replace(imgRegex, '<img src="$2" alt="$1" style="max-width:100%; height:auto;" />');

        // 3. Showdown 컨버터 설정 (기존 스타일 유지)
        var converter = new showdown.Converter({});
        converter.setFlavor('github');

        // 이미지가 치환된 전체 텍스트를 마크다운 변환기로 돌립니다.
        var mdHtml = converter.makeHtml(MarkdownHighlightInBlogger.unescapeHTML(rawText));

        // 4. 변환된 최종 HTML을 본문에 덮어씌웁니다.
        $this.html(mdHtml);
      });
    }

    // 5. 코드 하이라이트 적용 (기존 스타일 유지, 최신 hljs 메서드 반영)
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

// DOM이 준비되면 실행
$(document).ready(MarkdownHighlightInBlogger.convertMD);
