// src/lib/parser/torrentParser.ts

import { decode, encode } from './bencode';

interface FileInfo {
  path: string;
  length: number;
}

export interface TorrentData {
  infoHash: string; // hex lowercase
  infoHashBase32: string;
  trackers: string[][]; // array of tiers, each tier is array of URLs
  isPrivate: boolean;
  files: FileInfo[];
}

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

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

export async function parseTorrent(file: File): Promise<TorrentData> {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const torrent = decode(data);

  if (!torrent.info) {
    throw new Error('Invalid torrent file: missing info');
  }

  const infoBencoded = encode(torrent.info);
  const hashBuffer = await crypto.subtle.digest('SHA-1', infoBencoded);
  const hashBytes = new Uint8Array(hashBuffer);
  const infoHash = Array.from(hashBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const infoHashBase32 = bytesToBase32(hashBytes);

  let trackers: string[][] = [];
  if (torrent['announce-list']) {
    trackers = torrent['announce-list'].map((tier: string[]) => tier.filter((tr: string) => typeof tr === 'string'));
  } else if (torrent.announce && typeof torrent.announce === 'string') {
    trackers = [[torrent.announce]];
  }

  const isPrivate = !!torrent.info.private && torrent.info.private === 1;

  let files: FileInfo[] = [];
  if (torrent.info.files) {
    files = torrent.info.files.map((f: any) => ({
      path: Array.isArray(f.path) ? f.path.join('/') : f.path,
      length: f.length
    }));
  } else {
    files = [{
      path: torrent.info.name,
      length: torrent.info.length
    }];
  }

  return { infoHash, infoHashBase32, trackers, isPrivate, files };
}