//
// markdown-highlight-in-blogger.js -- javascript for using Markdown in Blogger
//

var MarkdownHighlightInBlogger = {};

MarkdownHighlightInBlogger.unescapeHTML = function (html) {
  var htmlNode = document.createElement("DIV");
  htmlNode.innerHTML = html;

  if (htmlNode.innerText !== undefined)
    return htmlNode.innerText;

  return htmlNode.textContent;
};

MarkdownHighlightInBlogger.renderMermaid = function () {
  if (!window.mermaid) return;

  mermaid.initialize({
    startOnLoad: false,
    theme: "default"
  });

  if (mermaid.run) {
    mermaid.run({
      querySelector: ".mermaid"
    }).catch(function (exc) {
      console.error(exc);
    });
  } else {
    mermaid.init(undefined, document.querySelectorAll(".mermaid"));
  }
};

MarkdownHighlightInBlogger.convertMD = function () {
  try {
    console.info("Converting markdown using jQuery");

    var converter = new showdown.Converter({});
    converter.setFlavor("github");

    $("pre.markdown").each(function (i, block) {
      var rawtext = block.innerText;
      var md_html = converter.makeHtml(rawtext);
      var container = $("<div/>").html(md_html);

      container.find("pre code.language-mermaid, pre code.mermaid").each(function (j, code) {
        var diagram = $("<div/>", {
          "class": "mermaid",
          "text": code.textContent
        });

        $(code).closest("pre").replaceWith(diagram);
      });

      container.contents().insertBefore(block);
      block.hidden = true;
    });

    $("pre code").not(".language-mermaid, .mermaid").each(function (i, block) {
      if (hljs.highlightElement) {
        hljs.highlightElement(block);
      } else {
        hljs.highlightBlock(block);
      }
    });

    MarkdownHighlightInBlogger.renderMermaid();

  } catch (exc) {
    console.error(exc);
  }
};

$(document).ready(MarkdownHighlightInBlogger.convertMD);
