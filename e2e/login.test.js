/* global describe, beforeAll, beforeEach, it, expect, device, element, by */
describe('GRI Mobile Portal E2E Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display Welcome Screen and navigate to Home Dashboard', async () => {
    await expect(element(by.text('Gandhigram Rural Institute'))).toBeVisible();
    await element(by.text('Enter Portal')).tap();
    await expect(element(by.text('University Services'))).toBeVisible();
  });
});
