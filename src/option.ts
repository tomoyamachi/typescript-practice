interface Option<T> {
    flatMap<U>(f: (value: T) => None): None
    flatMap<U>(f: (value: T) => Option<U>): Option<U>
    getOrElse(value: T): T
}

class Some<T> implements Option<T> {
    constructor(private value: T) {}
    flatMap<U>(f: (value: T) => None): None
    flatMap<U>(f: (value: T) => Some<U>): Some<U>
    flatMap<U>(f: (value: T) => Option<U>): Option<U> {
        return f(this.value)
    }
    getOrElse<U>(_:U): T {
        return this.value
    }
}

class None implements Option<never> {
    flatMap(): None {return this }
    getOrElse<U>(value: U): U {return value }
}

function Option<T>(value: null | undefined): None
function Option<T>(value: T): Some<T>
function Option<T>(value: T): Option<T> {
    if (value == null) {
        return new None
    }
    return new Some(value)
}

let noneResult = Option(6)  // Some<number>
    .flatMap(n => Option(n * 3)) // Some<number>
    .flatMap(n => new None) // None
    .getOrElse("None set")
console.info(noneResult) // None set

let someResult = Option(6)  // Some<number>
    .flatMap(n => Option(n * 3)) // Some<number>
    .getOrElse("None set")
console.info(someResult) // 18
