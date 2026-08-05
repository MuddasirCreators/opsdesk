# Architecture Decisions

## 1. Project Structure

The project follows a modular architecture where each folder has a single responsibility.

- api/ handles server communication.
- core/ contains application logic.
- features/ contains business features.
- ui/ manages the user interface.
- storage/ manages browser storage.
- utils/ contains reusable helper functions.

---

## 2. ES Modules

The project uses native JavaScript ES Modules to improve code organization and maintainability.

---

## 3. Central Configuration

Application settings are stored in config.js so that configuration values are maintained in one place.

---

## 4. Runtime Diagnostics

Runtime information is collected using browser APIs instead of browser name assumptions whenever possible.

---

## 5. Code Organization

Each module has a single responsibility, making the project easier to maintain and extend.