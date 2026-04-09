import { LeafAutoPart } from "../interfaces/leaf-auto-part.interface";

export  class EngineBlock implements LeafAutoPart{
     price = 700; 
     getAutoPartPrice():number{
        return this.price;
    }  
}