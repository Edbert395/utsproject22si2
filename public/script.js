function showRegister() {
    document.getElementById("register-container").classList.remove("hidden");
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("task-container").classList.add("hidden");
  }
  
  function showLogin() {
    document.getElementById("register-container").classList.add("hidden");
    document.getElementById("login-container").classList.remove("hidden");
    document.getElementById("task-container").classList.add("hidden");
  }
  
  function showTaskApp() {
    document.getElementById("register-container").classList.add("hidden");
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("task-container").classList.remove("hidden");
    filterTasks();
  }
  
  function registerUser() {
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;
  
    fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("Registrasi berhasil!");
          showTaskApp();
        } else {
          alert("Maaf, Registrasi gagal! Silakan Coba Lagi. " + (data.message || ""));
        }
      })
      .catch(err => {
        console.error("Error saat registrasi:", err);
        alert("Registrasi gagal!");
      });
  }
  
  function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
  
    fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => {
        console.log("Data login:", data);
        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("Login berhasil!");
          showTaskApp();
        } else {
          alert("Maaf Login gagal! Mungkin ada kesalahan, silakan cek kembali. " + (data.message || ""));
        }
      })
      .catch(err => {
        console.error("Error saat login:", err);
        alert("Login gagal!");
      });
  }
  
  function logout() {
    localStorage.removeItem("token");
    alert("Klik OK untuk menyetujui Logout");
    showLogin();
  }
  
  function filterTasks() {
    const token = localStorage.getItem("token");
    const category = document.getElementById("filter").value;
  
    fetch("/tasks", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(response => response.json())
      .then(tasks => {
        if (category) {
          tasks = tasks.filter(task => task.category === category);
        }
        const list = document.getElementById("task-list");
        list.innerHTML = "";
        tasks.forEach(task => {
          const row = document.createElement("tr");
  
          row.innerHTML = `
          <td>${task.title}</td>
          <td>${task.category}</td>
          <td>${task.deadline}</td>
          <td>${task.status}</td>
          <td>
            <button onclick="editTask('${task.id}')">
            <i class="fa-solid fa-pen-to-square" style="color:rgb(0, 0, 0);"></i>
            </button>
            <button onclick="deleteTask('${task.id}')">
            <i class="fa-solid fa-trash" style="color: #fa3e00;"></i>
            </button>
          </td>
        `;
          list.appendChild(row);
        });
      })
      .catch(err => console.error("Gagal mengambil tugas:", err));
  }
  
  
  function addTask() {
    const token = localStorage.getItem("token");
    const title = document.getElementById("task-title").value;
    const category = document.getElementById("task-category").value;
    const deadline = document.getElementById("task-deadline").value;
  
    if (!title || !category || !deadline) {
      return alert("Semua field harus diisi!");
    }
  
    fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        title,
        category,
        deadline,
        status: "Belum Selesai"
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("Tugas berhasil ditambahkan:", data);
        alert("Tugas berhasil ditambahkan!");
        filterTasks();
      })
      .catch(err => console.error("Gagal menambahkan tugas:", err));
  }
  
  let currentTaskId = null;
  
  function editTask(taskId) {
    currentTaskId = taskId;
    document.getElementById("editModal").style.display = "block";
  }
  
  document.getElementById("editForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    const newTitle = document.getElementById("newTitle").value;
    const newCategory = document.getElementById("newCategory").value;
    const newDeadline = document.getElementById("newDeadline").value; 
    const newStatus = document.getElementById("newStatus").checked ? "Selesai" : "Belum Selesai";
  
    fetch(`/tasks/${currentTaskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        title: newTitle,
        category: newCategory,
        deadline: newDeadline, 
        status: newStatus
      })
    })
      .then(response => response.json())
      .then(data => {
        alert("Tugas berhasil diupdate!");
        closeModal();
        filterTasks();
      })
      .catch(err => console.error("Gagal memperbarui tugas:", err));
  });
  
  function closeModal() {
    document.getElementById("editModal").style.display = "none";
    document.getElementById("editForm").reset();
  }
  
  
  function deleteTask(taskId) {
    const token = localStorage.getItem("token");
    if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      fetch(`/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      })
        .then(() => {
          alert("Tugas berhasil dihapus!");
          filterTasks();
        })
        .catch(err => console.error("Gagal menghapus tugas:", err));
    }
  }
  
  window.onload = function () {
    if (localStorage.getItem("token")) {
      showTaskApp();
    } else {
      showRegister();
    }
  };
  
  const socket = new WebSocket("ws://localhost:8080");
  socket.onmessage = (event) => {
    console.log("Pesan dari server:", event.data);
  };