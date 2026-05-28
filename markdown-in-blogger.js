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

MarkdownHighlightInBlogger.getFirstMarkdownImage = function (text) {
  var match;

  if (!text) return "";

  match = String(text).match(/!\[[^\]]*?\]\(\s*<?([^>\s)]+)>?(?:\s+["'][^"']*["'])?\s*\)/i);

  if (match && match[1]) {
    return match[1].replace(/^['"]|['"]$/g, "");
  }

  return "";
};

MarkdownHighlightInBlogger.setPostThumbnail = function (block, imageUrl) {
  var post;
  var img;
  var link;
  var thumb;

  if (!block || !imageUrl) return;

  post = $(block).closest(".post, .post-outer, .hentry, article");

  if (!post.length) return;

  img = post.find(".post-thumbnail img, .post-thumb img, .item-thumbnail img, .entry-thumbnail img, img.thumbnail").first();

  if (img.length) {
    img.attr("src", imageUrl);
    img.removeAttr("srcset data-src");
    return;
  }

  link = post.find("h2 a, h3 a, .post-title a, a[href]").first();

  thumb = $("<a/>", {
    "class": "markdown-auto-thumbnail",
    "href": link.length ? link.attr("href") : "#"
  });

  $("<img/>", {
    "src": imageUrl,
    "alt": ""
  }).appendTo(thumb);

  post.prepend(thumb);
};

MarkdownHighlightInBlogger.convertMD = function () {
  try {

    console.info("Converting markdown using jQuery");

    // showdown renderer
    var converter = new showdown.Converter({});
    converter.setFlavor("github");

    $('pre.markdown').each(function (i, block) {
  var rawtext = block.innerText;
  var imageMatch = rawtext.match(/!\[[^\]]*?\]\(\s*<?([^>\s)]+)>?(?:\s+["'][^"']*["'])?\s*\)/i);
  var imageUrl = imageMatch && imageMatch[1] ? imageMatch[1] : "";
  var md_html = converter.makeHtml(rawtext);
  var md = $(md_html);

  if (imageUrl) {
    var post = $(block).closest(".post, .post-outer, .hentry, article");
    var thumbImg = post.find(".post-thumbnail img, .post-thumb img, .item-thumbnail img, .entry-thumbnail img, img.thumbnail").first();

    if (thumbImg.length) {
      thumbImg.attr("src", imageUrl);
      thumbImg.removeAttr("srcset data-src");
    } else if (post.length) {
      var link = post.find("h2 a, h3 a, .post-title a, a[href]").first();
      var thumb = $("<a/>", {
        "class": "markdown-auto-thumbnail",
        "href": link.length ? link.attr("href") : "#"
      });

      $("<img/>", {
        "src": imageUrl,
        "alt": ""
      }).appendTo(thumb);

      post.prepend(thumb);
    }
  }

  md.insertBefore(block);
  block.hidden = true;
});
    $("pre code").each(function (i, block) {
      hljs.highlightBlock(block);
    });

  } catch (exc) {
    console.error(exc);
  }
};

$(document).ready(MarkdownHighlightInBlogger.convertMD);
