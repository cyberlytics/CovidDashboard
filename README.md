# Studienarbeit Web-Anwendungsentwicklung

## Projektbeschreibung

Dieses Projekt wird als Studienarbeit des Moduls "Web-Anwendungsentwicklung" von [Tobias Bauer](https://git.oth-aw.de/7223), [Albert Hahn](https://git.oth-aw.de/5551), [Lukas Kleinlein](https://git.oth-aw.de/a9f2), [Nicolas Proske](https://git.oth-aw.de/c0e8) und [Leonard Wöllmer](https://git.oth-aw.de/fe46) während des Sommersemester 2021 entwickelt.

> Das **Covid-Dashboard** ist eine personalisierbare Webanwendung zur detaillierten Anzeige von Kennzahlen und Statistiken der Covid-19-Pandemie.

_Eine ausführliche textuelle Ausformulierung ist unter dem Ordner [sys-doc](https://git.oth-aw.de/wae-team-white/covid-dashboard/-/tree/master/sys-doc) zu finden._

---

## Build-, Test- & Run-Umgebung

### **Versionen**

- Node.js®: v**14.17.1** LTS ([Download | Node.js](https://nodejs.org/en/download/))
- npm: v**7.18.1** (Muss bei obiger Node.js®-Installation noch mit Hilfe des Befehls `npm install -g npm@7.18.1` aktualisiert werden)
- Angular CLI: v**12.0.4** ([Angular - Setting up the local environment and workspace](https://angular.io/guide/setup-local#install-the-angular-cli))

### **Erstinstallation**

> 1. In den Ordner `sys-src/covid-dashboard` navigieren.
> 2. Den Befehl `npm run client-install` ausführen, um alle benötigten Module herunterzuladen.

### **Gesamte Anwendung ausführen**

> 1. In den Ordner `sys-src/covid-dashboard` navigieren.
> 2. Mit Hilfe des Befehls `npm run dev` wird sowohl Frontend als auch Backend automatisch gestartet.

### **Backend separat starten**

> 1. In den Ordner `sys-src/backend` navigieren.
> 2. (**Für Entwicklungsumgebung**) Mit Hilfe des Befehls `npm run server` wird der Node.js Server im Hintergrund mit Hilfe von `nodemon` gestartet und automatisch aktuell gehalten.
> 3. (**Für Produktivumgebung**) Mit Hilfe des Befehls `npm run start` wird der Node.js Server über ts-node gestartet.

### **Frontend separat ausführen**

> 1. In den Ordner `sys-src/covid-dashboard` navigieren.
> 2. Mit Hilfe des Befehls `npm run start` kann das Projekt gebaut und automatisch lokal ausgeführt werden.

### **Angular-Projekt testen**

> 1. In den Ordner `sys-src/covid-dashboard` navigieren.
> 2. Mit Hilfe des Befehls `npm run test` kann das Projekt getestet werden.

### **Angular-Projekt bauen**

> 1. In den Ordner `sys-src/covid-dashboard` navigieren.
> 2. Mit Hilfe des Befehls `npm run build-prod` kann das Projekt gebaut werden.
