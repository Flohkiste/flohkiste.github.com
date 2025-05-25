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
    .klammer-btn {
      margin-top: 8px;
      background: var(--primary, #16a300);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 6px 16px;
      font-size: 1em;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .klammer-btn:hover {
      background: #128000;
    }
    .klammer-btn.inactive {
      background: #444;
      color: #aaa;
      cursor: not-allowed;
    }
  </style>
  <div class="halbjahr-card">
    <div class="halbjahr-label">${this.halbjahr}</div>
    <div class="halbjahr-content">
      <div class="halbjahr-circle">
        <input class="halbjahr-input" type="text" min="0" max="15" step="1" value="${this.schnitt}" />
      </div>
  <!-- Klammern-Button Platz -->
    </div>
  </div>
  `;

    /*
  <button class="klammer-btn${
    this.gewichtung === "0" ? " inactive" : ""
  }" type="button">Klammern</button>
  */

    const input = this.shadowRoot.querySelector(".halbjahr-input");
    input.addEventListener("input", (e) => {
      // "-" ist erlaubt, leeres Feld bleibt leer
      if (input.value === "" || input.value === "-") return;
      let value = parseInt(input.value, 10);
      if (isNaN(value)) {
        input.value = "-";
        return;
      }
      if (value < 0) value = 0;
      if (value > 15) value = 15;
      input.value = value;
    });

    // "-" beim Fokussieren sofort entfernen
    input.addEventListener("focus", () => {
      if (input.value === "-") input.value = "";
    });

    input.addEventListener("focusout", () => {
      if (input.value === "") input.value = "-";
    });

    // Klammern-Button Logik
    /*const klammerBtn = this.shadowRoot.querySelector(".klammer-btn");
    klammerBtn.addEventListener("click", () => {
      const neueGewichtung = klammerBtn.classList.toggle("inactive")
        ? "0"
        : "1";
      this.setAttribute("gewichtung", neueGewichtung);
    });*/
  }
}

customElements.define("halbjahr-card", HalbjahrCard);
