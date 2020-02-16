import { Component, OnInit } from '@angular/core';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { Platform } from '@ionic/angular';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { VideoPlayer } from '@ionic-native/video-player';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public videos: Array<any>;
  public viewMode: string = 'LIST';
  private thumb: any;
  public history: Array<any> = [];

  constructor(
    private plt: Platform, private file: File, private toast: Toast, private videoEditor: VideoEditor
    , private videoPlayer: VideoPlayer, private screenOrientation: ScreenOrientation
  ) {
    this.plt.ready().then(() => {
      this.videos = null;
      this.listDir(this.file.externalRootDirectory, '');
    });
  }

  ngOnInit() {
    this.alert('rendering');
  }

  listDir(path, dirName) {
    this.file
      .listDir(path, dirName)
      .then(entries => {
        this.videos = [];
        this.videos = entries.filter(element => {
          if(element.isFile) {
            return element.name.toString().lastIndexOf('.mp4') != -1
          } else {
            return element;
          }
        });

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
      })
      .catch(err => {
        this.thumb = null;
      });

    return this.thumb;
  }

  play(data) {
    if(data.isFile){
      // this.alert('file clicked');
      this.file.resolveLocalFilesystemUrl(data.nativeURL)
        .then((file: FileEntry) => {
          // file.file(meta => this.alert(JSON.stringify(meta)), error => console.log(error));
          file.file((fileObject) =>{
              var reader = new FileReader()
              reader.onloadend = (evt)=> {
                  var video = new HTMLVideoElement()
                  video.onload = (evt) => {
                    this.alert(JSON.stringify(evt));
                    video = null
                  }
                  video.src = evt.target["result"]
              }
              reader.readAsDataURL(fileObject)
          }, function(){ console.error("There was an error reading or processing this file.") })
        });
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      this.videoPlayer.play(data.nativeURL, {
        volume: 1
      }).then(() => {
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.screenOrientation.unlock();
        console.log('video completed');
      }).catch(err => {
        console.log(err);
      });
    } else {
      this.alert('folder clicked');
      this.history.push(data.name);
      this.rerender(data.name);
    } 
  }

  rerender(path) {
    this.alert(`rerendering ${path}`);
    this.videos = null;
    this.listDir(this.file.externalRootDirectory, path);
  }

  goBack(){
    this.history.splice(this.history.length-1, 1);
    if(this.history.length > 0){
      this.rerender(this.history[this.history.length-1]);
    } else {
      this.rerender('');
    }
  }

  exit(){
    /*
    LDPI: Portrait: 200 X 320px
MDPI: Portrait: 320 X 480px
HDPI: Portrait: 480 X 800px
XHDPI: Portrait: 720 X 1280px
XXHDPI: Portrait: 960 X 1600px
XXXHDPI: Portrait: 1440 x 2560px
*/
    // this.plt.exitApp();
  }
}
