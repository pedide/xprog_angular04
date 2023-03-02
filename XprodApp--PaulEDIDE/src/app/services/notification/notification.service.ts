import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotificationType } from 'src/app/enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

 
  private notifier : NotifierService;

  constructor(notifier:NotifierService) {
    this.notifier=notifier;
  }

  public notify(type:NotificationType,message:string){
    this.notifier.notify(type,message);
  }
}
