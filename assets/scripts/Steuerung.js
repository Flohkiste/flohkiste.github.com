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

  abiHinzufuegen(name, note) {
    this.abiNamen.push(name);
    this.abiNoten.push(note);
    this.speichereAbiNamen();
    this.speichereAbiNoten();
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

  abiEntfernen(index) {
    this.abiNamen.splice(index, 1);
    this.abiNoten.splice(index, 1);
    this.speichereAbiNamen();
    this.speichereAbiNoten();
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
        sum += val;
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
    
  }
}
