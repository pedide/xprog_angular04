import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { CustomHttpResponse } from 'src/app/models/custom-http-response';
import { User } from 'src/app/models/user/user';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import{Role} from 'src/app/enum/role.enum';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FileUploadStatus } from 'src/app/models/file-upload.status';
import { AppSettings } from 'src/app/settings/app.settings';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
 
private titleSubject = new BehaviorSubject<string>('Users');
public titleAction$ = this.titleSubject.asObservable();
declare public refreshing: boolean;
declare public users : User[];
private subscription : Subscription[]=[];
declare public selectedUser: User | null;
declare public fileName: string;
declare public profileImage: File;
public editUser = new User ();     // | null; 
declare public currentUsername: string;
declare public user: User;
public fileStatus = new FileUploadStatus();

urlPict = AppSettings.IMG_PROFIL;

  

  constructor(private userService : UserService,
    private authenticationService: AuthenticationService,
    private notificationService:NotificationService,
    private router : Router ) { 
     
    }

  ngOnInit(): void {  

    this.user = this.authenticationService.getUserFromLocalCache(); 
    this.getUsers(true)  ; 
    
  }
  
  public changeTitle(title : string) : void{
    this.titleSubject.next(title);

  }

  public getUsers(showNotification: boolean):void{
    this.refreshing = true;
    this.subscription.push(
      this.userService.getUsers().subscribe(
        (response : User[]) =>{
          this.userService.addUsersToLocalCache(response); //Ajouter la liste des users dans le cache local
          this.users = response;
          this.refreshing = false;
          if(showNotification){
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully. `);
          }
        }, 
        (errorResponse: HttpErrorResponse) => {        
           this.sendNotification(NotificationType.ERROR, errorResponse.error.message);  
           this.refreshing = false;      
       }
      )
    );
  }

  public onSelectUser(selectedUser:User):void{
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');    
  }
  
   public onUpdateProfileImage():void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage);
    this.subscription.push(
      this.userService.updateProfileImage(formData).subscribe(
        (event : HttpEvent<any>) =>{
          console.log(event);
          this.sendNotification(NotificationType.SUCCESS, `Profile image updated successfully`);
          
         // this.reportUploadProgress(event);          
        }, 
        (errorResponse: HttpErrorResponse) => {        
           this.sendNotification(NotificationType.ERROR, errorResponse.error.message);  
           this.fileStatus.status = 'done';    
       }
      )
    );
    }

  reportUploadProgress(event: HttpEvent<any>) {
    throw new Error('Method not implemented.');
  }

    public updateProfileImage():void {
      this.clickButton('profile-image-input');
      }
    
    OnUpdateCurrentUser(_t140: NgForm) {
    throw new Error('Method not implemented.');
    }

   /* public onProfileImageChange(fileName : string, profileImage :File):void{
      //console.log(fileName,profileImage);
      this.fileName = fileName;
      this.profileImage = profileImage;
  
    }*/
    
  // Méthode pour récupérer le nom et l'image
  public onProfileImageChange(event:any):void{


    const files : File[] = event.target.files;
    let file: File = event.target.files[event.target.files.length-1] as File;

    this.fileName = file.name;
    this.profileImage = file;
    console.log(this.fileName);

  }
  public onAddNewUser(userForm:NgForm):void {
  const formData =   this.userService.createUserFormData(null as any,userForm.value,this.profileImage);
  this.subscription.push(
    this.userService.addUser(formData).subscribe(
      (response : User) =>{
        this.clickButton('new-user-close');      
        this.getUsers(false);
        this.fileName= null as any;
        this.profileImage = null as any;
        userForm.reset();
        this.sendNotification(NotificationType.SUCCESS, `${response.firstname} ${response.lastname} updated successfully`);
      }, 
      (errorResponse: HttpErrorResponse) => {        
         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);  
         this.profileImage = null as any;
             
     }
    )
  );

  }

  saveNewUser():void {
    this.clickButton('new-user-save'); 

    }

    public searchUsers(searchTerm:string):void{
     // console.log(searchTerm);      
    const results :User[]=[];
      for(const user of this.userService.getUsersFromLocalCache()){
        if(user.firstname.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
            user.lastname.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
            user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
            user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 
        
        ){
          results.push(user);
        }
      }
          this.users = results;
          if(results.length === 0 || !searchTerm){
           this.users = this.userService.getUsersFromLocalCache();
          
        }      

    }
    public get isAdmin():boolean{
      return this.getUserRole() === Role.ADMIN  || this.getUserRole() === Role.SUPER_ADMIN;
    }

    public get isManager():boolean{
      return this.isAdmin || this.getUserRole() === Role.MANAGER; 
    }

    public getUserRole():string {
      return this.authenticationService.getUserFromLocalCache().role;
    }
    public get isAdminOrManager():boolean{
      return this.isAdmin || this.isManager;
    }

    public onUpdateUser():void {
      const formData = this.userService.createUserFormData(this.currentUsername,this.editUser,this.profileImage);
      this.subscription.push(
        this.userService.updateUser(formData).subscribe(
          (response : User) =>{
            this.clickButton('closeEditUserModalButton');      
            this.getUsers(false);
            this.fileName= null as any;
            this.profileImage = null as any;
          
            this.sendNotification(NotificationType.SUCCESS, `${response.firstname} ${response.lastname} updated successfully`);
          }, 
          (errorResponse: HttpErrorResponse) => {        
             this.sendNotification(NotificationType.ERROR, errorResponse.error.message);  
             this.profileImage = null as any;
                 
         }
        )
      );

      }
      onLogout():void {
        this.authenticationService.logOut();
        this.router.navigate(['/login']);
        this.sendNotification(NotificationType.SUCCESS,"You have been successfully logged out!");
        }
      public onResetPassword(emailForm:NgForm):void{
        this.refreshing = true;
       const emailAddress = emailForm.value['reset-password-email'];
        this.subscription.push(
          this.userService.resetPassword(emailAddress).subscribe(
            (response : CustomHttpResponse ) =>{
              this.sendNotification(NotificationType.SUCCESS, response.message);
              this.refreshing = false;
            }, 
            (errorResponse: HttpErrorResponse) => {        
               this.sendNotification(NotificationType.WARNING, errorResponse.error.message);  
               this.refreshing = false;
           },
              () => emailForm.reset()
          )
        );
      }

     public onDeleteUser(uId: number) :void{
      console.log("uId :"+uId);
      
      this.subscription.push(
        this.userService.deleteUser(uId).subscribe(
          (response : CustomHttpResponse ) =>{
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.getUsers(true);
          }, 
          (errorResponse: HttpErrorResponse) => {        
             this.sendNotification(NotificationType.ERROR, errorResponse.error.message);  
                              
         }
        )
      );
        }


   public onEditUser(editUser: User):void {
      this.editUser = editUser;
      this.currentUsername = editUser.username;
      this.clickButton('openUserEdit');
      }
      
  private  sendNotification(notificationType: NotificationType, message: string) {
    if(message){
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur est survenue. Veuillez réessayer.');
    }

  }

  private clickButton(buttonId:string):void{
    document.getElementById(buttonId)?.click();
  }

}
