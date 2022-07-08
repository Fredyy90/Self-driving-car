class Traffic{

    cars = [];
    removedCars = [];
    carLimit = 0;
    carCounter = 0;
    carYOffset = -100;

    constructor(road, generation = 0, carLimit = 10, carYOffset = -100){

        this.road = road;
        this.generation = generation;
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

        let lane = this.road.getRandomLane();

        if(firstFill){


                if(this.carCounter <= this.road.getMiddleLane()){
                    
                    if(this.generation % 2 == 0){
                        lane = this.carCounter;
                    }else{
                        lane = this.road.laneCount - this.carCounter - 1;
                    }

                }else if(this.carCounter <= (this.road.getMiddleLane()*2)+1){
                    
                    if(this.generation % 2 == 0){
                        lane = this.road.laneCount - (this.carCounter-this.road.getMiddleLane());
                    }else{
                        lane = this.carCounter - this.road.getMiddleLane()-1;
                    }
                    
                    position *= 3;
                }else{
                    position *= (this.carCounter-1);//+Math.round(Math.random()*2-1); 
                }

        }

        const newCar = new Car(this.road.getLaneCenter(lane),position,30,50,"DUMMY",2,getRandomColor());
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