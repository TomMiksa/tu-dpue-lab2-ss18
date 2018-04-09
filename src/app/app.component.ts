import { Component } from '@angular/core';
import {DmpModel} from './dmp-model';
import {FileModel} from './file-model';

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
      // TODO make sure the file is not yet in the model
      // TODO get the mime type of the file
      const mimeType = 'application/dontKnowYet';
      // TODO get file size of the file
      const size = 1337;

      const fileModel = new FileModel(file.name, mimeType, size, 'output', 1);
      this.model.files.push(fileModel);
      console.log(fileModel);
    }
  }

  public fetchRepositories() {
    // TODO use the OpenDOAR API to receive the best repositories for the given outputs
    console.log('We should definitely fetch the OpenDOAR repositories here...');
  }

  public generateDmp() {
    // TODO generate the two DMPs here
    console.log('We should generate the DMPs here so that they can be displayed / downloaded...');
  }
}
