import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { Platform } from '@ionic/angular';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { VideoPlayer } from '@ionic-native/video-player';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public videos: Array<any>;
  private thumb: any;
  constructor(
    private plt: Platform, private file: File, private toast: Toast, private videoEditor: VideoEditor
    , private videoPlayer: VideoPlayer
  ) {
    this.plt.ready().then(() => {
      this.videos = [];
      //Video status
      this.listDir(this.file.externalRootDirectory, '');
    });
  }

  ngOnInit() {
  }

  listDir(path, dirName) {
    this.file
      .listDir(path, dirName)
      .then(entries => {
        this.alert(JSON.stringify(entries));
        this.videos = entries;
      })
      .catch(err => {
        console.log(err);
      });
  }

  alert(msg) {
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  getThumbnail(url, name) {
    this.thumb = null;
    this.videoEditor.createThumbnail({ fileUri: url, outputFileName: name, atTime: 2, width: 320, height: 240, quality: 100 })
      .then(res => {
        this.thumb = res;
        this.alert(`thumb ${this.thumb}`);
      })
      .catch(err => {
        this.thumb = null;
        this.alert(`err ${this.thumb}`);
      });

    return this.thumb;
  }

  play(url) {
    this.videoPlayer.play(url, {
      volume: 0.7
    }).then(() => {
      console.log('video completed');
    }).catch(err => {
      console.log(err);
    });
  }
}
