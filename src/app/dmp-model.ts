import {FileModel} from './file-model';

export class DmpModel {
  constructor(
    public name?: String,
    public files: FileModel[] = []
  ) {}
}
