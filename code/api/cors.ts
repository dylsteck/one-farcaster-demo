import { setCurrentRequestHeaders } from "one/headers";

function isValidOrigin(origin?: string | null): origin is string {
    return (
      typeof origin === 'string' &&
      (
        origin === 'http://localhost:8081' || 
        origin === 'http://127.0.0.1:8081')
    );
}

export const setupCors = (req: Request) => {
    const origin = req.headers.get('origin');
    if (isValidOrigin(origin)) {
      setCurrentRequestHeaders((headers) => {
        headers.set('Access-Control-Allow-Origin', origin);
        headers.set('Access-Control-Allow-Credentials', 'true');
        headers.set('Allow', 'GET, POST, PUT, DELETE, PATCH');
      });
    }
};