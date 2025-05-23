class FaecherCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  static get observedAttributes() {
    return ["titel", "noten"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "titel" || name === "noten") {
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

  render() {
    // Immer 4 Noten anzeigen, fehlende mit "-"
    const noten = [...this.noten];
    while (noten.length < 4) {
      noten.push("-");
    }

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
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      .fach-title {
        font-size: 1.2em;
        font-weight: bold;
        margin-bottom: 4px;
      }
      .noten-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .note-chip {
        color: var(--text);
        border-radius: 12px;
        padding: 2px 10px;
        font-size: 1em;
      }
    </style>
    <div class="fach-card">
      <div class="fach-title">${this.titel}</div>
      <div class="noten-row">
        ${noten
          .map(
            (note) =>
              `<span class="note-chip">${
                note !== undefined && note !== null && note !== "" ? note : "-"
              }</span>`
          )
          .join("")}
      </div>
    </div>
  `;
  }
}

customElements.define("faecher-card", FaecherCard);
