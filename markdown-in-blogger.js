//
// markdown-highlight-in-blogger.js -- javascript for using Markdown in Blogger
//

// namespace
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
    });
  } else {
    mermaid.init(undefined, $(".mermaid").toArray());
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
      var md = $(md_html);

      md.find("pre code.language-mermaid, pre code.mermaid").each(function (j, code) {
        var diagram = $("<div/>", {
          "class": "mermaid",
          "text": code.textContent
        });

        $(code).closest("pre").replaceWith(diagram);
      });

      md.insertBefore(block);
      block.hidden = true;
    });

    $("pre code").not(".language-mermaid, .mermaid").each(function (i, block) {
      hljs.highlightBlock(block);
    });

    MarkdownHighlightInBlogger.renderMermaid();

  } catch (exc) {
    console.error(exc);
  }
};

$(document).ready(MarkdownHighlightInBlogger.convertMD);
