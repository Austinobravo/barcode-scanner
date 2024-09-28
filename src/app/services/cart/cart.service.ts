import { inject, Injectable } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { BehaviorSubject } from 'rxjs'; 
import { StorageService } from '../storage/storage.service';
import { Products } from 'src/app/home/data/products';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  model:any = null
  cartStoreName = "barcode-cart"
  products:ProductType[] = [...Products]

  private cart$ = new BehaviorSubject<any>(null)

  get cart(){
    return this.cart$.asObservable()
  }

  private storageService = inject(StorageService)

  constructor() { 
    this.getCart()
  }

  async startScan(value? : number){
     try{
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: value || 17,
        cameraDirection: 1,
      })
      console.log(result)
      return result.ScanResult

     }
     catch(error:any){
      throw new Error(error)
     }
  }

  addItemByBarcode(code: string){
    const item = this.products.find((item) => item.barcode === code)
    if(!item){
      throw new Error("No such item found")
    }
    this.addQuantity(item)
  }

  addQuantity(item:ProductType){
    if(this.model){
      const index = this.model.items.findIndex((data:any) => data.item_id === item.id)

      if(index >= 0){
        this.model.items[index].quantity += 1
      }
      else{
        const items = [
          {
            item_id: item.id,
            name: item.name,
            description: item.description,
            price: +item.price,
            image: item.image,
            quantity: 1
          }
        ]

        this.model.items = this.model.items.concat(items)
      }
    }
    else{
      const items =
        {
          item_id: item.id,
          name: item.name,
          description: item.description,
          price: +item.price,
          image: item.image,
          quantity: 1
        }
      
        this.model = {
          items: [items]
        }
    }

    return this.calculate()
  }

  subtractQuantity(item:ProductType){
    if(this.model){
      const index = this.model.items.findIndex((data:any) => data.item_id === item.id)

      if(index >= 0){
        if(this.model.items[index].quantity > 0){
          this.model.items[index].quantity -= 1
        }

        return this.calculate()
      }
    }
    return null
  }

  calculate(){
    const itemsGreaterThanZero = this.model.items.filter((item:any) => item.quantity > 0)

    if(itemsGreaterThanZero.length <= 0){
      this.clearCart()
      return
    }

    let totalItemInCart = 0
    let totalAmount = 0

    for(const item of itemsGreaterThanZero){
      totalItemInCart += item.quantity
      totalAmount += item.price * item.quantity
    }

    this.model = {
      ...this.model,
      itemsGreaterThanZero,
      totalItemInCart,
      totalAmount
    }

    this.cart$.next(this.model)

    this.saveCart(this.model)

    return this.model
  }

  saveCart(item:any){
    const model = JSON.stringify(item)
    this.storageService.setStorage(this.cartStoreName, model)
  }
  
  clearCart(){
    this.storageService.removeStorage(this.cartStoreName)
    this.model = null
    this.cart$.next(null)

  }

  getCart(){
    let data = this.cart$.value

    if(!data){
      data = this.storageService.getStorage(this.cartStoreName)

      console.log("cart", data)

      if (data.value){
        this.model = JSON.parse(data.value)
        this.cart$.next(this.model)
      }
    }
  }
}
