import {Injectable} from '@angular/core';
import {ResearcherModel} from './researcher.model';
import {RepoModel} from './repo.model';
import {FileModel} from './file.model';
import {LicenseModel} from './license.model';


@Injectable()
export class PDFService {

  constructor() {
  }

  public buildTableBody(inputfilemodel: FileModel, outputfilemodel: FileModel) {
    const body = [];


    body.push(['Name', 'MimeType', 'Amount', 'Size', 'Total Size', 'Input/Output']);

    let dataRow = [];
    dataRow.push(inputfilemodel.file.name);
    dataRow.push(inputfilemodel.mimeType);
    dataRow.push(inputfilemodel.amount);
    dataRow.push((inputfilemodel.file.size / 1000).toFixed(2) + ' kBytes');
    dataRow.push(((inputfilemodel.file.size / 1000) * inputfilemodel.amount).toFixed(2) + ' kBytes');
    dataRow.push('Input');
    body.push(dataRow);
    dataRow = [];
    dataRow.push(outputfilemodel.file.name);
    dataRow.push(outputfilemodel.mimeType);
    dataRow.push(outputfilemodel.amount);
    dataRow.push((outputfilemodel.file.size / 1000).toFixed(2) + ' kBytes');
    dataRow.push(((outputfilemodel.file.size / 1000) * outputfilemodel.amount).toFixed(2) + ' kBytes');
    dataRow.push('Output');
    body.push(dataRow);


    return body;
  }

  public table(inputfilemodel: FileModel, outputfilemodel: FileModel ) {
    return {
      table: {
        headerRows: 1,
        body: this.buildTableBody(inputfilemodel, outputfilemodel)
      }
    };
  }

  public buildResearcher(selectedResearcher: ResearcherModel) {
    const researcher = [];
    let researcherString = '';
    if (selectedResearcher.preceding_titles) {
      researcherString += (selectedResearcher.preceding_titles + ' ');
    }
    if (selectedResearcher.firstname) {
      researcherString += (selectedResearcher.firstname +  ' ');
    }
    if (selectedResearcher.lastname) {
      researcherString += (selectedResearcher.lastname);
    }
    if (selectedResearcher.postpositioned_titles) {
      researcherString += (', ' + selectedResearcher.postpositioned_titles);
    }

    researcher.push({text: researcherString});
    if (selectedResearcher.main_email) {
      researcher.push(
        {
          text: 'Email-address: ' + selectedResearcher.main_email
        }
      );
    }
    if (selectedResearcher.main_phone_number) {
      researcher.push(
        {
          text: 'Phone number: ' + selectedResearcher.main_phone_number
        }
      );
    }
    if (selectedResearcher.employee) {
      if (selectedResearcher.employee.employment.organisational_unit) {
      }
      researcher.push(
        {
          text: 'Organisation: ' + selectedResearcher.employee.employment.organisational_unit
        }
      );
    }
    return researcher;
  }

  public repositoryBuilder(selectedRepository: RepoModel) {
    const repository = [];

    repository.push({text: 'For this project the following repository has been chosen to preserve the outputs of the project: \n' });
    for (const i of selectedRepository.repository_metadata.name) {
      if (i.name) {
        repository.push({text: 'Name: ' + i.name + '\n'});
      }
      if (i.acronym) {
        repository.push({text: 'Acronym: ' + i.acronym + '\n'});
      }
    }
    if (selectedRepository.repository_metadata.description) {
      repository.push({text: 'Description: ' + selectedRepository.repository_metadata.description + '\n'});
    }
    if (selectedRepository.repository_metadata.url) {
      repository.push({text: 'More information about the repository can be found at: '
        + selectedRepository.repository_metadata.url + '\n'});
    }
    return repository;
  }

  public buildLicense(selectedLicense: LicenseModel) {
    const license = [];
    license.push({text: 'For this project, the artifacts and data will be licensed under the following license: \n' });
    if (selectedLicense.name && selectedLicense.key) {
      license.push({text: 'Name: ' + selectedLicense.name + ' (' +  selectedLicense.key + ') \n' });
    } else if (selectedLicense.name) {
      license.push({text: 'Name: ' + selectedLicense.name + '\n' });
    }
    if (selectedLicense.description) {
      license.push({text: selectedLicense.description + '\n'});
    }
    license.push({text: 'For more information about the selected license, visit: ' +  selectedLicense.url + '\n'});
    return license;
  }



}
