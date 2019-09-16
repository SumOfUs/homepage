function internalNav(link, pLink) {
changeClass(link, pLink)
}
var accordianHeaders = document.querySelectorAll(".privacy__question");
for (var i = 0; i < accordianHeaders.length; i++) {
  accordianHeaders[i].addEventListener("click", e => {
    toggleFunction(e.target.parentElement.classList[0]);
  });
}
function changeClass(link, pLink) {
  var replacedHash;
  if(pLink) {
    replacedHash = pLink.replace("#", ".");
  } else {
    replacedHash = link.replace("#", ".");
  }
  var p = document.querySelector(`${replacedHash} .privacy__answer`);
  var h2 = document.querySelector(`${replacedHash} h2`);
  p.classList.remove("hidden-closed");
  h2.classList.add("privacy__question--open");
  window.location.href = link;
}
function toggleFunction(class_) {
  var p = document.querySelector(`.${class_} .privacy__answer`);
  var h2 = document.querySelector(`.${class_} h2`);
  p.classList.toggle("hidden-closed");
  h2.classList.toggle("privacy__question--open");
}
