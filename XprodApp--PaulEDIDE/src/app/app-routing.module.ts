import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CartComponent } from "./components/cart/cart.component";
import { ClientComponent } from "./components/client/client.component";
import { LoginComponent } from "./components/login/login.component";

import { ProduitComponent } from "./components/produit/produit.component";
import { RegisterComponent } from "./components/register/register.component";
import { UserComponent } from "./components/user/user.component";
import { AuthenticationGuard } from "./guard/authentication.guard";
//import { AuthenticationGuard } from "./guard/authentication.guard";

const routes:Routes=[
{path:'login',component:LoginComponent},
{path:'register', component:RegisterComponent},
//{path:'user/management',component:UserComponent, canActivate:[AuthenticationGuard]},
{path:'user/management',component:UserComponent},
//{path:'',redirectTo:'/login',pathMatch:'full'},
{ path:'client', component :ClientComponent  },
{ path:'produit', component :ProduitComponent  },  
{path:"cart",component:CartComponent},


];

@NgModule({
    imports :[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule{} 