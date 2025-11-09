// src/lib/parser/magnetParser.ts

export interface MagnetData {
  infoHash: string; // hex lowercase
  infoHashBase32: string;
  trackers: string[][];
  name?: string;
}

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32ToBytes(str: string): Uint8Array {
  str = str.toUpperCase().replace(/=/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of str) {
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) throw new Error('Invalid base32 character');
    value = (value << 5) | idx;
    bits += 5;
    while (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

function bytesToBase32(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let result = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    result += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  const padLength = Math.ceil((bytes.length * 8) / 5) - result.length;
  return result + '='.repeat(padLength);
}

export function parseMagnet(uri: string): MagnetData {
  if (!uri.startsWith('magnet:?')) {
    throw new Error('Invalid magnet URI');
  }

  const params = new URLSearchParams(uri.slice(8));
  const xt = params.get('xt');
  if (!xt || !xt.startsWith('urn:btih:')) {
    throw new Error('Missing or invalid xt parameter (btih)');
  }

  let infoHashInput = xt.slice(9);
  let infoHash = '';
  let infoHashBase32 = '';

  if (infoHashInput.length === 40) {
    // hex
    infoHash = infoHashInput.toLowerCase();
    const bytes = new Uint8Array(20);
    for (let i = 0; i < 40; i += 2) {
      bytes[i / 2] = parseInt(infoHash.slice(i, i + 2), 16);
    }
    infoHashBase32 = bytesToBase32(bytes);
  } else if (infoHashInput.length === 32) {
    // base32
    infoHashBase32 = infoHashInput.toUpperCase();
    const bytes = base32ToBytes(infoHashInput);
    if (bytes.length !== 20) throw new Error('Invalid btih length');
    infoHash = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    throw new Error('Invalid btih length');
  }

  const trs = params.getAll('tr');
  const trackers: string[][] = trs.map(tr => [tr]);

  const name = params.get('dn') || undefined;

  return { infoHash, infoHashBase32, trackers, name };
}