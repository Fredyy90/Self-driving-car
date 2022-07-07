let cars, traffic, bestCar, road, prevBestBrain;

let generation = 0;
const N=250;
const mutationRate = 0.1;

const carCanvas=document.getElementById("carCanvas");
carCanvas.width=350;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

start();

function start(brain = false){

    generation++;

    if(brain == false){
        brain = localStorage.getItem("bestBrain");
    }

    road=new Road(carCanvas.width/2,carCanvas.width*0.9);

    cars=generateCars(N);
    bestCar=cars[0];
    if(brain){
        for(let i=0;i<cars.length;i++){
            cars[i].brain=JSON.parse(brain);
            if(i!=0){
                NeuralNetwork.mutate(cars[i].brain, mutationRate);
            }
        }
    }
    if(prevBestBrain){
        cars[1].brain=JSON.parse(prevBestBrain);
    }
    prevBestBrain = brain;
    
    traffic = new Traffic(road, 15);
    animate();
}

function restart(){
    start(JSON.stringify(bestCar.brain));
}

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(road.getMiddleLane()),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){

    traffic.update(road.borders, bestCar, cars);

    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic.cars);
    }
    bestCar=Car.findBestCar(cars);

    for(let i=0;i<cars.length;i++){
        cars[i].checkToKill(bestCar);
    }

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.6);

    road.draw(carCtx);
    traffic.draw(carCtx);

    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);

    const killedCars = cars.filter(car=>car.killed==true && car.damaged==false).length;
    const damagedCars = cars.filter(car=>car.damaged==true).length;
    const aliveCars = cars.length - killedCars - damagedCars

    document.getElementById("generation").textContent = generation;
    document.getElementById("totalCars").textContent = cars.length;
    document.getElementById("aliveCars").textContent = aliveCars;
    document.getElementById("damagedCars").textContent = damagedCars;
    document.getElementById("killedCars").textContent = killedCars;

    if(aliveCars > 0){
        requestAnimationFrame(animate);
    }else{
        restart();
    }
}