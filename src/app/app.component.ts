import { Component } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {DmpModel} from './dmp-model';
import {FileModel} from './file-model';
import * as FileType from 'file-type';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  constructor(){
    //called first time before the ngOnInit()
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }
  model: DmpModel = new DmpModel();


  public fetchTissData() {
    // TODO use the TISS API to receive info about the user with the given name (in model.name)
    console.log('We should definitely fetch the TISS data for the name "' + this.model.name + '" here...');
  }

  public addSampleFiles(files: File[]) {
    for (const file of files) {
      // make sure the file is not yet contained
      if (this.model.files.find(existingFileModel => existingFileModel.file.name === file.name)) {
        continue;
      }

      // detect the filetype based on the first 4100 bytes
      // @see https://github.com/sindresorhus/file-type
      // TODO This DOES NOT yet detect text file types (f.e. python script)
      // f.e. linux' file command does detect that
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileType = FileType(reader.result);
        const mimeType = fileType === null || fileType.mime === null ? 'application/text' : fileType.mime;

        const fileModel = new FileModel(file, mimeType, 'output', 1);
        this.model.files.push(fileModel);
        console.log('New file added: ' + fileModel);
      };
      reader.readAsArrayBuffer(file.slice(0, 4100));
    }
  }

  public fetchRepositories() {
    /* Should we use the real location? Or maybe query the IP location?
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        console.log(location.coords);
      }, (error) => {
        console.log('Location could not be determined (probably has been blocked)!');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
    */
    // TODO use the OpenDOAR API to receive the best repositories for the given outputs
    console.log('We should definitely fetch the OpenDOAR repositories here...');
  }

  public generateDmp() {
    // TODO generate the two DMPs here
    console.log('We should generate the DMPs here so that they can be displayed / downloaded...');
    var definitionDMP = {
      footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
      content: [
        {text: this.model.name, style: 'header'},
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
              [this.model.files[0].mimeType,  this.model.files[0].amount, this.model.files[0].file.size + ' Byte', (this.model.files[0].file.size * this.model.files[0].amount) + ' Byte'],
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

    }
    var definitionMADMP = {content:
      'This is an sample PDF printed with pdfMake' };
    pdfMake.createPdf(definitionDMP).download(this.model.name + 'DMP');
    pdfMake.createPdf(definitionMADMP).download(this.model.name + 'MachineActionableDMP');

  }
}
