export type MockFetch = ReturnType<typeof createMockFetch>;

/** Creates a jest-compatible mock fetch that records calls. */
export function createMockFetch(responses: Response[] = []) {
  const calls: Request[] = [];
  const queue = [...responses];

  const mockFetch = async (input: Request | URL | string, init?: RequestInit): Promise<Response> => {
    const request = new Request(input, init);
    calls.push(request);
    const response = queue.shift();
    if (!response) {
      throw new Error(`Unexpected fetch call: ${request.method} ${request.url}`);
    }
    return response;
  };

  return Object.assign(mockFetch, {
    calls,
    lastCall: () => calls[calls.length - 1],
    callCount: () => calls.length,
  });
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Wraps a namespace method's expected return value in the `{ request, response }` envelope every voxel.shop action responds with. */
export function envelopeResponse(response: unknown, status = 200): Response {
  return jsonResponse({ request: {}, response }, status);
}

export function textResponse(text: string, status = 200): Response {
  return new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain' },
  });
}

export function errorResponse(status: number, body?: unknown): Response {
  return new Response(JSON.stringify(body ?? { message: `HTTP ${status}` }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
