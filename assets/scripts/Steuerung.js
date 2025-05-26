class Fach {
  constructor(name, gewichtung = 1, halbjahre = ["-", "-", "-", "-"]) {
    this.name = name;
    this.gewichtung = gewichtung;
    this.halbjahre = halbjahre;
    this.gewichtungHalbjahre = [1, 1, 1, 1];
  }

  static fromObject(obj) {
    const fach = new Fach(obj.name, obj.gewichtung, obj.halbjahre);
    if (obj.gewichtungHalbjahre) {
      fach.gewichtungHalbjahre = obj.gewichtungHalbjahre;
    }
    return fach;
  }

  getAvg() {
    let sum = 0;
    let count = 0;
    let nan = 0;
    for (let jahr of this.halbjahre) {
      const val = parseInt(jahr, 10);
      if (!isNaN(val)) {
        sum += val;
        count++;
      } else {
        nan++;
      }
    }
    if (nan === 4) {
      return -1;
    }
    return (sum / count).toFixed(0);
  }

  getHalbjahre() {
    const avg = this.getAvg();
    if (avg === -1) {
      return ["", "", "", ""];
    }
    let calcHalbjahre = [...this.halbjahre];
    for (let i = 0; i < 4; i++) {
      if (calcHalbjahre[i] === "-") {
        calcHalbjahre[i] = avg;
      }
    }

    return calcHalbjahre;
  }
}

class Steuerung {
  constructor() {
    this.faecher = this.ladeFaecher();
    this.abiNamen = this.ladeAbiNamen();
    this.abiNoten = this.ladeAbiNoten();
  }

  ladeFaecher() {
    const data = localStorage.getItem("faecher");
    return data ? JSON.parse(data).map(Fach.fromObject) : [];
  }

  speichereFaecher() {
    localStorage.setItem("faecher", JSON.stringify(this.faecher));
  }

  ladeAbiNamen() {
    const data = localStorage.getItem("abiNamen");
    return data ? JSON.parse(data) : ["", "", "", "", ""];
  }

  ladeAbiNoten() {
    const data = localStorage.getItem("abiNoten");
    return data ? JSON.parse(data) : ["", "", "", "", ""];
  }

  speichereAbiNamen() {
    localStorage.setItem("abiNamen", JSON.stringify(this.abiNamen));
  }

  speichereAbiNoten() {
    localStorage.setItem("abiNoten", JSON.stringify(this.abiNoten));
  }

  fachHinzufuegen(name, gewichtung, halbjahre) {
    const neuerFach = new Fach(name, gewichtung, halbjahre);
    this.faecher.push(neuerFach);
    this.speichereFaecher();
  }

  getFaecher() {
    return this.faecher;
  }

  getAbiNamen() {
    return this.abiNamen;
  }

  getAbiNoten() {
    return this.abiNoten;
  }

  fachEntfernen(index) {
    this.faecher.splice(index, 1);
    this.speichereFaecher();
  }

  getAbiPointSum() {
    let sum = 0;
    for (const note of this.abiNoten) {
      const val = parseInt(note, 10);
      if (!isNaN(val)) {
        sum += val * 4;
      }
    }
    return sum;
  }

  getAbiPointAvg() {
    const sum = this.getAbiPointSum();
    return (sum / 300) * 15;
  }

  getPointSum() {
    let x = 0;
    for (const fach of this.faecher) {
      const calcHalbjahre = fach.getHalbjahre();
      let y = 0;
      for (let i = 0; i < calcHalbjahre.length; i++) {
        const val = parseInt(calcHalbjahre[i], 10);
        if (!isNaN(val)) {
          const gewichtung =
            fach.gewichtungHalbjahre &&
            fach.gewichtungHalbjahre[i] !== undefined
              ? fach.gewichtungHalbjahre[i]
              : 1;
          y += val * gewichtung;
        }
      }
      x += y * fach.gewichtung;
    }
    return x;
  }

  getPointAvg() {
    const sum = this.getPointSum();
    return (sum / 600) * 15;
  }

  getAllPointAvg() {
    return (this.getAllPointSum() / 900) * 15;
  }

  getAllPointSum() {
    return this.getPointSum() + this.getAbiPointSum();
  }

  getAbiNote() {
    const punkte = this.getAllPointSum();
    const tabelle = [
      [1.0, 823],
      [1.1, 805],
      [1.2, 787],
      [1.3, 769],
      [1.4, 751],
      [1.5, 733],
      [1.6, 715],
      [1.7, 697],
      [1.8, 679],
      [1.9, 661],
      [2.0, 643],
      [2.1, 625],
      [2.2, 607],
      [2.3, 589],
      [2.4, 571],
      [2.5, 553],
      [2.6, 535],
      [2.7, 517],
      [2.8, 499],
      [2.9, 481],
      [3.0, 463],
      [3.1, 445],
      [3.2, 427],
      [3.3, 409],
      [3.4, 391],
      [3.5, 373],
      [3.6, 355],
      [3.7, 337],
      [3.8, 319],
      [3.9, 301],
      [4.0, 300],
    ];
    for (const [note, minPunkte] of tabelle) {
      if (punkte >= minPunkte) return note;
    }
    return 6.0;
  }
}
