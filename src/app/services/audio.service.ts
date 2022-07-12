import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private notification = new Audio();

  constructor() {
    this.notification.src = './assets/audio/notification.mp3';
    this.notification.load();
  }

  playNotification() {
    this.notification.play();
  }
}
