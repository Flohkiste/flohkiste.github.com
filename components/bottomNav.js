class BottomNav extends HTMLElement {
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

        #navbar {
          background-color: var(--secondarybackground);
          overflow: hidden;
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 10%;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
        }

        #navbar a {
          height: 100%;
          width: 100%;
          float: left;
          display: flex;
          color: var(--text);
          text-align: center;
          padding: 14px 16px;
          text-decoration: none;
          font-size: 17px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        #navbar a.active {
          background-color: var(--primary);
          color: var(--text);
        }

        #navbar a img {
          width: 25px;
          height: 25px;
        }
      </style>
      <footer id="navbar">
        <a href="../pages/faecher.html?x=1" class="link">
          <img src="../assets/images/faecher.png" alt="" />Fächer
        </a>
        <a href="../pages/index.html?x=2" class="link">
          <img src="../assets/images/graduation.png" alt="" />Abi
        </a>
        <a href="" class="link">
          <img src="../assets/images/settings.png" alt="" />Einst.
        </a>
      </footer>
    `;
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const links = shadow.querySelectorAll(".link");
    const x = new URLSearchParams(window.location.search).get("x");
    if (x && links[x - 1]) {
      links[x - 1].classList.add("active");
    }
  }
}

customElements.define("bottom-nav", BottomNav);
