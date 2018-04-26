import {Injectable} from '@angular/core';
import {DmpModel} from './dmp.model';
import {Context, DcCreator, Inputfile, License, Outputfile, Repository, RootObject} from './json.model';

@Injectable()
export class JsonService {

  public getJSON(model: DmpModel) {
    const object = <RootObject>{};
    const context = <Context>{};
    context.dc = 'http://purl.org/dc/elements/1.1/';
    context.dcterms = 'http://purl.org/dc/terms/';
    context.foaf = 'http://xmlns.com/foaf/0.1/';
    context.premis = 'http://www.loc.gov/premis/rdf/v1#';
    object['@context'] = context;
    object['dcterms:title'] = model.projectName;
    object['@type'] = 'dmp:DataManagementPlan';
    const creator = <DcCreator>{};
    creator['@id'] = model.selectedTissResearcher.id;
    creator['foaf:familyName'] = model.selectedTissResearcher.lastname;
    creator['foaf:firstName'] = model.selectedTissResearcher.firstname;
    if (model.selectedTissResearcher.preceding_titles && model.selectedTissResearcher.postpositioned_titles) {
      creator['foaf:title:'] = model.selectedTissResearcher.preceding_titles + ', '  + model.selectedTissResearcher.postpositioned_titles;
    } else if (model.selectedTissResearcher.preceding_titles) {
      creator['foaf:title:'] = model.selectedTissResearcher.preceding_titles;

    } else if (model.selectedTissResearcher.postpositioned_titles) {
      creator['foaf:title:'] = model.selectedTissResearcher.postpositioned_titles;
    }
    creator['foaf:Organization'] = model.selectedTissResearcher.employee.employment.organisational_unit;
    if (model.selectedTissResearcher.employee.employment.websites) {
      creator['foaf:workplaceHomepage'] = model.selectedTissResearcher.employee.employment.websites.website;
    }
    creator['foaf:gender'] = model.selectedTissResearcher.gender;
    creator['foaf:mbox'] = model.selectedTissResearcher.main_email;


    if (model.selectedTissResearcher.main_phone_number) {
      creator['foaf:phone'] = model.selectedTissResearcher.main_phone_number;
    }

    object['dc:creator'] = [creator];

    const inputfile = <Inputfile>{};
    inputfile.amount = model.inputFileSample.amount.toString();
    inputfile['dc:title'] = model.inputFileSample.file.name;
    inputfile['premis:hasFormat'] = model.inputFileSample.mimeType;
    inputfile['dcterms:extent'] = model.inputFileSample.file.size.toString() + 'Bytes';
    inputfile['amount'] = model.inputFileSample.amount.toString();
    object.Inputfile = [inputfile];

    const outputfile = <Outputfile>{};
    outputfile.amount = model.inputFileSample.amount.toString();
    outputfile['dc:title'] = model.outputFileSample.file.name;
    outputfile['premis:hasFormat'] = model.outputFileSample.mimeType;
    outputfile['dcterms:extent'] = model.outputFileSample.file.size.toString() + 'Bytes';
    outputfile['amount'] = model.outputFileSample.amount.toString();
    object.Outputfile = [outputfile];

    const license = <License>{};
    license['dcterms:title'] = model.selectedLicense.name;
    license['dcterms:license'] = model.selectedLicense.url;
    license['dcterms:description'] = model.selectedLicense.description;
    object.license = [license];

    const repository = <Repository>{};
    repository.URL = model.selectedRepo.repository_metadata.url;
    for (const i of model.selectedRepo.repository_metadata.name) {
      if (i.name) {
        repository['dcterms:title'] = i.name;
      }
    }
    repository['dcterms:description'] = model.selectedRepo.repository_metadata.description;
    repository['dc:language'] = model.selectedRepo.repository_metadata.content_languages.toString();
    repository['dc:type'] = model.selectedRepo.repository_metadata.type;
    object.repository = [repository];

    return JSON.stringify(object, null, 2);
  }

}
