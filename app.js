document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll("[data-faq-item]");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    item.addEventListener("click", () => {
      // убрать _active у всех
      faqItems.forEach((el) => el.classList.remove("_active"));

      // добавить _active только выбранному
      item.classList.add("_active");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-show-modal");
  const modal = document.querySelector(".coming_soon");

  if (!btn || !modal) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("_show");

    setTimeout(() => {
      modal.classList.remove("_show");
    }, 3000); // 3000ms = 3 секунды
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const btn = document.querySelector(".header__open_btn");

  if (!header || !btn) return;

  // Открытие / закрытие при клике на кнопку
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // чтобы не сработал общий клик по документу
    header.classList.toggle("_open");
  });

  // Клик по самому header — закрыть
  header.addEventListener("click", (e) => {
    if (header.classList.contains("_open")) {
      header.classList.remove("_open");
    }
  });

  // Клик вне header — закрыть
  document.addEventListener("click", (e) => {
    if (
      header.classList.contains("_open") &&
      !header.contains(e.target) &&
      e.target !== btn
    ) {
      header.classList.remove("_open");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  const analyzeBtn = document.querySelector(".analyze");
  const fileInput = document.querySelector("#file");
  const chatImage = document.querySelector(".chat__image");
  const objectInput = document.querySelector(".input");
  const inputField = document.querySelector(".input");

  const waitingDiv = document.querySelector(".waiting");
  const chatResult = document.querySelector(".chat__result");
  const startImage = document.querySelector(".start");
  const domain =
    window.location.hostname === "localhost" ? "http://localhost:8000" : "";

  if (analyzeBtn)
    analyzeBtn.addEventListener("click", async () => {
      if (!fileInput.files || !fileInput.files[0]) {
        alert("Please select a file first");
        return;
      }

      // Show analyzing state
      form.classList.add("none");
      startImage.classList.add("none");
      chatResult.classList.remove("none");
      waitingDiv.classList.remove("none");

      const formData = new FormData();
      formData.append("image", fileInput.files[0]);
      formData.append("tags", objectInput.value || "");

      try {
        const response = await fetch(`${domain}/api/generate_yolo`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.gen_id) {
          const checkStatus = async () => {
            const statusResponse = await fetch(
              `${domain}/api/status/${data.gen_id}`,
            );
            const statusData = await statusResponse.json();

            if (statusData.status === "completed") {
              const imageResponse = await fetch(`${domain}/api/commonYOLO`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ident: data.gen_id }),
              });
              const responseData = await imageResponse.json();

              // Hide analyzing state and show result
              chatResult.classList.add("none");
              waitingDiv.classList.add("none");
              startImage.classList.remove("none");
              startImage.src = domain + responseData.url;
              form.classList.remove("none");
            } else if (statusData.status === "failed") {
              alert("Detection failed");
              // Reset UI state
              chatResult.classList.add("none");
              waitingDiv.classList.add("none");
              startImage.classList.remove("none");
            } else {
              setTimeout(checkStatus, 1000);
            }
          };

          checkStatus();
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during detection");
        // Reset UI state
        chatResult.classList.add("none");
        waitingDiv.classList.add("none");
        startImage.classList.remove("none");
      }
    });

  if (inputField)
    inputField.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        // Проверяем, что нажата клавиша Enter
        event.preventDefault(); // Отменяем стандартное действие (отправку формы)
        if (inputField.value.trim() !== "") {
          // Проверяем, что поле не пустое
          inputField.classList.remove("error"); // Убираем класс ошибки, если он был
          performAnalysis();
        } else {
          inputField.classList.add("error"); // Добавляем класс ошибки
        }
      }
    });
});

const lineActive = document.querySelector(".line-active");
const lineDef = document.querySelector(".line-def");

window.addEventListener("scroll", () => {
  if (!lineDef) return;
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  const lineDefOffset = lineDef.getBoundingClientRect().top + scrollTop;

  if (scrollTop + windowHeight >= lineDefOffset) {
    const progress =
      (scrollTop + windowHeight - lineDefOffset) / (docHeight - lineDefOffset);

    lineActive.style.height = `${Math.min(progress * 100, 100)}%`;
  }
});

const fileInput = document.getElementById("file");
const previewImage = document.getElementById("preview");

// Слушаем событие изменения файла
if (fileInput)
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0]; // Получаем загруженный файл

    if (file) {
      const reader = new FileReader(); // Создаем FileReader для чтения файла

      // Когда файл будет прочитан
      reader.onload = (e) => {
        previewImage.src = e.target.result; // Устанавливаем загруженное изображение как src
        previewImage.classList.remove("start"); // Убираем класс 'start'
      };

      reader.readAsDataURL(file); // Читаем файл как Data URL
    }
  });
