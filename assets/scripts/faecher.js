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

function openEditSubjectModal() {
  editSubjectModal.style.display = "block";
}
closeEditSubjectBtn.onclick = () => {
  editSubjectModal.style.display = "none";
};
window.onclick = (event) => {
  if (event.target === editSubjectModal) {
    editSubjectModal.style.display = "none";
  }
};

faecherAnzeigen();
