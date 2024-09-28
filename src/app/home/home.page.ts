import { Component, inject, NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
// import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { CartService } from '../services/cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink],
})


export class HomePage {
  isToastOpen = false
  toast = {
    message: "",
    color: ""
  }
  totalItems: number = 0
  cartSub!: Subscription
  private cartService = inject(CartService)
  constructor() {}

  ngOnInit(){
    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        this.totalItems = cart ? cart.totalItems : 0
      }
    })
  }
  async scanCode(){
    try{
      const gottenValue = await this.cartService.startScan()
      if(!gottenValue){
        this.isToastOpen = true
        this.toast ={
          color: "danger",
          message: "No data gotten"
        }
        return
      }

      this.cartService.addItemByBarcode(gottenValue)
      console.log(gottenValue)
     }
    catch(error){
      console.log(error)
    }
  }
  
  async scanAndPay(){
    try{
      const gottenValue = await this.cartService.startScan()
      if(!gottenValue){
        this.isToastOpen = true
        this.toast ={
          color: "danger",
          message: "Error! Please try again"
        }
        return
      }
      this.isToastOpen = true
      this.toast ={
        color: "success",
        message: "Payment Successful"
      }
      console.log(gottenValue)
     }
    catch(error){
      console.log(error)
    }
  }

  ngOnDestroy(): void{
    if(this.cartSub) this.cartSub.unsubscribe()
  }
}
