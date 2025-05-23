class HalbjahrCard extends HTMLElement {
  static get observedAttributes() {
    return ["halbjahr", "schnitt", "gewichtung"];
  }

  attributeChangedCallback() {
    this.render();
  }

  get halbjahr() {
    return this.getAttribute("halbjahr") || "";
  }
  get schnitt() {
    return this.getAttribute("schnitt") || "-";
  }
  get gewichtung() {
    return this.getAttribute("gewichtung") || "1";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot?.innerHTML && (this.shadowRoot.innerHTML = "");
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
  <style>
    .halbjahr-card {
      background: #181818;
      border-radius: 14px;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 12px rgba(0,0,0,0.18);
      margin-bottom: 0;
    }
    .halbjahr-label {
      color: #fff;
      font-size: 1.08em;
      font-weight: bold;
      margin-bottom: 6px;
      text-align: center;
    }
    .halbjahr-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .halbjahr-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      border: 5px solid var(--primary, #16a300);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #232323;
      margin-bottom: 8px;
    }
    .halbjahr-input {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 1.3em;
      font-weight: bold;
      text-align: center;
      width: 100%;
    }
    .halbjahr-input:focus {
      outline: none;
    }
    .halbjahr-gewichtung {
      color: var(--primary, #16a300);
      font-size: 1em;
      font-weight: 500;
      margin-top: 8px;
      text-align: center;
    }
  </style>
  <div class="halbjahr-card">
    <div class="halbjahr-label">${this.halbjahr}</div>
    <div class="halbjahr-content">
      <div class="halbjahr-circle">
        <input class="halbjahr-input" type="text" value="${this.schnitt}" />
      </div>
      <span class="halbjahr-gewichtung">Gewichtung x${this.gewichtung}</span>
    </div>
  </div>
  `;
  }
}

customElements.define("halbjahr-card", HalbjahrCard);
