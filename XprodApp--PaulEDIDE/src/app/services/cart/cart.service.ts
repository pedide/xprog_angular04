import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { Produit } from 'src/app/models/produit/produit';
import { AppSettings } from 'src/app/settings/app.settings';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartItemList : any = [];
  public productList = new BehaviorSubject<any>([]);
  public grandTotal : number = 0;
  totalamount : Number = 0;

  constructor() { }

  getProducts(){
    return this.productList.asObservable();
  }
  setProduct(product: any){
    // ... = mettre à la suite
    this.cartItemList.push(...product);
    this.productList.next(product);
  }
  addToCart(product: any){
    this.cartItemList.push(product);
    this.productList.next(this.cartItemList);
    this.getTotal();
    console.log(this.cartItemList);
    console.log(this.getTotal());

  }
  getQuantity():number {
    let quantity = 1;
    return quantity
  }

  getTotal(){
    let total = 0;
    for(var i = 0; i < this.cartItemList.length; i++) {
        if (this.cartItemList[i].price) {
            total += this.cartItemList[i].price ;
            this.totalamount = total;
        }
    }
    return total;
}




  removeAllCart(){
    this.cartItemList=[];
    this.productList.next(this.cartItemList);
  }
  
  inc(product:Produit){
  for (let i in this.cartItemList){
    if (this.cartItemList[i].id === product.id) {
      this.cartItemList[i].quantity++
      break;
    }
  }

  }

  removeCartItem(product:any){
    this.cartItemList.map(
      (a:any, index: any)=>{
        if(product.id==a.id){
          this.cartItemList.splice(index,1);
        }
      }
    );
    this.productList.next(this.cartItemList);
  }


     getTotalPrice():number{
    let grandTotal = 0;
    this.cartItemList.map((a:any) =>{
      grandTotal+=a.total;
    });
    return grandTotal
  }  
}
