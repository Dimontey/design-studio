const form = document.getElementById("loginForm");
const errorText = document.getElementById("error");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (res.status === 401) {
      errorText.textContent = "Invalid email or password";
      return;
    }

    const user = await res.json();

  
    // 🔹 зберігаємо сесію
    localStorage.setItem("currentUser", JSON.stringify(user));

    // 🔹 редірект
    if (user.role === "client") {
      window.location.href = "cabinet.html";
    } else if (user.role === "designer") {
      window.location.href = "designer.html";
    } else if (user.role === "admin") {
      window.location.href = "admin.html";
    }

  } catch (err) {
    console.error(err);
    errorText.textContent = "Server error";
  }
});