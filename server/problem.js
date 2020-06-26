class ProblemGenerator{
    constructor(){
        this.number = 6;
        this.add = false;
        this.sub = false;
        this.mul = false;
        this.div = false;
    }

    setProblemData(problemData){
        this.number = problemData[0];
        this.add = problemData[1];
        this.sub = problemData[2];
        this.mul = problemData[3];
        this.div = problemData[4];
    }

    newProblems(){
        let problems = [];
        
        while(problems.length < this.number){
            let r = this.random(1, 4);
            if(r == 1 && this.add){
                problems.push(this.newAddProblem());
            }
            if(r == 2 && this.sub){
                problems.push(this.newSubProblem());
            }
            if(r == 3 && this.mul){
                problems.push(this.newMulProblem());
            }
            if(r == 4 && this.div){
                problems.push(this.newDivProblem());
            }
        }

        return problems;
    }

    newProblem(){
        //generate problem and solution
        return this.newAddProblem();
    }

    newAddProblem(){
        let a = this.random(1, 100);
        let b = this.random(1, 100);

        return {
            problem: `${a} + ${b} = __`,
            solution: a+b
        }
    }

    newSubProblem(){
        let a = this.random(1, 100);
        let b = this.random(1, 100);

        return {
            problem: `${a} - ${b} = __`,
            solution: a-b
        }
    }

    newMulProblem(){
        let a = this.random(1, 12);
        let b = this.random(1, 12);

        return {
            problem: `${a} * ${b} = __`,
            solution: a*b
        }
    }

    newDivProblem(){
        let a = this.random(1, 12);
        let b = this.random(1, 12);
        let product = a * b;

        return {
            problem: `${product} / ${a} = __`,
            solution: b
        }
    }

    random(min, max){
        return Math.floor((Math.random() * max - min + 1) + min);
    }

}

module.exports.ProblemGenerator = ProblemGenerator;