MarkdownHighlightInBlogger.renderMermaid = function () {
  if (!window.mermaid) return;

  mermaid.initialize({
    startOnLoad: false,
    theme: "default"
  });

  mermaid.run({
    querySelector: ".mermaid"
  });
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

      md.find("pre code.language-mermaid, pre code.mermaid")
        .add(md.filter("pre").find("code.language-mermaid, code.mermaid"))
        .each(function (j, code) {
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
