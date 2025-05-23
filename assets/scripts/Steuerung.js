class Fach {
  constructor(name, gewichtung = 1, halbjahre = []) {
    this.name = name;
    this.gewichtung = gewichtung;
    this.halbjahre = halbjahre; // z.B. Array von Noten oder Halbjahr-Objekten
  }

  static fromObject(obj) {
    return new Fach(obj.name, obj.gewichtung, obj.halbjahre);
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
}
