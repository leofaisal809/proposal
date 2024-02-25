const failurePrompts = [
  "No",
  "huh?",
  "really?",
  "No",
  "Maybe?",
  "Please!",
  "pakka?",
  "You wish",
  "In your dreams",
];

const successBtnEl = document.querySelector(".prompt__success button");
const failureBtnEl = document.querySelector(".prompt__failure button");

successBtnEl.addEventListener("click", showSuccessPrompt);
failureBtnEl.addEventListener("click", repositionButton);

const offsetX = 32;
const offsetY = 32;
const maxWidth = document.body.offsetWidth;
const maxHeight = document.body.offsetHeight;

const initialRect = failureBtnEl.getBoundingClientRect();
const initialTop = initialRect.top;
const initialLeft = initialRect.left;

const edges = {};
calculateEdges(edges, initialRect.width, initialRect.height);

function calculateEdges(edges, w, h) {
  edges.top = -1 * Math.ceil(initialTop) + offsetY;
  edges.left = -1 * Math.ceil(initialLeft) + offsetX;
  edges.right = maxWidth - Math.ceil(w) + edges.left - 2 * offsetX;
  edges.bottom = maxHeight - Math.ceil(h) + edges.top - 3 * offsetY;
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function hasCollision(a, b) {
  const ac = a.getBoundingClientRect();
  const bc = b.getBoundingClientRect();

  return (
    Math.abs(ac.top - bc.top) < ac.height &&
    Math.abs(ac.left - bc.left) < ac.width
  );
}

function repositionButton() {
  let repositionedCount = 0;
  let randomX = 0;
  let randomY = 0;

  const promptMessageIndex = Math.floor(Math.random() * failurePrompts.length);
  failureBtnEl.innerHTML = failurePrompts[promptMessageIndex];

  let rect = failureBtnEl.getBoundingClientRect();
  calculateEdges(edges, rect.width, rect.height);
  
  while (repositionedCount < 1000) {
  randomY = generateRandomNumber(edges.top, edges.bottom);
  randomX = generateRandomNumber(edges.left, edges.right);
  repositionedCount++;
    
    failureBtnEl.style.top = `${randomY}px`;
    failureBtnEl.style.left = `${randomX}px`;

    if (!hasCollision(failureBtnEl, successBtnEl)) break;
  }
}

function showSuccessPrompt() {
  const buttonsEl = document.querySelector(".prompt__buttons");
  buttonsEl.remove();

  const titleEl = document.querySelector(".prompt__title");
  titleEl.innerHTML = `Thanks!! 😊</br>I'd have accepted yours as well! 💍`;
}
