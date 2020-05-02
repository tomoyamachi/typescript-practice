

type ClassConstructor<T> = new(...args: any[]) => T

function withEZDebug<C extends ClassConstructor<{getDebugValue():object }>>
(Class: C) {
    return class extends Class {
        constructor(...args: any[]) {
            super(...args)
        }
        debug() {
            const value = this.getDebugValue()
            console.log(this.constructor.name,'(' + JSON.stringify(value) + ')')
        }
    }
}

class HardToDebugUser {
    constructor(
        private id: number, private firstName: string, private lastName: string
    ) {}

    getDebugValue() {
        return {
            id: this.id,
            name: this.firstName + ' ' + this.lastName }
    }
}

let User = withEZDebug(HardToDebugUser)
let user = new User(3, 'Emma', 'Gluzman')
user.debug()
