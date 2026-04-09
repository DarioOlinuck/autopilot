import { LeafAutoPart } from "../interfaces/leaf-auto-part.interface";

export  class AirFilter implements LeafAutoPart{
    price = 150;
    getAutoPartPrice():number{
        return this.price;
    }
}