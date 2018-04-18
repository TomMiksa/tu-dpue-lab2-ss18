import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResearcherModel} from './researcher.model';

// really dirty hack because fast-xml-parser/src/parser.d.ts contains typescript compile error
const parse = require('fast-xml-parser/src/parser.js');

@Injectable()
export class TissService {

  constructor(private http: HttpClient) { }

  public fetchTissData(researcherName: String): Promise<ResearcherModel[]> {
    return new Promise<ResearcherModel[]>((resolve, reject) => {
      this.http.get('/tiss/person/v21/psuche?q="' + researcherName + '"').subscribe(
        (data: PersonSearchResult) => {
          if (!data.results || data.results.length === 0) {
            reject('Search for name did not return any results!');
          } else {
            const result: ResearcherModel[] = [];
            for (const singleResult of data.results) {
              const tissID = singleResult.id;
              this.http.get(`/tiss/person/v21/id/${tissID}`, { responseType: 'text' }).subscribe(
                (personData: string) => {
                  const parsed = parse.parse(personData, {ignoreNameSpace: true});
                  console.log(JSON.stringify(parsed));
                  if (!!parsed && !!parsed.tuvienna && !!parsed.tuvienna.person) {
                    const model: ResearcherModel = parsed.tuvienna.person;
                    result.push(model);
                  } else {
                    reject('No person details found for ID ' + tissID);
                  }
                },
                (err) => {
                  console.log(err);
                  reject(err);
                },
                () => console.log('Done loading TISS personal data for ID ' + tissID)
              );
            }
            resolve(result);
          }
        },
        reject,
        () => console.log('Done performing TISS search.')
      );
    });
  }

}

interface PersonSearchResult {
  results: PersonResult[];
}

interface PersonResult {
  id: number;
}
