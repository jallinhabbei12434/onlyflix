document.addEventListener("DOMContentLoaded", () => {
  function getStorage(name) {
    try {
      return localStorage.getItem(name) || sessionStorage.getItem(name);
    } catch (e) {
      console.error("Erro no storage:", e);
      return null;
    }
  }

  function showCustomAlert(msg, type = "error") {
    document.querySelectorAll(".custom-alert").forEach(el => el.remove());
    const alert = document.createElement("div");
    alert.className = `modal custom-alert ${type}-alert`;
    alert.style.display = "flex";
    alert.innerHTML = `
      <div class="modal-content alert-content">
        <div class="modal-header ${type}-header">
          <div class="alert-header-icon"><i class="fas fa-${type === "error" ? "exclamation-triangle" : "check-circle"}"></i></div>
          <h2>${type === "error" ? "Atenção" : "Sucesso!"}</h2>
        </div>
        <div class="modal-body alert-body">
          <p>${msg}</p>
          <button class="alert-btn ${type}-btn" onclick="this.closest('.modal').remove()">
            <i class="fas fa-check"></i> ENTENDI
          </button>
        </div>
      </div>`;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), type === "error" ? 6000 : 4000);
  }

  const tempUserData = getStorage("tempUserData");
  if (!tempUserData) {
    showCustomAlert("Acesso negado. Faça o cadastro primeiro.", "error");
    setTimeout(() => window.location.href = "index.html", 3000);
    return;
  }

  let userData = {};
  try {
    userData = JSON.parse(tempUserData);
  } catch {
    userData = { fullName: "Usuário", phone: "(11) 99999-9999" };
  }

  // Elementos
  const phoneInput = document.getElementById("phoneConfirm");
  const userName = document.getElementById("userName");
  const userPhone = document.getElementById("userPhone");
  const phoneDisplay = document.getElementById("phoneDisplay");
  const sendCodeBtn = document.getElementById("sendCodeBtn");
  const codeModal = document.getElementById("codeModal");
  const closeCodeModalBtn = document.getElementById("closeCodeModalBtn");
  const resendBtn = document.getElementById("resendBtn");
  const countdown = document.getElementById("countdown");
  const codeInputs = document.querySelectorAll(".code-digit");
  const verificationForm = document.getElementById("verificationForm");
  const verifyBtn = document.getElementById("verifyBtn");

  // Preencher dados
  if (userData.phone) {
    const firstName = userData.fullName.split(" ")[0];
    userName.textContent = firstName;
    userPhone.textContent = userData.phone;
    phoneInput.value = userData.phone;
    phoneDisplay.textContent = `+55 ${userData.phone}`;
  }

  // Enviar código
  sendCodeBtn.addEventListener("click", () => {
    const phone = phoneInput.value;
    sendCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    sendCodeBtn.disabled = true;

    fetch("https://n8n-n8n.mkiyhs.easypanel.host/webhook-test/756366b6-1af3-4ccc-89fd-abbbf25123ec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telefone: phone })
    }).finally(() => {
      sendCodeBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ENVIAR CÓDIGO SMS';
      sendCodeBtn.disabled = false;
      codeModal.style.display = "flex";
      startCountdown();
      document.querySelector(".code-digit").focus();
      showCustomAlert("Código SMS enviado com sucesso!", "success");
    });
  });

  // Fechar modal
  closeCodeModalBtn.addEventListener("click", () => codeModal.style.display = "none");
  codeModal.addEventListener("click", e => {
    if (e.target === codeModal) codeModal.style.display = "none";
  });

  // Inputs de código
  codeInputs.forEach((input, index) => {
    input.addEventListener("input", e => {
      if (!/^\d$/.test(e.target.value)) e.target.value = "";
      if (e.target.value && index < 5) codeInputs[index + 1].focus();
      checkCode();
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Backspace" && !input.value && index > 0) codeInputs[index - 1].focus();
    });
    input.addEventListener("paste", e => {
      e.preventDefault();
      const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      paste.split("").forEach((digit, i) => codeInputs[i] && (codeInputs[i].value = digit));
      checkCode();
    });
  });

  function checkCode() {
    const code = Array.from(codeInputs).map(i => i.value).join("");
    if (code.length === 6) {
      verifyBtn.classList.add("ready");
      verifyBtn.disabled = false;
    } else {
      verifyBtn.classList.remove("ready");
      verifyBtn.disabled = true;
    }
  }

  // Verificar código
  verificationForm.addEventListener("submit", async e => {
    e.preventDefault();
    const code = Array.from(codeInputs).map(i => i.value).join("");
    if (code.length !== 6) return showCustomAlert("Digite os 6 dígitos.", "error");

    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    verifyBtn.disabled = true;

    try {
      const res = await fetch("https://n8n-n8n.mkiyhs.easypanel.host/webhook-test/01a07de5-1b66-4373-8e53-96ef782d0b5e", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();

      if (data.validado === true) {
        codeModal.style.display = "none";
        showSuccessModal();
      } else {
        showCustomAlert("Código inválido ou expirado.", "error");
        verifyBtn.innerHTML = 'VERIFICAR CÓDIGO';
        verifyBtn.disabled = false;
      }
    } catch (err) {
      console.error(err);
      showCustomAlert("Erro na verificação. Tente novamente.", "error");
      verifyBtn.innerHTML = 'VERIFICAR CÓDIGO';
      verifyBtn.disabled = false;
    }
  });

  function startCountdown() {
    let count = 70;
    resendBtn.disabled = true;
    countdown.textContent = count;
    const interval = setInterval(() => {
      count--;
      countdown.textContent = count;
      if (count <= 0) {
        clearInterval(interval);
        resendBtn.disabled = false;
        resendBtn.innerHTML = '<i class="fas fa-redo"></i> Reenviar código';
      }
    }, 1000);
  }

  resendBtn.addEventListener("click", () => {
    if (!resendBtn.disabled) sendCodeBtn.click();
  });

  function showSuccessModal() {
    const modal = document.getElementById("successModal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.style.display = "none";
        window.location.href = "dashboard.html";
      }, 4000);
    }
  }
});
