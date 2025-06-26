import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export function generateSecret(email: string) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, 'DropZone', secret);
  return { secret, otpauth };
}

export async function generateQRCode(otpauth: string) {
  return await QRCode.toDataURL(otpauth);
}

export function verifyToken(token: string, secret: string) {
  return authenticator.verify({ token, secret });
}