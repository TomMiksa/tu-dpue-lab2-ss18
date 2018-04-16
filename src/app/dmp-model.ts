import {FileModel} from './file-model';

export class DmpModel {
  constructor(
    public projectName?: String,
    public researcherName?: String,
    public files: FileModel[] = []
  ) {}
}
