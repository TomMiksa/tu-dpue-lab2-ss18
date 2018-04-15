import {FileModel} from './file-model';

export class DmpModel {
  constructor(
    public name?: String,
    public researcher?: String,
    public files: FileModel[] = []
  ) {}
}
