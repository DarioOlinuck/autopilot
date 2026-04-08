import { LeafAutoPart } from "../interfaces/leaf-auto-part.interface";

export  class AirFilter implements LeafAutoPart{
    price: number = 150;
    getAutoPartPrice():number{
        return this.price;
    }
}