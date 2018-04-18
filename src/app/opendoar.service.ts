import { Injectable } from '@angular/core';
import {FileModel} from './file.model';
import {RepoModel} from './repo.model';
import {HttpClient} from '@angular/common/http';
const GeoCode = require('geo-coder').GeoCode;

@Injectable()
export class OpenDoarService {

  repoTypeMapping: Map<String, Array<string>> = new Map<String, Array<string>>();
  repoDefaultType = 'datasets'; // Datasets
  repoDefaultCountry = 'at'; // Austria

  constructor(private http: HttpClient) {
    // create the type mapping for fetching repositories
    // PDFs:
    this.repoTypeMapping.set('application/pdf',
      [
        'journal_articles',
        'unpub_reports_and_working_papers',
        'conference_and_workshop_papers',
        'theses_and_dissertations'
      ]);

    // E-Books:
    this.repoTypeMapping.set('', ['books_chapters_and_sections']);
    // TODO add ebook mimetypes

    // Datasets:
    this.repoTypeMapping.set('application/json', ['datasets']);
    // TODO add other dataset mimetypes

    // Multimedia:
    this.repoTypeMapping.set('', ['multimedia_and_audio_visual']);
    // TODO add other multimedia mimetypes

    // Software:
    this.repoTypeMapping.set('', ['software']);
    // TODO add software mimetypes
  }

  public fetchRepositories(file: FileModel): Promise<RepoModel[]> {
    return new Promise<RepoModel[]>((resolve, reject) => {
      // find the different repositories for the output types
      const repositoryTypes: Set<string> = new Set<string>();

      // find the repository numbers for the mimeType and add them to the respositoryTypes set
      const repoTypes = this.repoTypeMapping.get(file.mimeType);

      // if the repository type could not be determined, assume the default repo type
      if (!repoTypes) {
        console.log('Repository type for output file ' + JSON.stringify(file)
          + 'could not be found. Using default repo type ' + this.repoDefaultType);
        repositoryTypes.add(this.repoDefaultType);
      } else {
        repoTypes.forEach((repoType) => repositoryTypes.add(repoType));
      }

      // fetch the countryCode
      // FIXME a limit higher than 30 causes an internal server error,
      // but this could mean that there are less than 3 options for the user
      this.getCountryCode().then((country) => {
        this.http.get('/opendoar?api-key=45E885A2-4336-11E8-951F-3A1257C617BB&limit=30'
          + '&item-type=repository&format=Json&filter=[[\"country\",\"equals\",\"' + country + '\"]]').subscribe(
          (repoData: any) => {
            if (!!repoData && !!repoData.items && repoData.items.length > 0) {
              // filter for repos with the needed content type and only take the first three
              console.log(repoData.items);
              resolve((<RepoModel[]>repoData.items)
                .filter((repo) =>
                  repo.repository_metadata.content_types.some((entry) => repoTypes.includes(entry)))
                .slice(0, 2));
            } else {
              reject('No repositories found for your location.');
            }
          },
          reject,
          () => console.log('Done performing OpenDOAR repo search.')
        );
      }).catch(reject);
    });
  }

  private getCountryCode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((location) => {
          const geoCode = new GeoCode();
          geoCode.reverse(location.coords.latitude, location.coords.longitude).then(result => {
              resolve(result.raw.address.country_code.toLowerCase());
            }).catch((err) => {
              alert('Location could not be determined (probably has been blocked). Using default country (Austria).');
              resolve(this.repoDefaultCountry);
          });
        }, (error) => {
          alert('Location could not be determined (probably has been blocked). Using default countries (Austria).');
          resolve(this.repoDefaultCountry);
        });
      } else {
        alert('Geolocation is not supported by this browser. Using default countries (Austria).');
        resolve(this.repoDefaultCountry);
      }
    });
  }

}
