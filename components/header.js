class Header extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        header {
          width: 100%;
          min-height: 20%;
            position: sticky;
        }
      </style>
      <header>
        <h1>Abi Planer</h1>
      </header>
    `;
  }
}

customElements.define("header-component", Header);
