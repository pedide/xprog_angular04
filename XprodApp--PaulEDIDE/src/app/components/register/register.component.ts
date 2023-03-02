import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit,OnDestroy {

  public showLoading: boolean = false;
  private subscriptions: Subscription [] = [];

  constructor(private router: Router, 
    private authenticationService: AuthenticationService, 
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if(this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
     // console.log("Ca fonctionne login");
    } 

  }


  public onRegister(user: User): void{
    this.showLoading = true;
    //console.log(user);

    this.subscriptions.push(this.authenticationService.register(user).subscribe(
      (data: User)=>  {
      
      // console.log("Je suis dans Resgister", data.firstname);  

       this.showLoading = false;
       this.sendNotification(NotificationType.SUCCESS, `A new account was created for ${data.firstname}.`)

      },
      (errorResponse: HttpErrorResponse) => {
         // console.log(errorResponse);
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
      }
    )
    )
    
  }
  
 private  sendNotification(notificationType: NotificationType, message: string) {
    if(message){
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur est survenue. Veuillez réessayer.');
    }

  }

  ngOnDestroy(): void {
    //cleanup logic goes there
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
