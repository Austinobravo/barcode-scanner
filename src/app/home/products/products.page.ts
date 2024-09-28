import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Products } from '../data/products';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductsPage implements OnInit {
items: any[] = []
itemModel:any = {}
showBarcode = false
currency = '$'
  constructor() { }

  ngOnInit() {
    this.items = [...Products]
  }

  getBarcodeData(item: ProductType){
    this.itemModel = {...item}
    this.showBarcode = true
    console.log("item", item)

    setTimeout(() => {
      this.getBarcode(item.barcode)
    }, 500)
  }

  getBarcode(barcode: string){
    JsBarcode("#barcode", barcode, {
      // format: "pharmacode",
      displayValue: false,
      width: 4,
      height:150
    })
  }
}
