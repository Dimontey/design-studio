const swiper = new Swiper('.swiper', {
	mousewheel: true,
	direction: 'vertical',
	speed: 1700,
	parallax: true
})

document.querySelectorAll('.header-content h1').forEach(e => {
	e.innerHTML = e.textContent.replace(/ (-|#|@){1}/g, s => s[1]+s[0]).replace(/(\S*)/g, m => {
		return m.replace(/\S(-|#|@)?/g, '<span class="letter">$&</span>')
	})
	e.querySelectorAll('.letter').forEach(function(l, i) {
		l.setAttribute('style', `z-index: -${ i }; transition-duration: ${ i/5 + 1 }s`)
	})
})

swiper.on('slideChange', function() {
	document.querySelectorAll('.header-content__slide').forEach(function(e, i) {
		return swiper.activeIndex === i ? e.classList.add('active') : e.classList.remove('active')
	})
})




const burger = document.querySelector(".submenu");
const menuWrapper = document.querySelector(".menu-wrapper");
const overlay = document.querySelector(".mobile-overlay");

if (burger && menuWrapper && overlay) {

  burger.addEventListener("click", () => {
    const isOpen = menuWrapper.classList.contains("active");
    isOpen ? closeMenu() : openMenu();
  });

  function openMenu() {
    burger.classList.add("active");
    menuWrapper.classList.add("active");
    overlay.classList.add("active");
  }

  function closeMenu() {
    burger.classList.remove("active");
    menuWrapper.classList.remove("active");
    overlay.classList.remove("active");
  }

  overlay.addEventListener("click", closeMenu);

  menuWrapper.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

}



/* ДОДАТКОВИЙ ФІКС: якщо змінюється hash — закриваємо меню */
window.addEventListener("hashchange", closeMenu);

document.querySelectorAll("#goRequest").forEach(btn => {
  btn.addEventListener("click", () => {
    window.location.href = "request.html";
  });
});


/* ===== ПРОСТИЙ SPA-РОУТИНГ ДЛЯ data-route ===== */
document.querySelectorAll("[data-route]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const targetId = link.getAttribute("href"); // "#portfolio"
    const target = document.querySelector(targetId);

    if (!target) return;

    // Ховаємо всі сторінки
    document.querySelectorAll(".view").forEach(section => {
      section.classList.add("hidden");
    });

    // Показуємо потрібну
    target.classList.remove("hidden");
  });
});

