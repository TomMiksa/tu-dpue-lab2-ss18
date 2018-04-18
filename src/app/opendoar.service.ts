import { Injectable } from '@angular/core';
import {FileModel} from './file.model';
import {RepoModel} from './repo.model';
import {countries, Country} from 'countries-list';
const GeoCode = require('geo-coder').GeoCode;

@Injectable()
export class OpenDoarService {

  repoTypeMapping: Map<String, Array<number>> = new Map<String, Array<number>>();
  repoDefaultType = 9; // Datasets
  repoDefaultCountries = ['at', 'eu']; // Austria, Europe

  constructor() {
    // create the type mapping for fetching repositories

    // Default for PDFs is that it's a finished paper
    // 1 Research papers (pre- and postprints)
    // 3 Research papers (postprints only)
    this.repoTypeMapping.set('application/pdf', [1, 3]);
    // 8 Books chapters and sections
    // TODO add ebook mimetypes

    // Default for json is that it's a dataset
    // 9 Datasets
    this.repoTypeMapping.set('application/json', [9]);
    // 11 Multimedia and audio-visual materials
    // TODO add audio mimetypes

    // 12 Software
    // TODO add software mimetypes
  }

  public fetchRepositories(file: FileModel): Promise<RepoModel[]> {
    return new Promise<RepoModel[]>((resolve, reject) => {
      // find the different repositories for the output types
      const repositoryTypes: Set<number> = new Set<number>();

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
      const rt = Array.from(repositoryTypes).join(',');
      console.log('Looking for repositories accepting the following types: ' + rt);

      // fetch the countryCode
      this.getCountryCode().then((country) => {
        console.log('About to call http://opendoar.org/api.php?co=' + country + '&rt=' + rt);
        // TODO get repos with the API call
        // TODO return them as in a promise
        // TODO call resolve with the repos
        const repos: RepoModel[] = [{url: 'test'}];
        resolve(repos);
      }).catch(reject);
    });
  }

  private getCountryCode(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((location) => {
          const geoCode = new GeoCode();
          geoCode.reverse(location.coords.latitude, location.coords.longitude).then(result => {
              const results = [];
              const countryCode = result.raw.address.country_code;
              results.push(countryCode);
              // TODO continent does not seem to work?!
              const country = countries[countryCode.toUpperCase()];
              if (country && country.continent) {
                results.push(country.continent.toLowerCase());
              }
              resolve(results);
            }).catch((err) => {
              alert('Location could not be determined (probably has been blocked). Using default countries (Austria, Europe)');
              resolve(this.repoDefaultCountries);
          });
        }, (error) => {
          alert('Location could not be determined (probably has been blocked). Using default countries (Austria, Europe)');
          resolve(this.repoDefaultCountries);
        });
      } else {
        alert('Geolocation is not supported by this browser. Using default countries (Austria, Europe).');
        resolve(this.repoDefaultCountries);
      }
    });
  }

}
