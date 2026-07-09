document.addEventListener("DOMContentLoaded", () => {

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "designer") {
  window.location.href = "login.html";
  return;
}

let currentFilter = "all";

async function renderDesigner(){

const res = await fetch("http://localhost:3000/requests");

const allRequests = await res.json();

const requests = allRequests.filter(
  r => r.designer_id == currentUser.id
);

const newCount = requests.filter(r=>r.status==="new").length;
const progressCount = requests.filter(r=>r.status==="in-progress").length;
const doneCount = requests.filter(r=>r.status==="done").length;

document.getElementById("statNew").textContent = newCount;
document.getElementById("statProgress").textContent = progressCount;
document.getElementById("statDone").textContent = doneCount;

let filtered = requests;

if(currentFilter !== "all"){
filtered = filtered.filter(r=>r.status === currentFilter);
}

const container = document.getElementById("designerList");

if(!filtered.length){
container.innerHTML = "<p class='empty'>Немає заявок</p>";
return;
}

container.innerHTML = filtered.map(req => `
<div class="request-card">

<div class="request-card__top">
<h4>${req.title}</h4>

<div class="status-buttons">

<button class="status-btn ${req.status==="new"?"active":""}" data-id="${req.id}" data-status="new">Нова</button>
<button class="status-btn ${req.status==="in-progress"?"active":""}" data-id="${req.id}" data-status="in-progress">В роботі</button>
<button class="status-btn ${req.status==="done"?"active":""}" data-id="${req.id}" data-status="done">Завершена</button>

</div>

</div>

<p class="request-card__desc">${req.description}</p>

<p>
  <strong>Ціна:</strong> 
  ${req.price ? req.price + " грн" : "Вираховується"}
</p>

<div class="comment-block">

  <textarea
    class="comment-input"
    data-id="${req.id}"
    placeholder="Коментар для клієнта..."
  >${req.comment || ""}</textarea>

  <button class="save-comment-btn" data-id="${req.id}">
    Зберегти коментар
  </button>

</div>

<div class="price-set">
  <input 
    type="number" 
    placeholder="Введіть ціну" 
    class="price-input"
    data-id="${req.id}"
  />
  <button class="set-price-btn" data-id="${req.id}">
    Зберегти
  </button>
</div>

</div>
`).join("");
}

/* створення проєкту */

document.addEventListener("click", function(e){

if(e.target.classList.contains("create-project-btn")){

const id = Number(e.target.dataset.id)

const requests = JSON.parse(localStorage.getItem("requests")) || []
const projects = JSON.parse(localStorage.getItem("projects")) || []

const request = requests.find(r => r.id === id)

if(!request) return

const newProject = {
id: Date.now(),
requestId: request.id,
title: request.type,
client: request.userEmail,
stage: "Планування",
deadline: "30 днів"
}

projects.push(newProject)

localStorage.setItem("projects", JSON.stringify(projects));
renderDesigner();

window.location.href = "projects.html"

}

})

/* збереження коментаря */

document.addEventListener("click", function(e){

if(e.target.classList.contains("save-comment-btn")){

const id = Number(e.target.dataset.id);

const textarea = document.querySelector(
`.comment-input[data-id="${id}"]`
);

const comment = textarea.value;

let requests = JSON.parse(localStorage.getItem("requests")) || [];

requests = requests.map(req=>{
if(req.id === id){
return {...req, comment: comment}
}
return req
})

renderDesigner();

alert("Коментар збережено");

}

});

document.addEventListener("click", async function(e){

  if(e.target.classList.contains("set-price-btn")){

  const id = Number(e.target.dataset.id);

  const input = e.target.previousElementSibling;
  const price = Number(input.value);

  if(price <= 0){
    alert("Введіть коректну ціну");
    return;
  }

  const res = await fetch("http://localhost:3000/requests/price", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      request_id: id,
      price: price
    })
  });

  if(!res.ok){
    alert("Помилка сервера");
    return;
  }

  alert("Ціну встановлено");

  renderDesigner();
}

});

document.addEventListener("click", async function(e){

  if(e.target.classList.contains("save-comment-btn")){

    const id = Number(e.target.dataset.id);

    const textarea = document.querySelector(
      `.comment-input[data-id="${id}"]`
    );

    const comment = textarea.value;

    const res = await fetch("http://localhost:3000/requests/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        request_id: id,
        comment: comment
      })
    });

    if(!res.ok){
      alert("Помилка сервера");
      return;
    }

    alert("Коментар збережено");

    renderDesigner();
  }

});

renderDesigner();


/* зміна статусу */

document.addEventListener("click", async function(e){

if(e.target.classList.contains("status-btn")){

const id = Number(e.target.dataset.id);
const newStatus = e.target.dataset.status;

await fetch("http://localhost:3000/requests/status", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    request_id: id,
    status: newStatus
  })
});

renderDesigner();

}

});


/* фільтр */

document.querySelectorAll(".filter-btn").forEach(btn => {

btn.addEventListener("click", () => {

document.querySelectorAll(".filter-btn")
.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

currentFilter = btn.dataset.filter;

renderDesigner();

});

});

});


const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});