// localStorage.setItem("userChannels", JSON.stringify(["english", "varios", "forobardo"]))
function renderUserChanels() {
  if (localStorage.getItem("userChannels")) {
    const userChannels = localStorage.getItem("userChannels");
    const arrUserChannels = JSON.parse(userChannels);
    let htmlUserChannels = "";
    arrUserChannels.forEach(channelName => {
      htmlUserChannels += `<li>${channelName}</li>`;
    });
    $listUserChannels.innerHTML = htmlUserChannels;
  }
}

renderUserChanels();

const $buttonCreateChannel = document.getElementById(
  "js-button-create-channel"
);
const $inputChannel = document.getElementById("js-input-channel");

$buttonCreateChannel.addEventListener("click", handleCreation);

let channels = { general: { name: "general" } };
let userChannels = ["general"];
let activeChannel = channels["general"];

function handleCreation() {
  event.preventDefault();
  const storeChannelCreated = createChannel($inputChannel.value);
  if (storeChannelCreated) {
    localStorage.setItem("channels", JSON.stringify(storeChannelCreated));
  }
}

function createChannel(channelName) {
  const channelCreated = { channelName: { name: channelName } };
  const channelExists = channels.hasOwnProperty(channelName);
  if (!channelExists) {
    channels[channelName] = channelCreated.channelName;
    joinChannel(channelName);
    changeActiveChannel(channelName);
    return channels;
  }
}

function joinChannel(channelName) {
  if (!userChannels.includes(channelName)) {
    userChannels.push(channelName);
    return userChannels;
  }
}

function changeActiveChannel(channelName) {
  const channelExists = userChannels.includes(channelName);
  if (channelExists) {
    return (activeChannel = channels[channelName]);
  }
}

//Socket Chat
pushingData = (text, obj, user, date) => {
  obj.message.general.messages.push({
    text,
    date,
    Author: user
  });
};

let btn = document.getElementById("js-add-user-message");
let chat = document.getElementById("js-messages-view");

socket.addEventListener("open", () => {
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);

  if (typeof local_storage !== "object") {
    data.message.general.messages.map(value => {
      value.date = new Date(value.date); //become string to date
      let item = document.createElement("li");
      chat.appendChild(item).innerHTML += `[${formatAMPM(
        value.date
      )}]  &lt;<span class="li-identify">@</span><span class="username">${
        value.Author
      }</span>&gt;  ${value.text}`;
    });
  }
});

socket.addEventListener("message", event => {
  let item = document.createElement("li");
  let date = new Date();
  let message_data = JSON.parse(event.data);
  chat.appendChild(item).innerHTML += `[${formatAMPM(
    date
  )}]  &lt;<span class="li-identify">@</span><span class="username">${
    message_data.user
  }</span>&gt;  ${message_data.text}`;
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);
  pushingData(message_data.text, data, message_data.user, message_data.date);
  localStorage.setItem("data", JSON.stringify(data));
});

btn.addEventListener("click", () => {
  event.preventDefault();
  let text = document.getElementByName("js-input-user-message");
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);
  let date = new Date();
  socket.send(
    JSON.stringify({
      text: text.value,
      user: data.user,
      date: date
    })
  );
  text.value = "";
  text.focus();
});

// listar canales activos

const listaMensajes = document.getElementById("js-messages-list");

eventListeners();

function eventListeners() {
  document
    .getElementById("Canal1")
    .addEventListener("click", listarCanalActivo);
}

function listarCanalActivo() {
  const canal = document.getElementById("Canal1");
  console.log(canal.value);
  const li = document.createElement("li");
  li.innerHTML = canal;
  listaMensajes.appendChild(li);
}

// // ----
// var elementosP = document.getElementsByTagName("p");
// var segundoParrafo = document.getElementById("segundo"); //<p></p>

// // 1. crear elemento
// var elemento = document.createElement("h2");
// // 2. crear un nodo de texto
// var contenido = document.createTextNode("este es nuestro titular");
// // 3. anadir el nodo de texto al elemento
// elemento.appendChild(contenido);
// // 4. agregar atributos al elemento
// elemento.setAttribute("align", "center");
// // 5. agregar el elemento al documento
// document.getElementById("subtitulo").appendChild(elemento);
// //<div></div>
// // document.body.appendChild(elemento);
