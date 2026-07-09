document.addEventListener("DOMContentLoaded", () => {

const tbody = document.getElementById("calendarBody");

const projects = JSON.parse(localStorage.getItem("projects")) || [];

if(!projects.length){
tbody.innerHTML = `<tr><td colspan="4">Немає запланованих проєктів</td></tr>`;
return;
}

/* сортуємо по даті */

projects.sort((a, b) => {

  const dateA = new Date(a.deadline);
  const dateB = new Date(b.deadline);

  if (isNaN(dateA)) return 1;
  if (isNaN(dateB)) return -1;

  return dateA - dateB;

});

tbody.innerHTML = projects.map(project => {

  const isLate = new Date(project.deadline) < new Date();

  return `
<tr class="${isLate ? 'late' : ''}">
<td>${project.deadline}</td>
<td>${project.title}</td>
<td>${project.client}</td>
<td>${project.stage}</td>
</tr>
`;

}).join("");

});