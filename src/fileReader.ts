import lineByLine from 'n-readlines';
import path from 'path';

export default class FileReader {
  static getLines = <T>(relativePath: string, parser: (line: string) => T | undefined): T[] => {
    const inputPath = path.resolve(__dirname, relativePath);

    const lines: T[] = [];
    const liner = new lineByLine(inputPath);

    let buffer: false | Buffer;
    while ((buffer = liner.next())) {
      const line = buffer.toString('ascii').trimEnd();

      const parsed = parser(line);
      if (parsed !== undefined) {
        lines.push(parsed);
      }
    }

    return lines;
  };
}
