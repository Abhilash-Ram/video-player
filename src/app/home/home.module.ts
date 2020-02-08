import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { VideoPlayer } from '@ionic-native/video-player';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage],
  providers: [File, Toast, VideoEditor, VideoPlayer]
})
export class HomePageModule { }
