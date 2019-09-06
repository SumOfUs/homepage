var links = document.querySelectorAll("a");
var accordianHeaders = document.querySelectorAll(".privacy__question");
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener("click", e => {
    changeClass(e.target.hash.replace("#", "."));
  });
}
for (var i = 0; i < accordianHeaders.length; i++) {
  accordianHeaders[i].addEventListener("click", e => {
    toggleFunction(e.target.parentElement.classList[0]);
  });
}
function changeClass(link) {
  var p = document.querySelector(`${link} .privacy__answer`);
  var h2 = document.querySelector(`${link} h2`);
  p.classList.remove("hidden-closed");
  h2.classList.add("privacy__question--open");
}
function toggleFunction(class_) {
  var p = document.querySelector(`.${class_} .privacy__answer`);
  var h2 = document.querySelector(`.${class_} h2`);
  p.classList.toggle("hidden-closed");
  h2.classList.toggle("privacy__question--open");
}
