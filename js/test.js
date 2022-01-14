class Util{
    static testJust(arr){
        arr[0] = 'abc';
        arr[1] = 'cde';
    }
    static randint(from, to) {
        return Math.floor(from + Math.random() * (to - from))
    }
}
// let a=[1,2]
// Util.testJust(a)
// console.log(a)
// Util.prototype.testJust()

class TestVariable{
    constructor(a, b){
        this.a = a;
        this.b = b;
    }
}
let a = 1;
let b = 2;
console.log(a);
console.log(b);
[a, b] = [b, a];
console.log(a);
console.log(b);

// let arr = [new TestVariable(2, 'abc'), new TestVariable(9, '-=1'), new TestVariable(73, 'c4jga'), new TestVariable(8, '91hj')]
// console.log(arr.sort((o1, o2) => o2.a - o1.a))
// console.log("arr:", arr)