import { LeafAutoPart } from "../interfaces/leaf-auto-part.interface";

export  class Turbo implements LeafAutoPart{
    price = 100;
    getAutoPartPrice():number{
        return this.price;
    }
}