import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setStorage(key:string, value:string){
    Preferences.set({
      key,
      value
    });
  };
  
  getStorage(key:string){
    Preferences.get({ key });
  };
  
  removeStorage(key:string){
    Preferences.remove({ key });
  };
}
