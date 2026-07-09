document.addEventListener("DOMContentLoaded", async () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "login.html";
    return;
  }

  await loadUsers();
await loadDesigners();
await loadRequests();

});


// ================= USERS =================
async function loadUsers() {
  try {
    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    const container = document.getElementById("usersList");

    if (!users.length) {
      container.innerHTML = "<p class='empty'>Немає користувачів</p>";
      return;
    }

    container.innerHTML = users.map(user => `
      <div class="request-card">

        <div class="request-card__top">
          <h4>${user.name}</h4>
          <span>${user.role}</span>
        </div>

        <p>${user.email}</p>

        ${user.role === "designer" ? `
          <button class="delete-user button" data-id="${user.id}">
            Видалити дизайнера
          </button>
        ` : ""}

      </div>
    `).join("");

  } catch (err) {
    console.error("Помилка users:", err);
  }
}

// ================= DESIGNERS =================

let designers = [];

async function loadDesigners() {

  const res = await fetch("http://localhost:3000/users");
  const users = await res.json();

  designers = users.filter(
    user => user.role === "designer"
  );

}


// ================= REQUESTS =================
async function loadRequests() {
  try {
    const res = await fetch("http://localhost:3000/requests");
    const requests = await res.json();

    const container = document.getElementById("requestsList");

    if (!requests.length) {
      container.innerHTML = "<p class='empty'>Немає заявок</p>";
      return;
    }

    container.innerHTML = requests.map(req => `
  <div class="request-card">

    <div class="request-card__top">
      <h4>${req.title}</h4>
      <span>${req.status}</span>
    </div>

    <p>${req.description}</p>

    <small>ID клієнта: ${req.client_id}</small>

    <p class="designer-info">
      Дизайнер:
      <strong>
        ${req.designer_name || "Не призначений"}
      </strong>
    </p>

    <div class="assign-block">

      <select 
        class="designer-select"
        data-id="${req.id}"
      >

        <option value="">
          Оберіть дизайнера
        </option>

        ${designers.map(designer => `
          <option 
            value="${designer.id}"

            ${req.designer_id == designer.id
              ? "selected"
              : ""
            }

          >
            ${designer.name}
          </option>
        `).join("")}

      </select>

    </div>

  </div>
    `).join("");

  } catch (err) {
    console.error("Помилка requests:", err);
  }
}


// ================= DELETE USER =================
document.addEventListener("click", async (e) => {

  if (e.target.classList.contains("delete-user")) {

    const id = e.target.dataset.id;

    if (!confirm("Видалити дизайнера?")) return;

    await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE"
    });

    loadUsers();
  }

});

document.addEventListener("change", async (e) => {

  if(e.target.classList.contains("designer-select")){

    const requestId = e.target.dataset.id;
    const designerId = e.target.value;

    await fetch("http://localhost:3000/requests/assign", {

      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        request_id: requestId,
        designer_id: designerId
      })

    });

    alert("Дизайнера призначено");

    loadRequests();

  }

});

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

const form = document.getElementById("addDesignerForm");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("designerName").value;
  const email = document.getElementById("designerEmail").value;
  const password = document.getElementById("designerPassword").value;

  await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role: "designer"
    })
  });

  form.reset();
  loadUsers();

  alert("Дизайнер доданий");
});

