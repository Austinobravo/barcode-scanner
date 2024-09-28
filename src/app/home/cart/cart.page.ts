import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonIcon, IonCard, IonItem, IonImg, IonLabel, IonText, IonThumbnail, IonRow, IonCol, IonButton, IonList, IonModal } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonModal, IonList, IonButton, IonCol, IonRow, IonText, IonLabel, IonImg, IonItem, IonCard, IonIcon, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar,IonThumbnail, CommonModule, FormsModule]
})
export class CartPage implements OnInit {

  model:any = null
  cartSub!: Subscription
  isQrPay = false
  isToast = false
  toastData: any = {}

  private cartService = inject(CartService)
  constructor() { }

  async scanCode(){
    try{
      const gottenValue = await this.cartService.startScan()

      this.cartService.addItemByBarcode(gottenValue)
      console.log(gottenValue)
     }
    catch(error){
      console.log(error)
    }
  }

  addQuantity(item:any){
    this.cartService.addQuantity({...item, id: item?.item_id})
  }
  subtractQuantity(item:any){
    this.cartService.subtractQuantity ({...item, id: item?.item_id})
  }

  async pay(modal: IonModal){
    try{
      const gottenValue = await this.cartService.startScan()
      if(!gottenValue){
        this.isToast = true
        this.toastData ={
          color: "danger",
          message: "Error! Please try again"
        }
        return
      }
      this.isToast = true
      this.toastData ={
        color: "success",
        message: "Payment Successful"
      }
      console.log(gottenValue)
      modal.dismiss()

      this.cartService.clearCart()
     }
    catch(error){
      console.log(error)
    }
  }
  
  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        this.model = cart 
      }
    })
  }
  
  ngOnDestroy(): void{
    if(this.cartSub) this.cartSub.unsubscribe()
  }

}
