/* ========================= MAIN SCRIPT ========================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ========================= UPDATE SECTION ========================= */
  const titles = document.querySelectorAll(".title");
  const titleInput = document.getElementById("titleInput");
  const endTimeInput = document.getElementById("endTimeInput");
  const todoIdInput = document.getElementById("todo_id");
  const submitBtn = document.getElementById("submitBtn");

  titles.forEach((title) => {
    title.addEventListener("click", () => {
      const id = title.dataset.id;
      const taskTitle = title.dataset.title;
      const endTime = title.dataset.endtime;

      titleInput.value = taskTitle;
      endTimeInput.value = endTime;
      todoIdInput.value = id;

      submitBtn.textContent = "✏️ Update";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ========================= CLEAR FORM SECTION ========================= */
  const clearBtn = document.getElementById("clearBtn");
  const todoForm = document.getElementById("todoForm");

  clearBtn.addEventListener("click", () => {
    // keep datetime if you want
    const savedDateTime = endTimeInput.value;

    todoForm.reset();
    endTimeInput.value = savedDateTime;

    todoIdInput.value = "";
    submitBtn.innerHTML = "➕ Add";
  });

  /* ========================= COUNTDOWN TIMER ========================= */
  const deadlines = document.querySelectorAll(".deadline");

  function updateCountdown() {
    deadlines.forEach((deadline) => {
      const endTime = new Date(deadline.dataset.endtime).getTime();
      const now = new Date().getTime();
      const diff = endTime - now;

      const daysEl = deadline.querySelector(".days");
      const hoursEl = deadline.querySelector(".hours");
      const minutesEl = deadline.querySelector(".minutes");
      const secondsEl = deadline.querySelector(".seconds");

      if (diff <= 0) {
        daysEl.textContent = 0;
        hoursEl.textContent = 0;
        minutesEl.textContent = 0;
        secondsEl.textContent = 0;
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = days;
      hoursEl.textContent = hours;
      minutesEl.textContent = minutes;
      secondsEl.textContent = seconds;
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ========================= TOAST AUTO HIDE ========================= */
  const toasts = document.querySelectorAll(".toast");
  toasts.forEach((toast) => {
    setTimeout(() => toast.classList.add("hide"), 2000);
  });

  /* ========================= THEME TOGGLE ========================= */
  const themeSwitch = document.getElementById("themeSwitch");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    themeSwitch.checked = true;
  }

  themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
      body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  /* ========================= SET DEFAULT DATETIME (only when ADD mode) ========================= */
  // ✅ update mode এ datetime overwrite করবে না
  if (todoIdInput.value.trim() === "") {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    endTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /* ========================= LIVE SEARCH (NO RELOAD) ========================= */
  const items = document.querySelectorAll(".show-part");

  titleInput.addEventListener("input", () => {
    // ✅ update mode → search off
    if (todoIdInput.value.trim() !== "") return;

    const q = titleInput.value.toLowerCase().trim();

    items.forEach((item) => {
      const t = item.querySelector(".title").innerText.toLowerCase();
      item.style.display = t.includes(q) ? "flex" : "none";
    });
  });

  /* ========================= FORM SUBMIT VALIDATION ========================= */
  todoForm.addEventListener("submit", (e) => {
    const title = titleInput.value.trim();
    const endTime = endTimeInput.value;

    if (!title || !endTime) {
      e.preventDefault();
      alert("Title and End time are required");
    }
  });

});
