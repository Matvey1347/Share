const modal = document.querySelector(".copied_modal");

const copies = document.querySelectorAll("[data-copy]");
copies.forEach((copy) => {
   const clipboard = new ClipboardJS(copy, {
      text: function () {
         // Получаем значение атрибута data-copy
         const dataCopy = copy.getAttribute("data-copy");

         // Если data-copy имеет значение, копируем его
         if (dataCopy) {
            return dataCopy;
         }

         // Если data-copy пустой, копируем содержимое элемента
         let text = copy.textContent.trim();

         // Удаляем все <br> теги
         text = text.replace(/<br\s*\/?>/gi, "");

         return text;
      },
   });

   clipboard.on("success", function (e) {
      console.log("Текст успешно скопирован: " + e.text);
      e.clearSelection();

      // Добавляем класс _show к модальному окну
      modal.classList.add("_show");

      // Убираем класс _show через 2 секунды
      setTimeout(() => {
         modal.classList.remove("_show");
      }, 2000);
   });

   clipboard.on("error", function (e) {
      console.error("Ошибка при копировании");
   });
});
