import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Produit } from 'src/app/models/produit/produit';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProduitService } from 'src/app/services/produit/produit.service';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {

  public productList:any;
  constructor(private produitService:ProduitService, private cartService:CartService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.produitService.getAllProduits().subscribe(
      (data) =>{
        console.log(data);
        this.productList=data;

        this.productList.array.forEach((a:any) => {
          Object.assign(a,{quanty:1,total:a.price});
          
        });

      }
    );
  }
  actionAddToCart(item:any){ 
   
    this.cartService.addToCart(item);

  }
  
  addToCart(item:any){
    this.orderService.createOrder(item);
  }

}
