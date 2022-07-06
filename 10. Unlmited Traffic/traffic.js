class Traffic{

    cars = [];
    carLimit = 0;
    carCounter = 0;
    carYOffset = -100;

    constructor(road, carLimit = 10, carYOffset = -100){

        this.carLimit = carLimit;
        this.carYOffset = carYOffset;
        this.#createCars();

    }

    #createCars(){

        while(this.cars.length < this.carLimit){
            
            let position = this.carYOffset; 
            let lane = road.getLaneCenter(road.getMiddleLane());
            if(this.carCounter != 0){
                lane = road.getLaneCenter(road.getRandomLane());
                position *= this.carCounter; //+(Math.random()*2-1); 
            }
            this.cars.push(new Car(lane,position,30,50,"DUMMY",2,getRandomColor()));
            this.carCounter++;
        }

    }

    update(roadBorders,traffic){
        this.cars.forEach(car => {
            car.update(roadBorders,traffic);            
        });
    }

    draw(ctx,drawSensor=false){
        this.cars.forEach(car => {
            car.draw(ctx,drawSensor);            
        });
    }

}