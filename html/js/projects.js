document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("projectsList");

  if (!container) return;

  // отримуємо проєкти
  const projects = JSON.parse(localStorage.getItem("projects")) || [];

  function renderProjects() {

    if (!projects.length) {
      container.innerHTML = `<p class="empty">Наразі немає активних проєктів</p>`;
      return;
    }

    container.innerHTML = projects.map((project, index) => `
  
  <div class="request-card">

    <div class="request-card__top">
      <h4>${project.title}</h4>
      <span class="status">${project.stage}</span>
    </div>

    <p class="request-card__desc">
      Клієнт: ${project.client}
    </p>

    <div class="request-card__bottom">
      <small>Дедлайн: ${project.deadline}</small>

      <button onclick="editProject(${index})" class="button">
        Редагувати
      </button>
    </div>

  </div>

`).join("");

  }

  renderProjects();

});

let currentProjectIndex = null;

function editProject(index){

const projects = JSON.parse(localStorage.getItem("projects")) || [];

currentProjectIndex = index;

document.getElementById("editDeadline").value = projects[index].deadline;
document.getElementById("editStage").value = projects[index].stage;

document.getElementById("editModal").style.display = "flex";

}

function saveProject(){

const projects = JSON.parse(localStorage.getItem("projects")) || [];

projects[currentProjectIndex].deadline =
document.getElementById("editDeadline").value;

projects[currentProjectIndex].stage =
document.getElementById("editStage").value;

localStorage.setItem("projects", JSON.stringify(projects));

closeModal();

location.reload();

}

function closeModal(){
document.getElementById("editModal").style.display = "none";
}

window.onclick = function(event){

const modal = document.getElementById("editModal");

if(event.target === modal){
modal.style.display = "none";
}

}