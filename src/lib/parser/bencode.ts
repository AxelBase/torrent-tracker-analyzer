// src/lib/parser/bencode.ts

export function decode(data: Uint8Array): any {
  let pos = 0;

  function parse(): any {
    const byte = data[pos];
    const char = String.fromCharCode(byte);

    if (char === 'd') {
      pos++;
      const dict: Record<string, any> = {};
      while (String.fromCharCode(data[pos]) !== 'e') {
        const key = parse() as string;
        const value = parse();
        dict[key] = value;
      }
      pos++;
      return dict;
    } else if (char === 'l') {
      pos++;
      const list: any[] = [];
      while (String.fromCharCode(data[pos]) !== 'e') {
        list.push(parse());
      }
      pos++;
      return list;
    } else if (char === 'i') {
      pos++;
      const end = data.findIndex((b, i) => i >= pos && b === 101); // 'e'
      const numStr = new TextDecoder().decode(data.subarray(pos, end));
      const num = Number(numStr);
      pos = end + 1;
      return num;
    } else if (byte >= 48 && byte <= 57) { // 0-9
      const colon = data.findIndex((b, i) => i >= pos && b === 58); // ':'
      const lenStr = new TextDecoder().decode(data.subarray(pos, colon));
      const len = parseInt(lenStr, 10);
      pos = colon + 1;
      const str = new TextDecoder().decode(data.subarray(pos, pos + len));
      pos += len;
      return str;
    } else {
      throw new Error(`Invalid bencode at position ${pos}`);
    }
  }

  const result = parse();
  if (pos !== data.length) throw new Error('Extra data after parsing');
  return result;
}

export function encode(value: any): Uint8Array {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return new TextEncoder().encode(`i${value}e`);
  } else if (typeof value === 'string') {
    const bytes = new TextEncoder().encode(value);
    return Uint8Array.from([...new TextEncoder().encode(`${bytes.length}:`), ...bytes]);
  } else if (Array.isArray(value)) {
    const parts = value.map(encode);
    let inner = new Uint8Array();
    for (const part of parts) {
      const newInner = new Uint8Array(inner.length + part.length);
      newInner.set(inner);
      newInner.set(part, inner.length);
      inner = newInner;
    }
    const l = new TextEncoder().encode('l');
    const e = new TextEncoder().encode('e');
    const full = new Uint8Array(l.length + inner.length + e.length);
    full.set(l);
    full.set(inner, l.length);
    full.set(e, l.length + inner.length);
    return full;
  } else if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value).sort();
    let inner = new Uint8Array();
    for (const key of keys) {
      const kbytes = encode(key);
      const vbytes = encode(value[key]);
      const newInner = new Uint8Array(inner.length + kbytes.length + vbytes.length);
      newInner.set(inner);
      newInner.set(kbytes, inner.length);
      newInner.set(vbytes, inner.length + kbytes.length);
      inner = newInner;
    }
    const d = new TextEncoder().encode('d');
    const e = new TextEncoder().encode('e');
    const full = new Uint8Array(d.length + inner.length + e.length);
    full.set(d);
    full.set(inner, d.length);
    full.set(e, d.length + inner.length);
    return full;
  } else {
    throw new Error('Unsupported type for bencoding');
  }
}