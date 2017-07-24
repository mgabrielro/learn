# Prozess Automatisierung mit Gulp

Zur Abarbeitung üblicher Frontend Aufgaben wird der auf [Node.js](https://nodejs.org) basierende Task-Runner [gulp](http://gulpjs.com/) genutzt. Aufgaben, wie z.B. das Kompilieren von Less-Dateien oder die Minifizierung von JavaScript und CSS sind in Plugins gekapselt und werden durch Kanäle bzw. "Pipes" auf einen Daten-Stream (siehe auch [Streams](https://github.com/substack/stream-handbook#introduction)) angewendet.
![Gulp Stream](https://bytebucket.org/marlon_h/files/raw/5eee30a56f039d8f4e5fc17e07e208fccff8581c/gulp-stream.png)

Die Installation von Node.js wird vorausgesetzt.


### 1. Node.js installieren

Üblicherweise sollte eine aktuelle Version in der Entwicklungs-Umgebung bereitstehen. Die Verfügbarkeit lässt sich mit folgendem Befehl auf der Kommandozeile überprüfen:

    node -v

Dieser Befehl prüft die Version einer Node.js-Installation. Schlägt die Abfrage fehl, muss Node.js für die benötigte Platform [heruntergeladen](https://nodejs.org/en/download/) und installiert werden. Nach der Installation sollte Node.js bzw. der Befehl `node` global zur Verfügung stehen.


### 2. Benötigte Packages installieren

Die `package.json` liegt im Ordner `www` und enthält Informationen zu den benötigten Abhängigkeiten bzw. Packages, die unter anderem hauptsächlich in den Gulp-Tasks aufgerufen werden. Über folgenden Befehl wird die Installation im gleichen Ordner gestartet:

    npm install

Dabei werden alle Packages der Objekte "dependencies" und "devDependencies" der `package.json` aus dem Node Package Manager ([npm](https://www.npmjs.com/)) heruntergeladen und im Ordner `node_modules` installiert. Über den Aufruf wird auch `gulp` lokal installiert.


### 3. Konfigurationsdateien für Gulp-Tasks bereitstellen

Die Tasks greifen auf Konfigurations-Dateien zu, in der für die Aufgaben zur Manipulation von Dateien die Angaben Start `src`, Ziel `dest` sowie der Dateiname der Ausgabe `outputName` des Daten-Streams festgelegt werden. Im Ordner `www/gulp` befinden sich Skeleton-Dateien für alle aktuellen Projekte. Die benötigten Dateien müssen kopiert werden.

    cp <partner>.<output>.config.js.dist <partner>.<output>.config.js

*Aktuell sind folgende Partner und Outputs konfiguriert*<br />
`check24`: `desktop`, `mobile`<br />
`checkde`: `desktop`

##### Browsersync

Das automatische Aktualisieren des Browsers via [Browsersync](https://www.browsersync.io/) wird über den Task `serve` gesteuert. Die Konfiguration befindet sich ebenfalls in dieser Datei (`serve.proxy`). Hier muss die URL aktualsiert werden, die über den Proxy aufgerufen wird.


### 4. Task ausführen

Tasks werden nach folgendem Schema aufgerufen:

    gulp <taskname> --partner=<partner> --output=<output>

Alle Task-Aufrufe werden im Pfad `www` ausgeführt (Gulp benötigt für jeden Aufruf die `gulpfile.js`). Der Befehl `gulp -h` listet alle verfügbaren Argumente auf. In der Auflistung ist zu sehen, das die Argumente `--partner` und `--output` default-Werte haben. Entsprechend ist ein Ausführen der Tasks auch wie folgt möglich:

    gulp <taskname>

Dieser Befehl startet den Task <taskname> für den Partner `check24` und dem Output `desktop`.

##### gulpfile.js

Aufgaben bzw. Gulp-Tasks werden in der Konfigurationsdatei `gulpfile.js` definiert. Die Konfigurationsdatei kann neben den eigentlichen Tasks weitere Hilfsfunktionen beinhalten.


## Übersicht der verfügbaren Gulp-Tasks ##

###### `libs`
* [sort](https://www.npmjs.com/package/gulp-sort)
* [concat](https://www.npmjs.com/package/gulp-concat)
* [uglify](https://www.npmjs.com/package/gulp-uglify)

###### `scripts`
* sort
* concat
* uglify
* [sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)

###### `styles`
* [less](https://www.npmjs.com/package/gulp-less)
* concat
* [minify](https://www.npmjs.com/package/cssnano)
* sourcemaps

###### `images`
* [imagemin](https://www.npmjs.com/package/gulp-imagemin)

###### `build`
* libs
* scripts
* styles
* images

###### `serve`
* build
* [browsersync](https://www.npmjs.com/package/browser-sync)

###### `watch`
* build