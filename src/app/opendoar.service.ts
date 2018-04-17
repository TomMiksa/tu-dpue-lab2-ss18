import { Injectable } from '@angular/core';
import {FileModel} from './file.model';

// TODO configure NGiNX upstream
@Injectable()
export class OpenDoarService {

  repoTypeMapping: Map<String, Array<number>> = new Map<String, Array<number>>();
  repoDefaultType = 9;
  repoDefaultCountry = 'at'; // Austria

  constructor() {
    // TODO add more 'mime type to repository' mappings here
    // create the type mapping for fetching repositories
    // 1 Research papers (pre- and postprints)
    // this.repoTypeMapping.set('application/pdf', 1);
    // 2 Research papers (preprints only)
    // 3 Research papers (postprints only)
    // 4 Bibliographic references
    // 5 Conference and workshop papers
    // 6 Theses and dissertations
    // 7 Unpublished reports and working papers
    // 8 Books chapters and sections
    // 9 Datasets
    // this.repoTypeMapping.set('application/json', 9);
    // 10 Learning Objects
    // 11 Multimedia and audio-visual materials
    // 12 Software
    // 13 Patents
    // 14 Other special item types
  }

  public fetchRepositories(files: FileModel[]) {
    // find the different repositories for the output types
    const repositoryTypes: Set<number> = new Set<number>();
    // TODO
    // this.model.files.filter((f) => f.ioType === 'output')
    //  .forEach((f) => repositoryTypes.add(this.repoTypeMapping.get(f.mimeType) || [this.repoDefaultType));
    // const rt = Array.from(repositoryTypes).map((r) => r.join(',')).join(',');
    // console.log('Looking for repositories accepting the following types: ' + rt);

    // TODO find ISO-3166 2 country code of the user (use repoDefaultCountry if access not granted)
    // TODO Attention! country code needs to be lower case!
    /*if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        console.log(location.coords);
      }, (error) => {
        console.log('Location could not be determined (probably has been blocked)!');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }*/

    // TODO use the OpenDOAR API to receive the best repositories for the given outputs
    // call https://opendoar.org/api.php?co=co&rt=rt&show=min,policy
    console.log('We should definitely fetch the OpenDOAR repositories here...');
  }

}
