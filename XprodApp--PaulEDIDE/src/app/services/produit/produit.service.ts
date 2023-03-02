import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produit } from 'src/app/models/produit/produit';
import { AppSettings } from 'src/app/settings/app.settings';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  constructor(private http:HttpClient) { }

 getAllProduits(){
  // return this.http.get(AppSettings.APP_URL+"/produits");
  return this.http.get("http://localhost:8085/produits");
   
 }
 
 createProduit(produit:Produit){
   return this.http.post(AppSettings.APP_URL+"/produits",produit);
 }
}
