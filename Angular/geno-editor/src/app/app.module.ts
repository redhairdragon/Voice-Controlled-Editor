import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill'
import {VoiceCommandService} from './voice-command.service'

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { PopOutComponent } from './pop-out/pop-out.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    PopOutComponent
  ],
  imports: [
  	FormsModule,
    BrowserModule,
    QuillModule
  ],
  providers: [VoiceCommandService],
  bootstrap: [AppComponent]
})
export class AppModule { }
