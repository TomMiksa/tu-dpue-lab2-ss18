import { Component } from '@angular/core';
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
  }
}
