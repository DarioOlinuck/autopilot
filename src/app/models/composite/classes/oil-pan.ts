import { LeafAutoPart } from "../interfaces/leaf-auto-part.interface";

export  class OilPan implements LeafAutoPart{
     price = 200;  
     getAutoPartPrice():number{
        return this.price;
    } 
}