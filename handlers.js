const htmlEditorElement = document.querySelector("#html-editor");
const cssEditorElement = document.querySelector("#css-editor");
const pageIframe = document.querySelector("#page-iframe");

const htmlEditor = CodeMirror(htmlEditorElement, {
  value: "<html><head></head><body>My name strawberry shortcake</body></html>",
  mode: "htmlmixed",
  theme: "material-darker",
  lineWrapping: true,
  lineNumbers: true
});

const cssEditor = CodeMirror(cssEditorElement, {
  value: "body{background-color: pink;}",
  mode: "css",
  theme: "material-darker",
  lineWrapping: true,
  lineNumbers: true
});

// const host = "http://localhost:3000";
const host = "https://www.valuesmm.com";
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

function buildPage(newTab = false, firstTime = false) {
  fetch(host + "/buildPage", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      htmlInput: htmlEditor.getValue(),
      cssInput: cssEditor.getValue(),
      pageName: pageName // pageName is undefined on the first run of buildPage
    })
  })
    .then(res => res.json())
    .then(res => {
      if (firstTime === true) {
        pageName = res.body.pageName; // set pageName
        pageURL = host + "/" + pageName; // set pageURL
        pageIframe.setAttribute("src", pageURL); // set src of iframe
      }
      if (newTab === true) {
        window.open(pageURL, "_blank");
      }
      pageIframe.src = pageIframe.src; // refresh frame
    })
    .catch(err => console.log(err));
}
