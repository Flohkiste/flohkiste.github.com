class FaecherCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  static get observedAttributes() {
    return ["titel", "noten", "calcnoten"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "titel" || name === "noten" || name === "calcnoten") {
      this.render();
    }
  }

  get titel() {
    return this.getAttribute("titel") || "";
  }

  get noten() {
    try {
      return JSON.parse(this.getAttribute("noten")) || [];
    } catch {
      return [];
    }
  }

  get calcNoten() {
    try {
      return JSON.parse(this.getAttribute("calcnoten")) || [];
    } catch {
      return [];
    }
  }

  render() {
    // Immer 4 Noten anzeigen, fehlende mit "-"
    const noten = [...this.noten];
    const calcNoten = [...this.calcNoten];
    while (noten.length < 4) {
      noten.push("-");
    }
    while (calcNoten.length < 4) {
      calcNoten.push("-");
    }

    // Gewichtungen aus LocalStorage holen
    let gewichtungen = [1, 1, 1, 1];
    try {
      const faecher = JSON.parse(localStorage.getItem("faecher")) || [];
      const fach = faecher.find((f) => f.name === this.titel);
      if (fach && Array.isArray(fach.gewichtungHalbjahre)) {
        gewichtungen = fach.gewichtungHalbjahre;
      }
    } catch {}

    this.shadowRoot.innerHTML = `
    <style>
    .fach-card {
      width: 100%;
      box-sizing: border-box;
      background: var(--secondarybackground);
      color: var(--text);
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      padding: 16px;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .fach-title {
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 16px;
      width: 100%;
      text-align: left;
    }
    .noten-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      width: 100%;
      justify-content: flex-start;
    }
    .note-btn {
      background: var(--primary, #16a300);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      font-size: 1.1em;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.13);
      transition: background 0.2s;
      padding: 0;
    }
.note-btn.calculated {
  background: var(--calculated); /* Gedämpftes Grün */
}
    .note-btn.inactive {
      background: #444;
      color: #aaa;
    }
    </style>
    <div class="fach-card">
    <div class="fach-title">${this.titel}</div>
    <div class="noten-row">
      ${calcNoten
        .map((note, i) => {
          // Eine Note ist berechnet, wenn sie vom ursprünglichen "-" durch den Durchschnitt ersetzt wurde
          const isCalculated = noten[i] === "-" && note !== "-";
          return `<button class="note-btn${
            gewichtungen[i] === 0
              ? " inactive"
              : isCalculated
              ? " calculated"
              : ""
          }" tabindex="-1" data-index="${i}">${
            note !== undefined && note !== null && note !== "" ? note : "-"
          }</button>`;
        })
        .join("")}
    </div>
    </div>
  `;

    this.shadowRoot.querySelectorAll(".note-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        // Fächer aus LocalStorage holen
        const faecher = JSON.parse(localStorage.getItem("faecher")) || [];
        const fach = faecher.find((f) => f.name === this.titel);
        if (fach) {
          if (!Array.isArray(fach.gewichtungHalbjahre))
            fach.gewichtungHalbjahre = [1, 1, 1, 1];
          fach.gewichtungHalbjahre[idx] =
            fach.gewichtungHalbjahre[idx] === 0 ? 1 : 0;
          localStorage.setItem("faecher", JSON.stringify(faecher));
          this.render(); // UI aktualisieren

          // Custom Event für Update senden
          this.dispatchEvent(
            new CustomEvent("gewichtungChanged", {
              bubbles: true,
              detail: { fachName: this.titel, halbjahr: idx },
            })
          );

          if (window.updateApp) {
            window.updateApp();
          }
        }
      });
    });
  }
}

customElements.define("faecher-card", FaecherCard);
