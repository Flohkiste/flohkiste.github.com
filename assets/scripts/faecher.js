const steuerung = new Steuerung();

const modal = document.getElementById("addSubjectModal");
const openBtn = document.querySelector(".scroller button");
const closeBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelSubjectBtn");
const saveBtn = document.getElementById("saveSubjectBtn");
const input = document.getElementById("subjectNameInput");

// Fächer anzeigen
function faecherAnzeigen() {
  const container = document.getElementById("faecherContainer");
  container.innerHTML = ""; // alle alten Cards entfernen
  steuerung.getFaecher().forEach((fach, index) => {
    const card = document.createElement("faecher-card");
    card.setAttribute("titel", fach.name);
    card.setAttribute("noten", JSON.stringify(fach.halbjahre ?? []));
    card.style.cursor = "pointer";
    card.onclick = () => openEditSubjectModal(index); // Index mitgeben, falls du später Daten laden willst
    container.appendChild(card);
  });
}

// Popup-Logik
openBtn.onclick = () => {
  modal.style.display = "block";
  input.value = "";
  input.focus();
};
closeBtn.onclick = cancelBtn.onclick = () => {
  modal.style.display = "none";
};
saveBtn.onclick = () => {
  const name = input.value.trim();
  if (
    name &&
    steuerung
      .getFaecher()
      .every((fach) => fach.name.toLowerCase() !== name.toLowerCase())
  ) {
    steuerung.fachHinzufuegen(name, 1, []);
    modal.style.display = "none";
    setTimeout(faecherAnzeigen, 0); // Anzeige nach dem Schließen aktualisieren
  } else {
    alert("Fachname ist ungültig oder bereits vorhanden.");
    input.focus();
  }
};
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

const editSubjectModal = document.getElementById("editSubjectModal");
const closeEditSubjectBtn = document.getElementById("closeEditSubjectBtn");

function openEditSubjectModal(index) {
  const fach = steuerung.getFaecher()[index];
  editSubjectModal.style.display = "block";
  // Titel dynamisch setzen
  const titleElem = editSubjectModal.querySelector(".popup-title");
  if (titleElem && fach) {
    titleElem.textContent = `Halbjahresnoten - ${fach.name}`;
  }

  // Halbjahresnoten dynamisch einfügen
  const halbjahreList = editSubjectModal.querySelector(".halbjahre-list");
  halbjahreList.innerHTML = ""; // Vorherige Noten entfernen

  // Annahme: fach.halbjahre ist ein Array mit Noten (z.B. [6, 7, 3, "-"])
  // Falls nicht vorhanden, 4 leere Halbjahre anzeigen
  const halbjahre =
    fach.halbjahre && fach.halbjahre.length
      ? fach.halbjahre
      : ["-", "-", "-", "-"];

  halbjahre.forEach((note, i) => {
    const card = document.createElement("halbjahr-card");
    card.setAttribute("halbjahr", `${i + 1}. Halbjahr`);
    card.setAttribute(
      "schnitt",
      note !== undefined && note !== null && note !== "" ? note : "-"
    );
    // Gewichtung aus dem Fach übernehmen, sonst "1"
    const gewichtung =
      fach.gewichtungHalbjahre && fach.gewichtungHalbjahre[i] !== undefined
        ? String(fach.gewichtungHalbjahre[i])
        : "1";
    card.setAttribute("gewichtung", gewichtung);
    halbjahreList.appendChild(card);
  });

  // === Event-Listener für Löschen-Button jedes Mal neu setzen ===
  const deleteSubjectBtn = document.getElementById("deleteSubjectBtn");
  if (deleteSubjectBtn) {
    deleteSubjectBtn.onclick = () => {
      const titleElem = editSubjectModal.querySelector(".popup-title");
      const fachName = titleElem.textContent.replace(/^Halbjahresnoten - /, "");
      if (confirm(`Fach "${fachName}" wirklich löschen?`)) {
        const faecher = steuerung.getFaecher();
        const index = faecher.findIndex((f) => f.name === fachName);
        if (index !== -1) {
          steuerung.fachEntfernen(index);
          steuerung.speichereFaecher();
          editSubjectModal.style.display = "none";
          setTimeout(faecherAnzeigen, 0);
        }
      }
    };
  }
}

closeEditSubjectBtn.onclick = () => {
  // Noten und Gewichtungen auslesen
  const halbjahrCards = editSubjectModal.querySelectorAll("halbjahr-card");
  const neueNoten = [];
  const neueGewichtungen = [];
  halbjahrCards.forEach((card) => {
    const input = card.shadowRoot.querySelector(".halbjahr-input");
    let value = input.value.trim();
    neueNoten.push(
      value === "-" ? "-" : isNaN(Number(value)) ? "-" : Number(value)
    );
    // Gewichtung aus Attribut lesen
    neueGewichtungen.push(card.getAttribute("gewichtung") || "1");
  });

  // Aktuelles Fach aktualisieren
  const titleElem = editSubjectModal.querySelector(".popup-title");
  const fachName = titleElem.textContent.replace(/^Halbjahresnoten - /, "");
  const faecher = steuerung.getFaecher();
  const fach = faecher.find((f) => f.name === fachName);
  if (fach) {
    fach.halbjahre = neueNoten;
    fach.gewichtungHalbjahre = neueGewichtungen.map(Number); // als Zahlen speichern
    steuerung.speichereFaecher();
  }

  editSubjectModal.style.display = "none";
  setTimeout(faecherAnzeigen, 0); // Anzeige aktualisieren
};

window.onclick = (event) => {
  // Modal für Fach hinzufügen
  if (event.target === modal) {
    modal.style.display = "none";
  }
  // Modal für Halbjahre bearbeiten
  if (event.target === editSubjectModal) {
    editSubjectModal.style.display = "none";
  }
};

const cancelEditSubjectBtn = document.getElementById("cancelEditSubjectBtn");
if (cancelEditSubjectBtn) {
  cancelEditSubjectBtn.onclick = () => {
    editSubjectModal.style.display = "none";
  };
}

const deleteSubjectBtn = document.getElementById("deleteSubjectBtn");
if (deleteSubjectBtn) {
  deleteSubjectBtn.onclick = () => {
    const titleElem = editSubjectModal.querySelector(".popup-title");
    const fachName = titleElem.textContent.replace(/^Halbjahresnoten - /, "");
    if (confirm(`Fach "${fachName}" wirklich löschen?`)) {
      const faecher = steuerung.getFaecher();
      const index = faecher.findIndex((f) => f.name === fachName);
      if (index !== -1) {
        steuerung.fachEntfernen(index);
        steuerung.speichereFaecher();
        editSubjectModal.style.display = "none";
        setTimeout(faecherAnzeigen, 0);
      }
    }
  };
}

faecherAnzeigen();
