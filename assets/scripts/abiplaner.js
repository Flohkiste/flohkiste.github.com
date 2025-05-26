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

  // Block 1 Summary
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

  // Block 2 Summary
  const block2Elem = document.getElementById("block2Sum");
  if (!block2Elem) {
    console.error("block2Sum element not found");
    return;
  }

  const pointSumBlock2 = block2Elem.getElementsByClassName(
    "block-summary-points"
  )[0];
  const avgBlock2Elem =
    block2Elem.getElementsByClassName("block-summary-avg")[0];

  if (!pointSumBlock2 || !avgBlock2Elem) {
    console.error("Block 2 summary elements not found");
    return;
  }

  const b2PointSum = steuerung.getAbiPointSum();
  const b2Avg = steuerung.getAbiPointAvg();

  pointSumBlock2.textContent = `${b2PointSum} / 300`;
  avgBlock2Elem.textContent = `${b2Avg.toFixed(1)}`;

  //Gesamt Summary
  const gesamtElem = document.getElementById("gesamtSum");
  const pointSumGes = gesamtElem.getElementsByClassName(
    "block-summary-points"
  )[0];
  const pointAvgGes = gesamtElem.getElementsByClassName("block-summary-avg")[0];

  const gesamtSum = steuerung.getAllPointSum();
  const gesamtAvg = steuerung.getAllPointAvg();

  pointSumGes.textContent = `${gesamtSum} / 900`;
  pointAvgGes.textContent = `${gesamtAvg.toFixed(1)}`;

  // Abi Note
  const abiNoteElem = document.getElementById("abiNote");

  abiNoteElem.setAttribute("avg", steuerung.getAbiNote().toFixed(1));
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

function setupAbiListeners() {
  const block2NotenInputs =
    document.getElementsByClassName("block2-note-input");
  const block2FachInputs = document.getElementsByClassName("block2-fach-input");

  for (let x = 0; x < block2NotenInputs.length; x++) {
    const input = block2NotenInputs[x];
    const fachInput = block2FachInputs[x];

    input.value = steuerung.getAbiNoten()[x] || "-";
    fachInput.value = steuerung.getAbiNamen()[x] || "";

    fachInput.addEventListener("change", () => {
      steuerung.abiNamen[x] = fachInput.value.trim();
      steuerung.speichereAbiNamen();
      update();
    });

    input.addEventListener("input", () => {
      if (input.value === "") return;
      let value = parseInt(input.value, 10);
      if (isNaN(value)) {
        input.value = "";
        return;
      }
      if (value < 0) value = 0;
      if (value > 15) value = 15;
      input.value = value;
    });

    input.addEventListener("change", () => {
      const note = input.value.trim();
      if (note === "") {
        steuerung.abiNoten[x] = "";
      } else {
        const value = parseInt(note, 10);
        if (!isNaN(value) && value >= 0 && value <= 15) {
          steuerung.abiNoten[x] = value;
        } else {
          input.value = "";
          return;
        }
      }
      steuerung.speichereAbiNoten();
      update();
    });
  }
}

// Popup-Setup
setupAddSubjectPopup(steuerung, update);
setupAbiListeners();

// Initial update
update();
