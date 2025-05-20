# KorejtkoSapUI5

A simple OpenUI5 application for managing and viewing products, demonstrating key UI5 concepts.

## Features

- Product list with search and filtering
- Add new products via dialog
- Product detail view with supplier and category info
- Multi-language support (English, Čeština)
- Responsive UI using SAP Fiori controls

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Npm](https://www.npmjs.com/)
- [UI5 CLI](https://sap.github.io/ui5-tooling/)

### Installation

```sh
npm install
```

### Running the App
```sh
npm start
```

Open http://localhost:8080/index.html in your browser.

## Development
- Main entry: webapp/Component.ts
- Routing and views are defined in webapp/manifest.json
- Controllers are in webapp/controller/
- Views and fragments are in webapp/view/
- i18n files are in webapp/i18n/