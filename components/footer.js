class Footer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          width: 100%;
          background: var(--secondarybackground, #333);
          color: var(--text, #fff);
          padding: 24px 5%;
          margin-top: 40px;
          border-top: 1px solid #444;
        }
        
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .footer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text, #fff);
          transition: color 0.3s, transform 0.2s;
          padding: 12px 20px;
          border-radius: 8px;
          width: 100%;
          max-width: 200px;
        }
        
        .footer-icon {
          width: 24px;
          height: 24px;
          transition: filter 0.3s;
          flex-shrink: 0;
        }
        
        .footer-text {
          font-weight: 500;
          font-size: 1.1em;
        }
        
      </style>
      
      <footer>
        <div class="footer-content">
          <a href="https://github.com/flohkiste" target="_blank" rel="noopener noreferrer" class="footer-link">
            <img src="/assets/images/githublogo.png" alt="GitHub" class="footer-icon">
            <span class="footer-text">GitHub</span>
          </a>
          
          <a href="https://www.instagram.com/flo.krhr" target="_blank" rel="noopener noreferrer" class="footer-link">
            <img src="/assets/images/instagramlogo.png" alt="Instagram" class="footer-icon">
            <span class="footer-text">Instagram</span>
          </a>
          
          <a href="mailto:schafi350@gmail.com" class="footer-link">
            <img src="/assets/images/emaillogo.png" alt="E-Mail" class="footer-icon">
            <span class="footer-text">E-Mail</span>
          </a>
        </div>
      </footer>
    `;
  }
}

customElements.define("footer-component", Footer);
