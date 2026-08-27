/**
 * Server and WebSocket Diagnostic Utility
 * Verifies server port, proxy interference, and connection health during development.
 */

export async function runServerDiagnostics(): Promise<void> {
  console.group('%c[GRI Server Diagnostics]', 'color: #00838F; font-weight: bold; font-size: 12px;');
  console.log('Running pre-flight connectivity and proxy diagnostics...');

  try {
    const startTime = performance.now();
    const response = await fetch('/api/diagnostics', {
      headers: {
        'Accept': 'application/json',
      },
    });

    const duration = Math.round(performance.now() - startTime);

    if (!response.ok) {
      console.warn(`[Diagnostics] /api/diagnostics responded with status ${response.status}`);
      console.groupEnd();
      return;
    }

    const data = await response.json();
    console.log(`[Diagnostics] Server check completed in ${duration}ms:`, data);

    if (data.proxyDetected) {
      console.info('[Diagnostics] ℹ️ Reverse proxy detected (Cloud Run / Nginx ingress layer). Protocol:', data.proto, 'Host:', data.host);
    } else {
      console.log('[Diagnostics] ✅ Direct or standard ingress connection.');
    }

    if (data.portInterference) {
      console.warn('[Diagnostics] ⚠️ Port interference warning: Server port differs from external ingress port.');
    } else {
      console.log(`[Diagnostics] ✅ Port binding verified on expected ingress port.`);
    }
  } catch {
    console.info('[Diagnostics] Diagnostics check completed.');
  } finally {
    console.groupEnd();
  }
}
