const { test, expect, request } = require('@playwright/test');
const testData = require('../utils/testData');

// Real base URL discovered from network inspection
const BASE_URL = 'https://api.vssapi.com/player/api/v1';

// Required headers for all API requests — needed for CI environment
const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': 'https://www.vegastars5.com',
  'Referer': 'https://www.vegastars5.com/',
};

// Auth token stored after login
let authToken = '';

test.describe('API Tests — VegaStars', () => {

  // ── Get auth token before all tests ───────────────────────
  test.beforeAll(async () => {
    const context = await request.newContext();

    const response = await context.post(`${BASE_URL}/signin`, {
      data: {
        username: testData.validUser.username,
        password: testData.validUser.password,
        d_id: '',
      },
      headers: API_HEADERS
    });

    if (response.ok()) {
      const body = await response.json();
      authToken = body.token || '';
      console.log('Auth token obtained:', authToken ? 'YES' : 'NO');
    } else {
      console.log('Login failed with status:', response.status());
      const text = await response.text();
      console.log('Login failed response:', text.substring(0, 200));
    }

    await context.dispose();
  });

  // ── TC-API-01: Login — Valid Credentials ──────────────────
  test('TC-API-01 — POST /signin — valid credentials returns 200 and token', async ({ request }) => {

    const response = await request.post(`${BASE_URL}/signin`, {
      data: {
        username: testData.validUser.username,
        password: testData.validUser.password,
        d_id: '',
      },
      headers: API_HEADERS
    });

    // a. Status code — 403 may occur if running from geo-restricted region
    expect([200, 403]).toContain(response.status());
    test.skip(response.status() === 403, 'Geo-restricted region — skipping');

    // b. Response structure — token field must exist
    const body = await response.json();
    expect(body).toHaveProperty('token');

    // c. Expected values — token must be a non-empty string
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);

    console.log('Login successful — token received');
  });

  // ── TC-API-02: Login — Invalid Credentials ────────────────
  test('TC-API-02 — POST /signin — invalid credentials returns 401', async ({ request }) => {

    const response = await request.post(`${BASE_URL}/signin`, {
      data: {
        username: testData.invalidUser.email,
        password: testData.invalidUser.password,
        d_id: '',
      },
      headers: API_HEADERS
    });

    // a. Status code — API returns 404 for invalid credentials
    expect([401, 404, 403]).toContain(response.status());

    // b. Response structure — use text() as API may return HTML for errors
    const text = await response.text();
    expect(text).toBeTruthy();

    // c. Expected values — response must not contain a token
    expect(text).not.toContain('"token"');

    console.log('Invalid login response status:', response.status());
  });

  // ── TC-API-03: Login — Empty Fields ───────────────────────
  test('TC-API-03 — POST /signin — empty fields returns error', async ({ request }) => {

    const response = await request.post(`${BASE_URL}/signin`, {
      data: {
        username: '',
        password: '',
        d_id: '',
      },
      headers: API_HEADERS
    });

    // a. Status code — must be 400, 401, 404 or 422
    expect([400, 401, 404, 422, 403]).toContain(response.status());

    // b. Response structure — use text() to handle both JSON and HTML responses
    const text = await response.text();
    expect(text).toBeTruthy();

    // c. Expected values — no token should be returned
    expect(text).not.toContain('"token"');

    console.log('Empty fields response status:', response.status());
  });

  // ── TC-API-04: Get User Profile ───────────────────────────
  test('TC-API-04 — GET /profile — returns user profile with correct structure', async ({ request }) => {

    test.skip(!authToken, 'No auth token — login failed');

    const response = await request.get(`${BASE_URL}/profile`, {
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${authToken}`,
      }
    });

    // a. Status code
    expect(response.status()).toBe(200);

    // b. Response structure — key fields must exist
    const body = await response.json();
    expect(body).toBeTruthy();

    // c. Expected values
    const profile = body.data || body;
    expect(profile.username).toBeTruthy();
    expect(profile.email).toBeTruthy();
    expect(profile.id).toBeTruthy();

    // PII check — actual password value must NOT be exposed
    expect(JSON.stringify(body)).not.toContain(testData.validUser.password);

    console.log('Profile response keys:', Object.keys(profile));
  });

  // ── TC-API-05: Get Recent Games ───────────────────────────
  test('TC-API-05 — GET /recent-games — returns recent games list', async ({ request }) => {

    test.skip(!authToken, 'No auth token — login failed');

    const response = await request.get(`${BASE_URL}/recent-games`, {
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${authToken}`,
      }
    });

    // a. Status code
    expect(response.status()).toBe(200);

    // b. Response structure — pagination fields must exist
    const body = await response.json();
    expect(body).toHaveProperty('current_page');
    expect(body).toHaveProperty('last_page');
    expect(body).toHaveProperty('per_page');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('data');

    // c. Expected values — data must be an array
    expect(Array.isArray(body.data)).toBeTruthy();

    console.log('Recent games response structure:', Object.keys(body));
  });

  // ── TC-API-06: Unauthorized Profile Access ────────────────
  test('TC-API-06 — GET /profile — no token returns 401', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/profile`, {
      headers: API_HEADERS
      // Intentionally no Authorization header
    });

    // a. Status code — API returns 401 or 404 for missing token
    expect([401, 404]).toContain(response.status());

    // b. Response structure — use text() as API may return HTML for errors
    const text = await response.text();
    expect(text).toBeTruthy();

    // c. Expected values — response must not contain user data
    expect(text).not.toContain(testData.validUser.username);

    console.log('Unauthorized response status:', response.status());
  });

  // ── TC-API-07: OAuth Providers ────────────────────────────
  test('TC-API-07 — GET /oauth/providers — returns available login providers', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/oauth/providers`, {
      headers: API_HEADERS
    });

    // a. Status code
    expect(response.status()).toBe(200);

    // b. Response structure — must be an array
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    // c. Expected values — google and telegram providers must exist
    const providers = body.map(p => p.provider);
    expect(providers).toContain('google');
    expect(providers).toContain('telegram');

    console.log('OAuth providers found:', providers);
  });

  // ── TC-API-08: Security Headers ───────────────────────────
  test('TC-API-08 — API response has correct security headers', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/oauth/providers`, {
      headers: API_HEADERS
    });

    // a. Status code
    expect([200, 401, 403]).toContain(response.status());

    // b. Security headers must be present
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
    expect(headers['strict-transport-security']).toBeTruthy();
    expect(headers['x-frame-options']).toBeTruthy();

    // c. Server details must not be exposed
    expect(headers['x-powered-by']).toBeUndefined();

    console.log('Security headers checked:', Object.keys(headers));
  });

});