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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  public showLoading: boolean = false;
  private subscriptions: Subscription [] = [];

  constructor(private router: Router, 
    private authenticationService: AuthenticationService, 
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if(this.authenticationService.isUserLoggedIn()) {
     this.router.navigateByUrl('/user/management');
    // this.router.navigateByUrl('/produit');
     // console.log("Ca fonctionne login");
    } else {
      this.router.navigateByUrl('/login');
     // console.log("Ca ne fonctionne pas login");

    }

  }



  public onLogin(user: User): void{
    this.showLoading = true;
    //console.log(user);

    this.subscriptions.push(this.authenticationService.login(user).subscribe(
      (response: HttpResponse<User>)=>  {

       const token = response.headers.get(HeaderType.JWT_TOKEN);
      // console.log(response);       
       //console.log("token"+token);
       
       this.authenticationService.saveToken(token!);
       this.authenticationService.addUserToLocalCache(response.body!);
       this.router.navigateByUrl('/user/management');
       this.showLoading = false;

      },
      (errorResponse: HttpErrorResponse) => {
         // console.log(errorResponse);
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
      }
    )
    )
    
  }
  private sendErrorNotification(notificationType: NotificationType, message: string): void {
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
