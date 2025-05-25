class AvgCircle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  static get observedAttributes() {
    return ["avg"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "avg") {
      this.render();
    }
  }

  render() {
    const avg = this.getAttribute("avg") || "-";

    this.shadowRoot.innerHTML = `
        <style>
          #avgCircle {
            width: 100%;
            height: 15%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 30px;
            margin-bottom: 30px;
          }
  
          #avgCircle #circle {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--primary);
            width: 125px;
            height: 125px;
            border-radius: 125px;
            text-align: center;
            text-decoration: none;
            font-size: 50px;
            font-weight: bold;
            box-shadow: 0px 0px 40px 10px var(--primary);
          }
        </style>
        <div id="avgCircle">
          <div id="circle">${avg}</div>
        </div>
      `;
  }
}

customElements.define("avg-circle", AvgCircle);
