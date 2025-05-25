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
    for (let jahr of this.halbjahre) {
      const val = parseInt(jahr, 10);
      if (!isNaN(val)) {
        sum += val;
        count++;
      }
    }
    return (sum / count).toFixed(0);
  }

  getHalbjahre() {
    const avg = this.getAvg();
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
  }

  ladeFaecher() {
    const data = localStorage.getItem("faecher");
    return data ? JSON.parse(data).map(Fach.fromObject) : [];
  }

  speichereFaecher() {
    localStorage.setItem("faecher", JSON.stringify(this.faecher));
  }

  fachHinzufuegen(name, gewichtung, halbjahre) {
    const neuerFach = new Fach(name, gewichtung, halbjahre);
    this.faecher.push(neuerFach);
    this.speichereFaecher();
  }

  getFaecher() {
    return this.faecher;
  }

  fachEntfernen(index) {
    this.faecher.splice(index, 1);
    this.speichereFaecher();
  }

  getPointSum() {
    let x = 0;
    for (const fach of this.faecher) {
      const calcHalbjahre = fach.getHalbjahre();
      for (let i = 0; i < calcHalbjahre.length; i++) {
        const val = parseInt(calcHalbjahre[i], 10);
        if (!isNaN(val)) {
          x += val * (fach.gewichtungHalbjahre[i] || 1);
        }
      }
    }
    return x;
  }

  getPointAvg() {
    const sum = this.getPointSum();
    return (sum / 600) * 15;
  }
}
