/**
 * Memory-efficient ELF32 and ELF64 Parser for OneCore v2.0
 * Reads only necessary headers and sections from the File object.
 */

export interface ELFSection {
  name: string;
  offset: number;
  size: number;
  addr: bigint;
  type: number;
}

export interface ELFSymbol {
  name: string;
  value: bigint;
  size: bigint;
  info: number;
  other: number;
  shndx: number;
}

export interface ELFInfo {
  is64: boolean;
  baseAddr: bigint;
  sections: ELFSection[];
  symbols: ELFSymbol[];
  // We don't store the full buffer here anymore to save memory
}

export const parseELF = async (file: File): Promise<ELFInfo> => {
  // Step 1: Read ELF Header (first 64 bytes)
  const headerBuffer = await file.slice(0, 64).arrayBuffer();
  const header = new Uint8Array(headerBuffer);

  // Check ELF Magic: 0x7F 'E' 'L' 'F'
  if (header[0] !== 0x7F || header[1] !== 0x45 || header[2] !== 0x4C || header[3] !== 0x46) {
    throw new Error('Not a valid ELF file');
  }

  const is64 = header[4] === 2; // 1 for 32-bit, 2 for 64-bit
  const view = new DataView(headerBuffer);

  let shoff: bigint;
  let shentsize: number;
  let shnum: number;
  let shstrndx: number;

  if (is64) {
    shoff = view.getBigUint64(40, true);
    shentsize = view.getUint16(58, true);
    shnum = view.getUint16(60, true);
    shstrndx = view.getUint16(62, true);
  } else {
    shoff = BigInt(view.getUint32(32, true));
    shentsize = view.getUint16(46, true);
    shnum = view.getUint16(48, true);
    shstrndx = view.getUint16(50, true);
  }

  // Step 2: Read Section Headers
  const shTableSize = shnum * shentsize;
  const shTableBuffer = await file.slice(Number(shoff), Number(shoff) + shTableSize).arrayBuffer();
  const shView = new DataView(shTableBuffer);

  // Step 3: Get Section Name String Table (.shstrtab)
  const shstrtabHeaderOffset = shstrndx * shentsize;
  let shstrtabOffset: number;
  let shstrtabSize: number;
  if (is64) {
    shstrtabOffset = Number(shView.getBigUint64(shstrtabHeaderOffset + 24, true));
    shstrtabSize = Number(shView.getBigUint64(shstrtabHeaderOffset + 32, true));
  } else {
    shstrtabOffset = shView.getUint32(shstrtabHeaderOffset + 16, true);
    shstrtabSize = shView.getUint32(shstrtabHeaderOffset + 20, true);
  }

  const shstrtabBuffer = await file.slice(shstrtabOffset, shstrtabOffset + shstrtabSize).arrayBuffer();
  const shstrtab = new Uint8Array(shstrtabBuffer);

  const sections: ELFSection[] = [];
  let baseAddr = 0n;

  // Step 4: Parse Section Headers
  for (let i = 0; i < shnum; i++) {
    const entryOffset = i * shentsize;
    
    const nameIndex = shView.getUint32(entryOffset, true);
    const type = shView.getUint32(entryOffset + 4, true);
    let addr: bigint;
    let offset: bigint;
    let size: bigint;

    if (is64) {
      addr = shView.getBigUint64(entryOffset + 16, true);
      offset = shView.getBigUint64(entryOffset + 24, true);
      size = shView.getBigUint64(entryOffset + 32, true);
    } else {
      addr = BigInt(shView.getUint32(entryOffset + 12, true));
      offset = BigInt(shView.getUint32(entryOffset + 16, true));
      size = BigInt(shView.getUint32(entryOffset + 20, true));
    }

    // Extract name from shstrtab
    let name = '';
    let j = nameIndex;
    while (shstrtab[j] !== 0 && j < shstrtab.length) {
      name += String.fromCharCode(shstrtab[j]);
      j++;
    }

    sections.push({
      name,
      offset: Number(offset),
      size: Number(size),
      addr,
      type
    });

    if (addr > 0n && (baseAddr === 0n || addr < baseAddr)) {
      baseAddr = addr;
    }
  }

  // Step 5: Parse Symbol Table (.symtab or .dynsym)
  const symbols: ELFSymbol[] = [];
  const symSection = sections.find(s => s.name === '.symtab' || s.name === '.dynsym');
  const strSection = sections.find(s => s.name === '.strtab' || s.name === '.dynstr');

  if (symSection && strSection) {
    const symEntrySize = is64 ? 24 : 16;
    const symCount = symSection.size / symEntrySize;
    
    // Read symbol table and string table in chunks if they are too large
    // For now, we read them as a whole since they are usually small compared to .text
    const symBuffer = await file.slice(symSection.offset, symSection.offset + symSection.size).arrayBuffer();
    const symView = new DataView(symBuffer);
    const strBuffer = await file.slice(strSection.offset, strSection.offset + strSection.size).arrayBuffer();
    const strData = new Uint8Array(strBuffer);

    for (let i = 0; i < symCount; i++) {
      const symOffset = i * symEntrySize;
      
      let st_name: number;
      let st_info: number;
      let st_other: number;
      let st_shndx: number;
      let st_value: bigint;
      let st_size: bigint;

      if (is64) {
        st_name = symView.getUint32(symOffset, true);
        st_info = symView.getUint8(symOffset + 4);
        st_other = symView.getUint8(symOffset + 5);
        st_shndx = symView.getUint16(symOffset + 6, true);
        st_value = symView.getBigUint64(symOffset + 8, true);
        st_size = symView.getBigUint64(symOffset + 16, true);
      } else {
        st_name = symView.getUint32(symOffset, true);
        st_value = BigInt(symView.getUint32(symOffset + 4, true));
        st_size = BigInt(symView.getUint32(symOffset + 8, true));
        st_info = symView.getUint8(symOffset + 12);
        st_other = symView.getUint8(symOffset + 13);
        st_shndx = symView.getUint16(symOffset + 14, true);
      }

      let name = '';
      let j = st_name;
      while (strData[j] !== 0 && j < strData.length) {
        name += String.fromCharCode(strData[j]);
        j++;
      }

      if (name.length > 0) {
        symbols.push({
          name,
          value: st_value,
          size: st_size,
          info: st_info,
          other: st_other,
          shndx: st_shndx
        });
      }
    }
  }

  return {
    is64,
    baseAddr,
    sections,
    symbols
  };
};
