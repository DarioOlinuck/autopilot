export class FlyweightStone {

    y = 0;
    x: number;
    speed: number;
    rockImage = new Image();

    constructor(xPosition: number, speed: number) {

        this.x = xPosition;
        this.speed = speed;
        this.rockImage.src = "../assets/rocky-removebg-preview.webp";
    }
}