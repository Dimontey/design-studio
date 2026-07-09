document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("requestForm");

  form.addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("reqName");
    const phone = document.getElementById("reqPhone");
    const type = document.getElementById("reqType");
    const description = document.getElementById("reqDesc");

    let isValid = true;

    // очистка помилок
    document.querySelectorAll(".error").forEach(el => el.remove());
    document.querySelectorAll(".input-error").forEach(el => {
      el.classList.remove("input-error");
    });

    // ІМ'Я
    if(!name.value.trim()){
      showError(name, "Введіть ім'я");
      isValid = false;
    }

    // ТЕЛЕФОН
    const phonePattern = /^\+380\d{9}$/;

    if(!phone.value.trim()){
      showError(phone, "Введіть телефон");
      isValid = false;
    } else if(!phonePattern.test(phone.value)){
      showError(phone, "Формат: +380XXXXXXXXX");
      isValid = false;
    }

    // ТИП
    if(!type.value){
      showError(type, "Оберіть тип квартири");
      isValid = false;
    }

    // ОПИС
    if(!description.value.trim()){
      showError(description, "Опишіть проєкт");
      isValid = false;
    }

    if(!isValid) return;

    const requests = JSON.parse(localStorage.getItem("requests")) || [];

const newRequest = {
  id: Date.now(),
  userEmail: "guest", // або currentUser.email якщо буде логін
  type: type.value,
  description: description.value,
  status: "new",
  date: new Date().toLocaleDateString(),
  phone: phone.value,
  name: name.value
};

requests.push(newRequest);

localStorage.setItem("requests", JSON.stringify(requests));

    window.location.href = "cabinet.html";

    form.reset();
  });

  function showError(input, message){

    input.classList.add("input-error");

    const error = document.createElement("div");
    error.className = "error";
    error.textContent = message;

    input.parentElement.appendChild(error);
  }

});
