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
    this.repoTypeMapping.set('application/vnd.amazon.ebook', ['books_chapters_and_sections']);
    this.repoTypeMapping.set('application/epub+zip', ['books_chapters_and_sections']);

    // Datasets:
    this.repoTypeMapping.set('application/json', ['datasets']);
    this.repoTypeMapping.set('text/csv', ['datasets']);
    this.repoTypeMapping.set('application/x-7z-compressed', ['datasets']);
    this.repoTypeMapping.set('application/zip', ['datasets']);
    this.repoTypeMapping.set('application/x-bzip', ['datasets']);
    this.repoTypeMapping.set('application/x-bzip2', ['datasets']);
    this.repoTypeMapping.set('application/x-tar', ['datasets']);
    this.repoTypeMapping.set('application/x-rar-compressed', ['datasets']);

    // Multimedia:
    this.repoTypeMapping.set('image/gif', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('image/x-icon', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('image/jpeg', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('image/png', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('image/svg+xml', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('image/tiff', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('image/webp', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('video/x-msvideo', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('video/mpeg', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('video/ogg', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('video/webm', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('video/3gpp', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('video/3gpp2', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('application/ogg', ['multimedia_and_audio_visual']);
    this.repoTypeMapping.set('audio/ogg', ['multimedia_and_audio_visual']);

    // Software:
    this.repoTypeMapping.set('application/octet-stream', ['software']);
    this.repoTypeMapping.set('application/javascript', ['software']);
    this.repoTypeMapping.set('application/ecmascript', ['software']);
    this.repoTypeMapping.set('application/java-archive', ['software']);
    this.repoTypeMapping.set('application/typescript', ['software']);
    this.repoTypeMapping.set('application/x-sh', ['software']);
    this.repoTypeMapping.set('application/x-csh', ['software']);
  }

  public fetchRepositories(file: FileModel): Promise<RepoModel[]> {
    return new Promise<RepoModel[]>((resolve, reject) => {
      // find the different repositories for the output types
      const repositoryTypes: Set<string> = new Set<string>();

      // find the repository numbers for the mimeType and add them to the respositoryTypes set
      const repoTypes = this.repoTypeMapping.get(file.mimeType);

      // if the repository type could not be determined, assume the default repo type
      if (repoTypes === undefined || repoTypes.length === 0) {
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
                  repo.repository_metadata.content_types.some((entry) => repositoryTypes.has(entry)))
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
