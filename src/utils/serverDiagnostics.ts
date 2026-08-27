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

    // WebSocket protocol check
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/live?token=diagnostic_probe`;
    console.log(`[Diagnostics] WebSocket endpoint target URL: ${wsUrl}`);

    // Test WebSocket handshake capability
    try {
      const ws = new WebSocket(wsUrl);
      const wsTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn('[Diagnostics] ⚠️ WebSocket diagnostic probe connection timed out (expected if auth token is test probe).');
          ws.close();
        }
      }, 3000);

      ws.onopen = () => {
        clearTimeout(wsTimeout);
        console.log('[Diagnostics] ✅ WebSocket probe connection established successfully.');
        ws.close();
      };

      ws.onerror = (err) => {
        clearTimeout(wsTimeout);
        console.log('[Diagnostics] ℹ️ WebSocket probe closed/errored as expected for diagnostic probe token.');
      };
    } catch (wsErr) {
      console.warn('[Diagnostics] WebSocket test probe exception:', wsErr);
    }

  } catch (error) {
    console.error('[Diagnostics] Failed to reach /api/diagnostics endpoint:', error);
  } finally {
    console.groupEnd();
  }
}
