class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  static get observedAttributes() {
    return ["title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute("title") || "Abi Planer";
    this.shadowRoot.innerHTML = `
      <style>
        header {
          width: 100%;
          min-height: 20%;
          position: sticky;
          text-align: center;
        }
      </style>
      <header>
        <h1>${title}</h1>
      </header>
    `;
  }
}

customElements.define("header-component", Header);
