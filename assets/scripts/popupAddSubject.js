export function setupAddSubjectPopup(steuerung, faecherAnzeigen) {
  const modal = document.getElementById("addSubjectModal");
  const addBtn = document.getElementById("addSubjectBtn");
  const closeBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelSubjectBtn");
  const saveBtn = document.getElementById("saveSubjectBtn");
  const input = document.getElementById("subjectNameInput");

  addBtn.onclick = () => {
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
      steuerung.fachHinzufuegen(name, 1);
      modal.style.display = "none";
      setTimeout(faecherAnzeigen, 0);
    } else {
      alert("Fachname ist ungültig oder bereits vorhanden.");
      input.focus();
    }
  };
}
