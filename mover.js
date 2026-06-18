class Mover {
    constructor(x , y){
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.age = 0;
        this.size = 1;
    }

    
    update(){
        this.age++;

        let noisex = map(noise(frameCount / 100), 0, 1, -1, 1);
        let noisey = map(noise((frameCount+47) / 100), 0, 1, -1, 1);
        let noiseAdd = createVector(noisex, noisey);
        noiseAdd.limit(0.011);
        
        this.acceleration.add(noiseAdd);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity );


        if (this.position.y >= height * 0.95 || this.position.y <= height * 0.5 ){
            this.velocity.y = this.velocity.y * -1 ;
        } else if (this.position.x <= (width*0.01) ||  this.position.x >= width*0.31){
            this.velocity.x = this.velocity.x * -1 ;
        }
        this.acceleration.mult(0, 0);
    }

    show() {
        push();
        noStroke();
        fill('white');
        circle(this.position.x, this.position.y, 10 );
        pop();
    }
    
    
    applyForce(force){
        this.acceleration = this.acceleration.add(force);
    }

    seek(target) {
        let aRadius = 20;

        let desired = p5.Vector.sub(target, this.position);
        
        if (desired.mag() <= aRadius){
            desired.setMag(1 * desired.mag()/aRadius);
        } else {
            desired.setMag(1);
        }

        let steer = p5.Vector.sub(desired, this.velocity);
        
        steer.limit(0.15);
        return steer;
    }


}