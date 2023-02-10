const bsToastEl = document.querySelector("#liveToast");
const userData = document.querySelector("#userData");
const userBtn = document.querySelector("#userBtn");
const userNameInput = document.querySelector("#userNameInput");
const assistant = document.querySelector("#assistantImage");
const toastEl = document.querySelector("#toastEl");
const assistantName = document.querySelector("#assistantName");
const data = new FormData(userData);
const bsToast = new bootstrap.Toast(bsToastEl);
let num = Math.round(Math.random() * 1);
userBtn.addEventListener("click", (e) => {
  if (userNameInput.value === "") {
    bsToast.show();
    e.preventDefault();
  }
});
const messages = [
  "Oh Please don't destroy the server <img src='/img/scared.gif' width='40px' alt='please?'>",
  "please Noooooo..",
  "Uhhhh Execuse Me?",
  "このバカ！>_< <img src='/img/pout-girl.gif' width='40px' alt='i hate you'>",
];
let messageNum = Math.round(Math.random() * messages.length);
const assistants = [
  {
    name: "Assistant Lum",
    src: "/img/lum.jpg",
    message: "Hey You Bad Guy!",
  },
  {
    name: "Assistant nagatoro",
    src: "/img/nagatoro.jpeg",
    message: "Senpai won't like this.",
  },
];
assistantName.innerText = assistants[num].name;
assistant.setAttribute("src", assistants[num].src);
toastEl.innerHTML = `<p>${messages[messageNum]}</p>`;
bsToastEl.addEventListener("shown.bs.toast", () => {
  messageNum = Math.round(Math.random() * 3);
  num = Math.round(Math.random() * 1);
  assistant.setAttribute("src", assistants[num].src);
  toastEl.innerHTML = `<p>${messages[messageNum]}</p>`;
  assistantName.innerText = assistants[num].name;
});
