/**
 * Large File Handler for OneCore v2.0
 * Reads files in chunks to avoid memory issues with large .so files (up to 500MB+).
 */

export type ProgressCallback = (percentage: number) => void;

export const readFileInChunks = async (
  file: File,
  chunkSize: number = 10 * 1024 * 1024, // 10MB chunks
  onProgress?: ProgressCallback
): Promise<Uint8Array> => {
  const totalSize = file.size;
  const result = new Uint8Array(totalSize);
  let offset = 0;

  const reader = file.stream().getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    result.set(value, offset);
    offset += value.length;

    if (onProgress) {
      onProgress(Math.round((offset / totalSize) * 100));
    }
  }

  return result;
};

/**
 * Alternative: Read only specific sections if we want to be even more memory efficient.
 * For now, we read the whole file into a Uint8Array but using streams to avoid browser crashes.
 */
export const getFileBuffer = async (file: File, onProgress?: ProgressCallback): Promise<Uint8Array> => {
  return await readFileInChunks(file, 10 * 1024 * 1024, onProgress);
};
