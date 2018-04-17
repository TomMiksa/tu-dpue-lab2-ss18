export class FileModel {
  constructor(
    public file: File,
    public mimeType: String,
    public ioType: 'input' | 'output',
    public amount: number
  ) {}
}
