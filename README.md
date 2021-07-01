# Studienarbeit Web-Anwendungsentwicklung

## Projektbeschreibung

Dieses Projekt wird als Studienarbeit des Moduls "Web-Anwendungsentwicklung" von [Tobias Bauer](https://git.oth-aw.de/7223), [Albert Hahn](https://git.oth-aw.de/5551), [Lukas Kleinlein](https://git.oth-aw.de/a9f2), [Nicolas Proske](https://git.oth-aw.de/c0e8) und [Leonard Wöllmer](https://git.oth-aw.de/fe46) während des Sommersemester 2021 entwickelt.

> **Covidash** ist eine personalisierbare Webanwendung zur detaillierten Anzeige von Kennzahlen und Statistiken über den Infektionsverlauf und Impffortschritt der Covid19-Pandemie.

_Sowohl eine ausführliche textuelle Ausformulierung als auch ein Technical Report ist unter dem Ordner [sys-doc](https://git.oth-aw.de/wae-team-white/covid-dashboard/-/tree/master/sys-doc) zu finden._

---

## Entwicklungsversionen

- Node.js®: v**14.17.1** LTS ([Download | Node.js](https://nodejs.org/en/download/))
- npm: v**7.18.1** (Muss bei obiger Node.js®-Installation noch mithilfe des Befehls `npm install -g npm@7.18.1` aktualisiert werden)
- Angular CLI: v**12.1.0** ([Angular - Setting up the local environment and workspace](https://angular.io/guide/setup-local#install-the-angular-cli))

## Build-, Test- & Run-Umgebung

### **Erstinstallation**

> 1. In den Ordner `sys-src/frontend` navigieren.
> 2. Den Befehl `npm run client-install` ausführen, um alle benötigten Module herunterzuladen.

### **Frontend inkl. Backend (lokal) ausführen**

> 1. In den Ordner `sys-src/frontend` navigieren.
> 2. Mithilfe des Befehls `npm run dev` wird sowohl Frontend als auch Backend automatisch gestartet.
> 3. Hinweis: Standardmäßig nutzt das Frontend die **offizielle Covidash-API** `https://covidash.de/api`. Zum Testen mit lokalem Backend muss die URL des **NetworkService** entsprechend angepasst werden (z. B. auf `http://localhost:3000`) (_Default-Port: 3000_).

### **Backend einzeln starten**

> 1. In den Ordner `sys-src/backend` navigieren.
> 2. (**Für Entwicklungsumgebung**) Mithilfe des Befehls `npm run server` wird der Node.js Server im Hintergrund mithilfe von `nodemon` gestartet und bei Änderungen automatisch aktualisiert.
> 3. (**Für Produktivumgebung**) Mithilfe des Befehls `npm run start` wird der Node.js Server über ts-node gestartet.

### **Frontend einzeln ausführen**

> 1. In den Ordner `sys-src/frontend` navigieren.
> 2. Mithilfe des Befehls `npm run start` kann das Projekt gebaut und automatisch lokal ausgeführt werden.

### **Frontend testen**

> 1. In den Ordner `sys-src/frontend` navigieren.
> 2. Mithilfe des Befehls `npm run test` kann das Projekt getestet werden. Es wird im Anschluss eine "Cove-Coverage"-Übersicht angezeigt. Detailliertere Informationen zur Code-Coverage können über die `index.html` des Ordners `sys-src/frontend/coverage` eingesehen werden.

### **Frontend bauen**

> 1. In den Ordner `sys-src/frontend` navigieren.
> 2. Mithilfe des Befehls `npm run build` kann das Projekt für den Einsatz in der Produktivumgebung gebaut werden.

### **Frontend ESLint**

> 1. In den Ordner `sys-src/frontend` navigieren.
> 2. Mithilfe des Befehls `npm run lint` kann das Projekt mit ESLint auf Syntaxfehler überprüft werden.
