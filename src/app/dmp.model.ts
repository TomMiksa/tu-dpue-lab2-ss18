import {FileModel} from './file.model';
import {ResearcherModel} from './researcher.model';
import {RepoModel} from './repo.model';

export class DmpModel {
  constructor(
    public projectName?: String,
    public researcherName?: String,
    public tissSearchResult?: ResearcherModel[],
    public selectedTissResearcher?: ResearcherModel,
    public inputFileSample?: FileModel,
    public outputFileSample?: FileModel,
    public repoSearchResult?: RepoModel[],
    public selectedRepo?: RepoModel,
  ) { }
}
