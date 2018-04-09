export class FileModel {
  constructor(
    public name: String,
    public mimeType: String,
    public size: number,
    public ioType: 'input' | 'output',
    public amount: number
  ) {}
}
