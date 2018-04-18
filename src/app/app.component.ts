import {Component, ViewChild} from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {DmpModel} from './dmp.model';
import {FileModel} from './file.model';
import * as FileType from 'file-type';
import {lookup} from 'mime-types';
import {TissService} from './tiss.service';
import {OpenDoarService} from './opendoar.service';
import {MovingDirection} from 'ng2-archwizard';
import {ResearcherModel} from './researcher.model';
import {NgModel} from '@angular/forms';
import {RepoModel} from './repo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  model: DmpModel = new DmpModel();

  @ViewChild('researcherName') researcherNameField: NgModel;

  constructor(private tiss: TissService, private opendoar: OpenDoarService) {
    // called first time before the ngOnInit()
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  public fetchTissData: (MovingDirection) => Promise<boolean> | boolean = (direction) => {
    // if we walk the wizard backwards we don't need to re-fetch the personal data
    if (direction === MovingDirection.Backwards) {
      return true;
    } else {
      // if it's not backwards we fetch the personal data (or don't allow entering if fetching didn't work)
      return new Promise<boolean>((resolve, reject) => {
        this.tiss.fetchTissData(this.model.researcherName).then((value: ResearcherModel[]) => {
          console.log('TISS data successfully fetched and stored in the model!');
          console.log(value);
          this.model.tissSearchResult = value;
          this.model.selectedTissResearcher = value.length > 0 ? value[0] : undefined;
          resolve(true);
        }).catch((text) => {
          this.researcherNameField.control.setErrors({'notFound': 'Researcher could not be found in TISS.'});
          resolve(false);
      });
      });
    }
  }

  public addFileSample(file: File, ioType: 'input' | 'output') {
    console.log(file);
    // detect the file-type based on the first 4100 bytes
    // @see https://github.com/sindresorhus/file-type
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileType = FileType(reader.result);
      let mimeType;
      if (fileType === null || fileType.mime === null) {
        console.log('No magic numbers found for file ' + file.name);
        // if we cannot find any magic numbers, we'll try to determine the mime type based on the file extension
        const extensionType = lookup(file.name);
        if (extensionType) {
          mimeType = extensionType;
        } else {
          // If we cannot find any matching mimetype it's probably a text file...
          mimeType = 'text/plain';
        }
      } else {
        mimeType = fileType.mime;
      }

      const fileModel = new FileModel(file, mimeType, 1);
      if (ioType === 'input') {
        this.model.inputFileSample = fileModel;
      } else {
        this.model.outputFileSample = fileModel;
      }
      console.log('New file ' + ioType + ' added: ' + JSON.stringify(fileModel));
    };
    reader.readAsArrayBuffer(file.slice(0, 4100));
  }

  public fetchRepositories: (MovingDirection) => Promise<boolean> | boolean = (direction) => {
    // if we walk the wizard backwards we don't need to re-fetch the personal data
    if (direction === MovingDirection.Backwards) {
      return true;
    } else {
      // if it's not backwards we fetch the repo data
      return new Promise<boolean>((resolve, reject) => {
        this.opendoar.fetchRepositories(this.model.outputFileSample).then((value: RepoModel[]) => {
          console.log('OpenDOAR Repo data successfully loaded!');
          console.log(value);
          this.model.repoSearchResult = value;
          resolve(true);
        }).catch((text) => {
          resolve(false);
        });
      });
    }
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
              [ this.model.outputFileSample.mimeType,
                this.model.outputFileSample.amount,
                this.model.outputFileSample.file.size + ' Byte',
                (this.model.outputFileSample.file.size * this.model.outputFileSample.amount) + ' Byte'],
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
