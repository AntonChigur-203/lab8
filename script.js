window.addEventListener("DOMContentLoaded", function () {
    const closeBtn = window.document.getElementById("closePopupBtn");
    const companyInput = window.document.getElementById("userCompany");
    const emailInput = window.document.getElementById("userEmail");
    const endpoint = "https://formcarry.com/s/_-PrHKqKIoC";
    const fields = window.document.querySelectorAll(
        "#contactForm input, #contactForm textarea"
    );
    const form = window.document.getElementById("contactForm");
    const messageInput = window.document.getElementById("userMessage");
    const nameInput = window.document.getElementById("userName");
    const notice = window.document.getElementById("responseNotice");
    const openBtn = window.document.getElementById("openPopupBtn");
    const phoneInput = window.document.getElementById("userPhone");
    const popup = window.document.getElementById("contactPopup");
    const privacyInput = window.document.getElementById("privacyAgree");
    const sendBtn = window.document.getElementById("sendFormBtn");

    function clearNotice() {
        notice.textContent = "";
        notice.className = "notice-box";
    }

    function closePopup() {
        popup.classList.remove("is-visible");
        popup.setAttribute("aria-hidden", "true");
        clearNotice();
    }

    function openPopup() {
        popup.classList.add("is-visible");
        popup.setAttribute("aria-hidden", "false");
        clearNotice();
        if (window.location.hash !== "#contact") {
            window.history.pushState({popup: true}, "", "#contact");
        }
    }

    function resetDraft() {
        const storage = window.localStorage;
        storage.removeItem("contact_company");
        storage.removeItem("contact_email");
        storage.removeItem("contact_message");
        storage.removeItem("contact_name");
        storage.removeItem("contact_phone");
        storage.removeItem("contact_privacy");
        form.reset();
    }

    function restoreDraft() {
        const storage = window.localStorage;
        companyInput.value = storage.getItem("contact_company") || "";
        emailInput.value = storage.getItem("contact_email") || "";
        messageInput.value = storage.getItem("contact_message") || "";
        nameInput.value = storage.getItem("contact_name") || "";
        phoneInput.value = storage.getItem("contact_phone") || "";
        privacyInput.checked = storage.getItem("contact_privacy") === "true";
    }

    function saveDraft() {
        const storage = window.localStorage;
        storage.setItem("contact_company", companyInput.value);
        storage.setItem("contact_email", emailInput.value);
        storage.setItem("contact_message", messageInput.value);
        storage.setItem("contact_name", nameInput.value);
        storage.setItem("contact_phone", phoneInput.value);
        storage.setItem("contact_privacy", String(privacyInput.checked));
    }

    function showNotice(ok, text) {
        notice.textContent = text;
        if (ok) {
            notice.className = "notice-box is-ok";
        } else {
            notice.className = "notice-box is-fail";
        }
    }

    function submitContact(event) {
        const requestOptions = {
            body: JSON.stringify({
                company: companyInput.value,
                email: emailInput.value,
                message: messageInput.value,
                name: nameInput.value,
                phone: phoneInput.value,
                privacy: privacyInput.checked
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST"
        };
        event.preventDefault();
        sendBtn.disabled = true;
        showNotice(true, "Отправка сообщения...");
        window.fetch(endpoint, requestOptions).then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }
            return response.json();
        }).then(function () {
            resetDraft();
            showNotice(true, "Сообщение успешно отправлено!");
        }).catch(function () {
            showNotice(
                false,
                "Ошибка отправки. Проверьте соединение с интернетом."
            );
        }).finally(function () {
            sendBtn.disabled = false;
        });
    }

    openBtn.addEventListener("click", function () {
        openPopup();
    });

    closeBtn.addEventListener("click", function () {
        if (window.location.hash === "#contact") {
            window.history.back();
        } else {
            closePopup();
        }
    });

    popup.addEventListener("click", function (event) {
        if (event.target === popup) {
            if (window.location.hash === "#contact") {
                window.history.back();
            } else {
                closePopup();
            }
        }
    });

    window.addEventListener("popstate", function () {
        if (window.location.hash === "#contact") {
            openPopup();
        } else {
            closePopup();
        }
    });

    fields.forEach(function (field) {
        field.addEventListener("input", saveDraft);
        field.addEventListener("change", saveDraft);
    });

    form.addEventListener("submit", submitContact);

    restoreDraft();
    if (window.location.hash === "#contact") {
        openPopup();
    }
});