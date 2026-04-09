import { LeafAutoPart } from "../interfaces/leaf-auto-part.interface";

export  class CompositeEngine implements LeafAutoPart{
     price = 1000;
     parts: LeafAutoPart[] = [];

    addAutoPart(part:LeafAutoPart){
        this.parts.push(part)
    }
    
    removeAutoPart(part:LeafAutoPart){
        this.parts.splice(this.parts.indexOf(part),1);
    }

    getAutoPartPrice():number{
        return this.parts.reduce((a,b)=> a + b.price, this.price);       
    }
}