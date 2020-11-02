const htmlEditorElement = document.querySelector("#html-editor");
const cssEditorElement = document.querySelector("#css-editor");
const pageIframe = document.querySelector("#page-iframe");

const htmlEditor = CodeMirror(htmlEditorElement, {
  value:
    "<html>\n  <head></head>\n  <body>\n    This is strawberry shortcake\n  </body>\n</html>",
  mode: "htmlmixed",
  theme: "material-darker",
  lineWrapping: true,
  lineNumbers: true
});

const cssEditor = CodeMirror(cssEditorElement, {
  value: "body {\n  background-color: #333;\n  color: #eee;\n}",
  mode: "css",
  theme: "material-darker",
  lineWrapping: true,
  lineNumbers: true
});

const host = "https://hcs.rahulkum.com";
let pageURL; // assigned on first run of buildPage
let pageName; // assigned on first run of buildPage

window.onload = () => {
  buildPage(false, true); // first run of buildPage
};

function refreshIframeHandler() {
  buildPage();
}

function submitHandler() {
  buildPage(true);
}

async function buildPage(newTab = false, firstTime = false) {
  try {
    const res = await fetch(host + "/buildPage", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        htmlInput: htmlEditor.getValue(),
        cssInput: cssEditor.getValue(),
        pageName: pageName // pageName is undefined on the first run of buildPage
      })
    });

    const resData = await res.json();
    if (firstTime === true) {
      pageName = resData.body.pageName; // set pageName
      pageURL = host + "/" + pageName; // set pageURL
      pageIframe.setAttribute("src", pageURL); // set src of iframe
    }
    if (newTab === true) {
      window.open(pageURL, "_blank");
    }
    pageIframe.src = pageIframe.src; // refresh frame
  } catch (err) {
    console.log(err)
  }
}
