'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { SERVICES, buildRequestPayload, isFormValid } = require('./myWorkData');

test('catalogue contient huit services avec codes uniques', () => {
  assert.equal(SERVICES.length, 8);
  assert.equal(new Set(SERVICES.map((service) => service.code)).size, 8);
});

test('payload normalise les coordonnées et conserve le service choisi', () => {
  const payload = buildRequestPayload({ name: ' Ada ', email: ' ADA@EXAMPLE.COM ', phone: '', preferredDate: '', message: ' Hello ', consent: true }, SERVICES[0]);
  assert.deepEqual(payload, { kind: 'quote', serviceCode: 'developer.fullstack-web', name: 'Ada', email: 'ada@example.com', message: 'Hello', consent: true });
});

test('formulaire exige nom, email et consentement', () => {
  assert.equal(isFormValid({ name: 'Ada', email: 'ada@example.com', consent: true }), true);
  assert.equal(isFormValid({ name: 'A', email: 'ada@example.com', consent: true }), false);
  assert.equal(isFormValid({ name: 'Ada', email: 'invalid', consent: true }), false);
  assert.equal(isFormValid({ name: 'Ada', email: 'ada@example.com', consent: false }), false);
});
