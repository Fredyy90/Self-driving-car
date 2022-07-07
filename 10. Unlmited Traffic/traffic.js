class Traffic{

    cars = [];
    removedCars = [];
    carLimit = 0;
    carCounter = 0;
    carYOffset = -100;

    constructor(road, carLimit = 10, carYOffset = -100){

        this.carLimit = carLimit;
        this.carYOffset = carYOffset;
        this.#fillCars();

    }

    getFirstCar(){

        return this.cars.find(
                    c=>c.y==Math.min(
                        ...this.cars.map(c=>c.y)
                    ));  

    }

    #createCar(firstFill = false, position = this.carYOffset, matchSpeed = false){

        let lane = road.getLaneCenter(road.getRandomLane());

        if(firstFill){
            if(this.carCounter != 0){
                position *= this.carCounter; //+Math.round(Math.random()*2-1); 
            }else{                
                lane = road.getLaneCenter(road.getMiddleLane());
            }
        }

        const newCar = new Car(lane,position,30,50,"DUMMY",2,getRandomColor());
        if(matchSpeed){
            newCar.speed = this.getFirstCar().speed
        }

        this.cars.push(newCar);5
        this.carCounter++;

    }

    #fillCars(){

        while(this.cars.length < this.carLimit){            
            this.#createCar(true);
        }

    }

    update(roadBorders, bestCar, aiCars = []){

        this.cars.forEach(car => {
            car.update(roadBorders,[]);            
        });

        if(aiCars){

            const aliveCars = aiCars.filter(car => car.isActive());

            if(aliveCars.length > 0){

                const worstAliveCar=aliveCars.find(
                    c=>c.y==Math.max(
                        ...aliveCars.map(c=>c.y)
                    ));                       
                    
                for(let i = 0; i < this.cars.length; i++){
                    if(this.cars[i].y-this.cars[i].height > worstAliveCar.y+worstAliveCar.sensor.rayLength){
                        this.removedCars.push(...this.cars.splice(i, 1));
                        this.#createCar(false, this.getFirstCar().y + (this.carYOffset * (Math.random()*0.5+0.5)), true);
                    }
                }
                aliveCars.map(aliveCar=>{
                    aliveCar.updateOvertakes(
                        [
                            ...this.removedCars,
                            ...this.cars
                        ]
                    );
                });
            }

        }

    }

    draw(ctx,drawSensor=false){
        this.cars.forEach(car => {
            car.draw(ctx,drawSensor);            
        });
    }

}