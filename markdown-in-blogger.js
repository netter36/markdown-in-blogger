//
// markdown-highlight-in-blogger.js -- javascript for using Markdown in Blogger
//

var MarkdownHighlightInBlogger = {};

MarkdownHighlightInBlogger.convertMD = function () {
  try {
    console.info("Converting markdown using jQuery");

    var converter = new showdown.Converter({});
    converter.setFlavor("github");

    $("pre.markdown").each(function (i, block) {
      var rawtext = block.innerText;
      var md_html = converter.makeHtml(rawtext);
      var container = $("<div/>").html(md_html);

      container.find("pre > code").each(function (j, code) {
        var className = String(code.className || "").toLowerCase();

        if (className.indexOf("mermaid") === -1) return;

        var diagram = $("<div/>", {
          "class": "mermaid",
          "text": code.textContent
        });

        $(code).closest("pre").replaceWith(diagram);
      });

      container.contents().insertBefore(block);
      block.hidden = true;
    });

    $("pre code").each(function (i, block) {
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

MarkdownHighlightInBlogger.renderMermaid = function () {
  var result;

  if (!window.mermaid) return;

  mermaid.initialize({
    startOnLoad: false,
    theme: "default"
  });

  if (mermaid.run) {
    result = mermaid.run({
      querySelector: ".mermaid"
    });

    if (result && result.catch) {
      result.catch(function (exc) {
        console.error(exc);
      });
    }
  } else {
    mermaid.init(undefined, document.querySelectorAll(".mermaid"));
  }
};

$(document).ready(MarkdownHighlightInBlogger.convertMD);
