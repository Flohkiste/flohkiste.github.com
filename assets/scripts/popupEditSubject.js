export function setupEditSubjectPopup(steuerung, faecherAnzeigen) {
  const editSubjectModal = document.getElementById("editSubjectModal");

  // Löschen-Button
  editSubjectModal.addEventListener("click", function (e) {
    if (e.target && e.target.id === "deleteSubjectBtn") {
      const titleElem = editSubjectModal.querySelector(".popup-title");
      const fachName = titleElem.textContent.replace(/^Halbjahresnoten - /, "");
      if (confirm(`Fach "${fachName}" wirklich löschen?`)) {
        const faecher = steuerung.getFaecher();
        const idx = faecher.findIndex((f) => f.name === fachName);
        if (idx !== -1) {
          steuerung.fachEntfernen(idx);
          steuerung.speichereFaecher();
          editSubjectModal.style.display = "none";
          setTimeout(faecherAnzeigen, 0);
        }
      }
    }
    // Speichern-Button
    if (e.target && e.target.id === "closeEditSubjectBtn") {
      const halbjahrCards = editSubjectModal.querySelectorAll("halbjahr-card");
      const neueNoten = [];
      const neueGewichtungen = [];
      halbjahrCards.forEach((card) => {
        const input = card.shadowRoot.querySelector(".halbjahr-input");
        let value = input.value.trim();
        neueNoten.push(
          value === "-" ? "-" : isNaN(Number(value)) ? "-" : Number(value)
        );
        neueGewichtungen.push(card.getAttribute("gewichtung") || "1");
      });

      const titleElem = editSubjectModal.querySelector(".popup-title");
      const fachName = titleElem.textContent.replace(/^Halbjahresnoten - /, "");
      const faecher = steuerung.getFaecher();
      const fach = faecher.find((f) => f.name === fachName);
      if (fach) {
        fach.halbjahre = neueNoten;
        fach.gewichtungHalbjahre = neueGewichtungen.map(Number);
        steuerung.speichereFaecher();
      }

      editSubjectModal.style.display = "none";
      setTimeout(faecherAnzeigen, 0);
    }
    // Abbrechen-Button
    if (e.target && e.target.id === "cancelEditSubjectBtn") {
      editSubjectModal.style.display = "none";
    }
  });
}
