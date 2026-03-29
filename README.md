# VegaStars Casino — QA Automation Suite

![CI Status](https://github.com/rajafaisal307-web/vegastars-automation/actions/workflows/playwright.yml/badge.svg)

A mobile-focused test automation suite for [VegaStars Casino](https://www.vegastars5.com), built with **Playwright (JavaScript)** and **GitHub Actions CI**. Covers critical UI flows, API validation, and exploratory defect findings.

---

## 📁 Project Structure

```
Vegastar_Automation/
│
├── .github/
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI pipeline
│
├── tests/
│   ├── login.spec.js             # TC01–TC03: Login flow (3 tests)
│   ├── lobby.spec.js             # TC04–TC07: Lobby page load (4 tests)
│   ├── gameLaunch.spec.js        # TC08–TC09: Game launch (2 tests)
│   ├── navigation.spec.js        # TC10–TC12: Navigation regression (3 tests)
│   └── api.spec.js               # TC-API-01–TC-API-08: API tests (8 tests)
│
├── pages/
│   ├── LoginPage.js              # Page Object — Login modal
│   ├── LobbyPage.js              # Page Object — Game lobby
│   └── GamePage.js               # Page Object — Game launch
│
├── utils/
│   └── testData.js               # Shared test credentials and base URL
│
├── playwright.config.js          # Playwright configuration
├── package.json                  # Project dependencies
└── README.md                     # This file
```

---

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or higher | https://nodejs.org |
| npm | v8 or higher | Comes with Node.js |
| Git | Any | https://git-scm.com |

---

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/rajafaisal307-web/vegastars-automation.git
cd vegastars-automation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install chromium
```

### 4. Verify installation

```bash
npx playwright --version
```

---

## ▶️ Running Tests

### Run all tests

```bash
npx playwright test --workers=1
```

### Run with browser visible (headed mode)

```bash
npx playwright test --headed --workers=1
```

### Run a specific test file

```bash
# Login tests only
npx playwright test tests/login.spec.js --headed

# Lobby tests only
npx playwright test tests/lobby.spec.js --headed

# Game launch tests only
npx playwright test tests/gameLaunch.spec.js --headed

# Navigation tests only
npx playwright test tests/navigation.spec.js --headed

# API tests only
npx playwright test tests/api.spec.js --headed
```

### Run a specific test case

```bash
npx playwright test --headed --grep "TC01"
```

### View HTML report after test run

```bash
npx playwright show-report
```

---

## 🧪 Test Coverage

| File | Test Cases | Flow Covered |
|------|-----------|-------------|
| `login.spec.js` | TC01–TC03 | Valid login, invalid login, empty fields |
| `lobby.spec.js` | TC04–TC07 | Lobby load, game cards, pokies tab, viewport |
| `gameLaunch.spec.js` | TC08–TC09 | Game launch, console error check |
| `navigation.spec.js` | TC10–TC12 | Nav visibility, pokies tab, live casino tab |
| `api.spec.js` | TC-API-01–08 | Login, profile, recent games, OAuth, security headers |

**Total: 20 test cases across 5 test files**

---

## 📱 Mobile Configuration

Tests run in **mobile emulation mode** using Pixel 5 viewport (393x851) to simulate a real mobile user experience. This is configured in `playwright.config.js`:

```javascript
projects: [
  {
    name: 'Mobile Chrome',
    use: {
      ...devices['Pixel 5'],
      channel: 'chromium',
    },
  },
],
```

To test on a different device, update the `devices` value. Available options include:
- `iPhone 13`
- `iPhone 12`
- `Pixel 5`
- `Galaxy S9+`

---

## 🔧 Configuration

All configuration is managed in `playwright.config.js`:

| Setting | Value | Description |
|---------|-------|-------------|
| `testDir` | `./tests` | Test files location |
| `timeout` | 60000ms | Global test timeout |
| `retries` | 1 | Retry failed tests once |
| `headless` | Auto | Headed locally, headless in CI |
| `screenshot` | On failure | Auto-capture on test failure |
| `video` | On failure | Record video on test failure |
| `reporter` | HTML | Generates visual HTML report |

---

## 🔑 Test Credentials

Test credentials are stored in `utils/testData.js`. The suite uses a dedicated test account:

```javascript
validUser: {
  email: 'vega_faisal@mailinator.com',
  username: 'vegafaisal1',
  password: 'Vega@123',
}
```

> ⚠️ **Note:** In a production setup, credentials should be stored as **GitHub Secrets** and injected via environment variables rather than hardcoded in the repository.

---

## 🔄 CI/CD Pipeline

The pipeline is configured with **GitHub Actions** and runs automatically on:

- Every **push** to `main` or `master` branch
- Every **pull request** targeting `main` or `master`
- Manual trigger via **workflow_dispatch**

### Pipeline Steps

```
1. Checkout repository
2. Setup Node.js v18
3. Install npm dependencies (npm ci)
4. Install Chromium browser
5. Run all Playwright tests (headless, 1 worker)
6. Upload HTML report as artifact (retained 30 days)
```

### Viewing CI Results

1. Go to the repository on GitHub
2. Click the **Actions** tab
3. Click on any workflow run to see detailed logs
4. Download the **playwright-report** artifact for the full HTML report

---

## ⚖️ Tradeoffs & Design Decisions

### ✅ What We Chose & Why

| Decision | Rationale |
|----------|-----------|
| **Playwright over Cypress** | Better mobile emulation, built-in API testing, faster execution, and supports multiple browsers |
| **JavaScript over TypeScript** | Lower barrier to entry, faster setup, sufficient for this project scope |
| **Page Object Model (POM)** | Separates selectors from test logic — if a selector changes, fix it in one place only |
| **href-based selectors** | More stable than class-based selectors which change with CSS framework updates |
| **`npm ci` in CI** | Ensures clean, reproducible installs from `package-lock.json` |
| **Postman for API exploration** | Used alongside Playwright for manual API discovery and documentation |
| **1 worker in CI** | Prevents race conditions and session conflicts on a shared test account |
| **Retries: 1** | Handles network flakiness common on casino sites with live data feeds |

### ⚠️ Known Limitations & Tradeoffs

| Limitation | Reason | Mitigation |
|------------|--------|------------|
| **Credentials hardcoded** | No secrets manager available for this assignment | In production, use GitHub Secrets + environment variables |
| **Auto-generated CSS selectors** | MUI (Material UI) generates dynamic class names like `css-fb76oj` | Use `aria-*` attributes or ask devs to add `data-testid` attributes |
| **Game launch tests flaky** | Third-party overlays and popups intercept clicks | Used `force: true` click as workaround; real fix requires stable test environment |
| **No real payment testing** | Real transactions cannot be made in automation | Tests run up to payment selection step only |
| **Single test account** | Shared state between tests can cause interference | Ideally use a fresh account per test run or reset state via API |
| **Mobile emulation only** | Real device testing not included in core suite | BrowserStack/LambdaTest integration recommended for real device coverage |
| **API endpoints discovered manually** | No Swagger/OpenAPI docs provided | Endpoints discovered via Chrome DevTools network inspection |
| **Live casino not tested** | Streaming quality requires human judgment | Documented as out-of-scope in test strategy |

---

## 📊 API Testing

API tests use **Playwright's built-in `APIRequestContext`** for automated assertions in CI, and **Postman** for manual exploration and documentation.

### Endpoints Tested

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/player/api/v1/signin` | User authentication |
| GET | `/player/api/v1/profile` | User profile data |
| GET | `/player/api/v1/recent-games` | Recently played games |
| GET | `/player/api/v1/oauth/providers` | Available OAuth providers |

### API Base URL
```
https://api.vssapi.com/player/api/v1
```

---

## 🐛 Defects Found

During exploratory testing, 5 defects were identified and documented:

| ID | Title | Severity |
|----|-------|----------|
| BUG-01 | Authentication token exposed in URL after login | High |
| BUG-02 | Get Free Spins button leads to broken page | Critical |
| BUG-03 | Generic validation error on empty deposit amount | Medium |
| BUG-04 | Invalid amount accepted in deposit field | High |
| BUG-05 | Security Code (CVV) label truncated on mobile | Low |

Full details available in the **Bug Report** document.

---

## 📞 Support

For questions about this test suite, raise an issue in the repository or contact the QA Engineer directly.

---

*QA Engineer Technical Test | VegaStars Casino | Playwright (JavaScript) | GitHub Actions CI*
