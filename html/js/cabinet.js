console.log("CABINET JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const modal = document.getElementById("requestModal");
  const openBtn = document.getElementById("addTestRequest");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("requestForm");
  const container = document.getElementById("requestsList");

  function getStatusText(status) {
    if (status === "new") return "Нова";
    if (status === "in-progress") return "В роботі";
    if (status === "done") return "Завершена";
  }

  // =========================
  // 🔹 ЗАЯВКИ
  // =========================
  async function renderRequests() {
    const res = await fetch(`http://localhost:3000/requests/${currentUser.id}`);
    const myRequests = await res.json();

    if (!myRequests.length) {
      container.innerHTML = `<p class="empty">У вас ще немає заявок</p>`;
      return;
    }

    container.innerHTML = myRequests.map(req => `
      <div class="request-card">

        <div class="request-card__top">
          <h4>${req.title}</h4>
          <span class="status status-${req.status}">
            ${getStatusText(req.status)}
          </span>
        </div>

        <p class="request-card__desc">${req.description}</p>

        ${req.comment ? `
        <div class="client-comment">
          <strong>Коментар дизайнера:</strong>
          <p>${req.comment}</p>
        </div>
      ` : ""}

        <p>
  <strong>Ціна:</strong> 
  ${req.price ? req.price + " грн" : "Вираховується"}
</p>

        ${req.payment_status === "pending" ? `
          <button type="button" class="pay-btn" data-id="${req.id}">
            Оплатити
          </button>
        ` : `
          <span class="paid-label">✅ Оплачено</span>
        `}

        <div class="request-card__bottom">
          <small>ID: ${req.id}</small>
        </div>

      </div>
    `).join("");
  }

  // =========================
  // 🔹 ПРОЄКТИ
  // =========================
  function renderProjects() {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const container = document.getElementById("projectsList");

    if (!projects.length) {
      container.innerHTML = `<p class="empty">У вас ще немає проєктів</p>`;
      return;
    }

    container.innerHTML = projects.map(project => `
      <div class="request-card">
        <div class="request-card__top">
          <h4>${project.title}</h4>
          <span class="status">${project.stage}</span>
        </div>

        <p class="request-card__desc">
          Дедлайн: ${project.deadline}
        </p>
      </div>
    `).join("");
  }

  // =========================
  // 🔹 ОПЛАТА
  // =========================
  // 🔹 ОПЛАТА
document.addEventListener("click", async (e) => {

  const btn = e.target.closest(".pay-btn");

  if (btn) {

    console.log("CLICK PAY"); // перевірка

    e.preventDefault();
    e.stopPropagation();

    const id = btn.dataset.id;

    await fetch("http://localhost:3000/requests/pay", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ request_id: id })
    });

    renderRequests();
  }

});

  // =========================
  // 🔹 МОДАЛКА
  // =========================
  openBtn?.addEventListener("click", () => {
    modal.classList.add("active");
  });

  closeBtn?.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // =========================
  // 🔹 СТВОРЕННЯ ЗАЯВКИ
  // =========================
  form?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const type = document.getElementById("serviceType").value;
    const description = document.getElementById("projectDescription").value;

    await fetch("http://localhost:3000/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: currentUser.id,
        title: type,
        description
      })
    });

    modal.classList.remove("active");

    renderRequests();
    renderProjects();

    form.reset();
  });

  // =========================
  // 🔹 LOGOUT
  // =========================
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });

  // =========================
  // 🔹 INIT
  // =========================
  renderRequests();
  renderProjects();

});