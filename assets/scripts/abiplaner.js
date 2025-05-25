import { setupAddSubjectPopup } from "./popupAddSubject.js";
import "/components/HalbjahrCard.js";
import "/components/FaecherCard.js";

console.log("Script geladen!");
const steuerung = new Steuerung();

// Update-Funktion global verfügbar machen
window.updateApp = function () {
  faecherAnzeigen();
  updateSummary();
};

function update() {
  window.updateApp();
}

function faecherAnzeigen() {
  const container = document.getElementById("faecherContainer");
  container.innerHTML = "";
  steuerung.getFaecher().forEach((fach, index) => {
    const card = document.createElement("faecher-card");
    card.setAttribute("titel", fach.name);
    card.setAttribute("noten", JSON.stringify(fach.halbjahre ?? []));
    card.setAttribute("calcnoten", JSON.stringify(fach.getHalbjahre() ?? []));
    card.style.cursor = "pointer";
    card.onclick = () => openEditSubjectModal(index);

    // Event Listener für Update (Custom Event von FaecherCard)
    card.addEventListener("noteChanged", () => {
      console.log("noteChanged event received");
      update();
    });

    container.appendChild(card);
  });
}

function updateSummary() {
  console.log("updateSummary called");
  const block1Elem = document.getElementById("block1Sum");
  if (!block1Elem) {
    console.error("block1Sum element not found");
    return;
  }

  const pointSumBlock1 = block1Elem.getElementsByClassName(
    "block-summary-points"
  )[0];
  const avgElem = block1Elem.getElementsByClassName("block-summary-avg")[0];

  if (!pointSumBlock1 || !avgElem) {
    console.error("Summary elements not found");
    return;
  }

  const sum = steuerung.getPointSum();
  const avg = steuerung.getPointAvg();

  console.log(`Updating summary: ${sum} points, ${avg.toFixed(1)} average`);

  pointSumBlock1.textContent = `${sum} / 600`;
  avgElem.textContent = `${avg.toFixed(1)}`;
}

// Edit-Popup öffnen mit Template
function openEditSubjectModal(index) {
  const fach = steuerung.getFaecher()[index];
  const editSubjectModal = document.getElementById("editSubjectModal");
  editSubjectModal.style.display = "block";

  // Template verwenden
  const template = document.getElementById("editSubjectTemplate");
  editSubjectModal.innerHTML = "";
  editSubjectModal.appendChild(template.content.cloneNode(true));

  // Titel dynamisch setzen
  const titleElem = editSubjectModal.querySelector(".popup-title");
  if (titleElem && fach) {
    titleElem.textContent = `Halbjahresnoten - ${fach.name}`;
  }

  // Gewichtung Switch setzen
  const gewichtungSwitch = editSubjectModal.querySelector("#gewichtungSwitch");
  if (gewichtungSwitch && fach) {
    gewichtungSwitch.checked = fach.gewichtung === 2;
  }

  // Halbjahresnoten dynamisch einfügen
  const halbjahreList = editSubjectModal.querySelector(".halbjahre-list");
  halbjahreList.innerHTML = "";

  const halbjahre = fach.halbjahre;

  halbjahre.forEach((note, i) => {
    const card = document.createElement("halbjahr-card");
    card.setAttribute("halbjahr", `${i + 1}. Halbjahr`);
    card.setAttribute(
      "schnitt",
      note !== undefined && note !== null && note !== "" ? note : "-"
    );
    const gewichtung =
      fach.gewichtungHalbjahre && fach.gewichtungHalbjahre[i] !== undefined
        ? String(fach.gewichtungHalbjahre[i])
        : "1";
    card.setAttribute("gewichtung", gewichtung);
    halbjahreList.appendChild(card);
  });

  // Event-Listener für Buttons NACH dem Template-Einfügen setzen
  setupEditModalEventListeners(editSubjectModal, fach);
}

function setupEditModalEventListeners(modal, fach) {
  // Delete Button
  const deleteBtn = modal.querySelector("#deleteSubjectBtn");
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      if (confirm(`Fach "${fach.name}" wirklich löschen?`)) {
        const faecher = steuerung.getFaecher();
        const idx = faecher.findIndex((f) => f.name === fach.name);
        if (idx !== -1) {
          steuerung.fachEntfernen(idx);
          modal.style.display = "none";
          update();
        }
      }
    };
  }

  // Save Button
  const saveBtn = modal.querySelector("#closeEditSubjectBtn");
  if (saveBtn) {
    saveBtn.onclick = () => {
      const halbjahrCards = modal.querySelectorAll("halbjahr-card");
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

      // Gewichtung Switch auslesen
      const gewichtungSwitch = modal.querySelector("#gewichtungSwitch");
      const neueGewichtung =
        gewichtungSwitch && gewichtungSwitch.checked ? 2 : 1;

      const faecher = steuerung.getFaecher();
      const targetFach = faecher.find((f) => f.name === fach.name);
      if (targetFach) {
        targetFach.halbjahre = neueNoten;
        targetFach.gewichtungHalbjahre = neueGewichtungen.map(Number);
        targetFach.gewichtung = neueGewichtung;
        steuerung.speichereFaecher();
      }

      modal.style.display = "none";
      update();
    };
  }

  // Cancel Button
  const cancelBtn = modal.querySelector("#cancelEditSubjectBtn");
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      modal.style.display = "none";
    };
  }
}

// Popup-Setup
setupAddSubjectPopup(steuerung, update);

// Initial update
update();
