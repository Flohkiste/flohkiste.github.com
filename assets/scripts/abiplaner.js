import { setupAddSubjectPopup } from "./popupAddSubject.js";
import { setupEditSubjectPopup } from "./popupEditSubject.js";
import "/components/HalbjahrCard.js";
import "/components/FaecherCard.js";

console.log("Script geladen!");
const steuerung = new Steuerung();

// Fächer anzeigen
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
    container.appendChild(card);
  });
}

function updateSummary() {
  const block1Elem = document.getElementById("block1");
  const pointSumBlock1 = block1Elem.getElementsByClassName(
    "block-summary-points"
  )[0];
  const avgElem = block1Elem.getElementsByClassName("block-summary-avg")[0];
  const sum = steuerung.getPointSum();
  const avg = steuerung.getPointAvg();

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
}

// Popup-Setup
setupAddSubjectPopup(steuerung, faecherAnzeigen);
setupEditSubjectPopup(steuerung, faecherAnzeigen);

faecherAnzeigen();
updateSummary();
