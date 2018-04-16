import { Component } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {DmpModel} from './dmp-model';
import {FileModel} from './file-model';
import * as FileType from 'file-type';
import {Location} from '@angular/common';
import {lookup} from 'mime-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {

  repoTypeMapping: Map<String, Array<number>> = new Map<String, Array<number>>();
  repoDefaultType = 9;
  repoDefaultCountry = 'at'; // Austria

  constructor() {
    // called first time before the ngOnInit()
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    // TODO add more 'mime type to repository' mappings here
    // create the type mapping for fetching repositories
    // 1 Research papers (pre- and postprints)
    this.repoTypeMapping.set('application/pdf', 1);
    // 2 Research papers (preprints only)
    // 3 Research papers (postprints only)
    // 4 Bibliographic references
    // 5 Conference and workshop papers
    // 6 Theses and dissertations
    // 7 Unpublished reports and working papers
    // 8 Books chapters and sections
    // 9 Datasets
    this.repoTypeMapping.set('application/json', 9);
    // 10 Learning Objects
    // 11 Multimedia and audio-visual materials
    // 12 Software
    // 13 Patents
    // 14 Other special item types
  }
  model: DmpModel = new DmpModel();


  public fetchTissData() {
    // TODO use the TISS API to receive info about the user with the given projectName (in model.projectName)
    console.log('We should definitely fetch the TISS data for the projectName "' + this.model.projectName + '" here...');
  }

  public addSampleFiles(files: File[]) {
    for (const file of files) {
      // make sure the file is not yet contained
      if (this.model.files.find(existingFileModel => existingFileModel.file.name === file.name)) {
        continue;
      }

      // detect the filetype based on the first 4100 bytes
      // @see https://github.com/sindresorhus/file-type
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileType = FileType(reader.result);
        let mimeType;
        if (fileType === null || fileType.mime === null) {
          console.log('No magic numbers found for file ' + file.name);
          const extensionType = lookup(file.name);
          if (extensionType) {
            mimeType = extensionType;
          } else {
            mimeType = 'text/plain';
          }
        } else {
          mimeType = fileType.mime;
        }

        const fileModel = new FileModel(file, mimeType, 'output', 1);
        this.model.files.push(fileModel);
        console.log('New file added: ' + fileModel);
      };
      reader.readAsArrayBuffer(file.slice(0, 4100));
    }
  }

  public fetchRepositories() {
    // find the different repositories for the output types
    const repositoryTypes: Set<number> = new Set<number>();
    // TODO
    //this.model.files.filter((f) => f.ioType === 'output')
    //  .forEach((f) => repositoryTypes.add(this.repoTypeMapping.get(f.mimeType) || [this.repoDefaultType));
    const rt = Array.from(repositoryTypes).map((r) => r.join(',')).join(',');
    console.log('Looking for repositories accepting the following types: ' + rt);

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

  public generateDmp() {
    // TODO generate the two DMPs here
    console.log('We should generate the DMPs here so that they can be displayed / downloaded...');
    const definitionDMP = {
      footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
      content: [
        {text: this.model.projectName, style: 'header'},
        {
          text: [
            {text: 'Administrative Data:', style: 'subheader'}
          ]
        },
        'This is a sample text',
        // TODO: Fill in administrative data
        {
          text: [
            {text: 'Data used:', style: 'subheader'},
          ],
        },
        'This is an overview of the data used in the project:',
        {
          table: {
            headerRows: 1,
            widths: [ '*', 'auto', 100, '*' ],
            // TODO: Fill in more than one row

            body: [
              [ 'MimeType', 'Amount', 'Size', 'Total Size' ],
              [ this.model.files[0].mimeType,
                this.model.files[0].amount,
                this.model.files[0].file.size + ' Byte',
                (this.model.files[0].file.size * this.model.files[0].amount) + ' Byte'],
            ]
          }
        },
        {
          text: [
            {text: 'Repositories:', style: 'subheader'},
          ]
        },
        'This is a sample text',
        // TODO: Fill in repositories

        {
          text: [
            {text: 'License:', style: 'subheader'},
          ]
        },
        'This is a sample text'
        // TODO: Fill in license

      ],

      styles: {
        header: {
          fontSize: 25,
          bold: true
        },
        subheader: {
          fontSize: 18,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        }
      }

    };
    const definitionMADMP = {content:
      'This is an sample PDF printed with pdfMake' };
    pdfMake.createPdf(definitionDMP).download(this.model.projectName + 'DMP');
    pdfMake.createPdf(definitionMADMP).download(this.model.projectName + 'MachineActionableDMP');

  }
}
