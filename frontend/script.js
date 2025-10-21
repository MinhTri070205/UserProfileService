const API_URL = "http://localhost:5074/api/UserProfile"; // ⚠️ Sửa port nếu backend khác

// Lấy các phần tử HTML
const userForm = document.getElementById("userForm");
const userIdInput = document.getElementById("userId");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const vehicleInput = document.getElementById("vehicle");
const walletBalanceInput = document.getElementById("walletBalance");
const userTableBody = document.getElementById("userTableBody");
const messageDiv = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const refreshBtn = document.getElementById("refreshBtn");

// 🧾 Thêm hoặc cập nhật người dùng
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    phoneNumber: phoneInput.value.trim(),
    vehicleNumber: vehicleInput.value.trim(),
    walletBalance: parseFloat(walletBalanceInput.value || 0)
  };

  try {
    if (userIdInput.value) {
      // PUT (Cập nhật)
      const id = userIdInput.value;
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      showMessage("✅ Cập nhật người dùng thành công!", "green");
    } else {
      // POST (Thêm mới)
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Thêm người dùng thất bại");
      showMessage("✅ Thêm người dùng thành công!", "green");
    }

    resetForm();
    loadUsers();
  } catch (err) {
    showMessage(err.message || "❌ Lỗi không xác định!", "red");
    console.error(err);
  }
});

// 🧹 Làm mới form
resetBtn.addEventListener("click", resetForm);
refreshBtn.addEventListener("click", loadUsers);

// 🧽 Hàm reset form
function resetForm() {
  userIdInput.value = "";
  fullNameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  vehicleInput.value = "";
  walletBalanceInput.value = "";
  saveBtn.textContent = "Thêm người dùng";
}

// 🧠 Hiển thị thông báo
function showMessage(text, color = "black") {
  messageDiv.textContent = text;
  messageDiv.style.color = color;
  setTimeout(() => (messageDiv.textContent = ""), 3000);
}

// 📋 Tải danh sách người dùng
async function loadUsers() {
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    userTableBody.innerHTML = "";

    if (!users.length) {
      userTableBody.innerHTML = `<tr><td colspan="6">Không có dữ liệu</td></tr>`;
      return;
    }

    users.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${escapeHtml(u.fullName)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.phoneNumber || "-")}</td>
        <td>${escapeHtml(u.vehicleNumber || "-")}</td>
        <td>${u.walletBalance ?? 0}</td>
        <td>
          <button onclick="onEdit(${u.id})">Sửa</button>
          <button onclick="onDelete(${u.id})">Xóa</button>
        </td>
      `;
      userTableBody.appendChild(tr);
    });
  } catch (err) {
    showMessage("❌ Không tải được danh sách (kiểm tra backend hoặc CORS)", "red");
    console.error(err);
  }
}

// ✏️ Hàm sửa người dùng
window.onEdit = async function (id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
      showMessage("❌ Không tìm thấy người dùng!", "red");
      return;
    }

    const u = await res.json();
    userIdInput.value = u.id;
    fullNameInput.value = u.fullName || "";
    emailInput.value = u.email || "";
    phoneInput.value = u.phoneNumber || "";
    vehicleInput.value = u.vehicleNumber || "";
    walletBalanceInput.value = u.walletBalance || 0;
    saveBtn.textContent = "Cập nhật người dùng";

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    showMessage("❌ Lỗi khi tải người dùng!", "red");
    console.error(err);
  }
};

// 🗑️ Hàm xóa người dùng
window.onDelete = async function (id) {
  if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.status === 204 || res.ok) {
      showMessage("🗑️ Xóa người dùng thành công!", "green");
      loadUsers();
    } else {
      showMessage("❌ Xóa thất bại!", "red");
    }
  } catch (err) {
    showMessage("❌ Lỗi khi xóa người dùng!", "red");
    console.error(err);
  }
};

// 🔒 Chống XSS
function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// 🚀 Khi load trang thì tải danh sách ngay
loadUsers();
