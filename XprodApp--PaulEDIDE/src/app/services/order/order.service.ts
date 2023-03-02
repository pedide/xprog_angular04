import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/settings/app.settings';

@Injectable({ 
  providedIn: 'root'
})
export class OrderService {
  
  public products: any[] =[];
  constructor(private http:HttpClient) { }

  getSingleOrder(orderId: Number){
return this.http.get(AppSettings.APP_URL+'order/$(orderId)');
  }

  getAllOrders(){
    return this.http.get(AppSettings.APP_URL+'/order');
  }

  createOrder(order: Number){
    return this.http.post(AppSettings.APP_URL+"/order",order);
  }

}

