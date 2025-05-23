class AvgCircle extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
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
            box-shadow: 0px 0px 40px 10px var(--primary);
          }
        </style>
        <div id="avgCircle">
          <div id="circle">1,9</div>
        </div>
      `;
  }
}

customElements.define("avg-circle", AvgCircle);
