// 4.1. TypeScriptは、関数の型シグネチャのうち、どの部分を推論するでしょうか? パラメーターでしょ うか、戻り値の型でしょうか、それともその両方でしょうか?
// 両方

// 4.2. JavaScriptのargumentsオブジェクトは型安全でしょうか? もしそうでないとすると、代わりに何が使えるでしょうか?
// 型安全ではない. rest parameterを使う

// 4.3. すぐに出発する旅行を予約する機能が欲しいとします。オーバーロードされたreserve関数(「4.1.9 オーバーロードされた関数の型」を参照)を、3 番目の呼び出しシグネチャを作成して書き換えてく ださい。このシグネチャは、目的地(destination)だけを取り、明示的な出発日(from)は取りま せん。この新しいオーバーロードされたシグネチャをサポートするように、reserveの実装を書き換えてください。
type Reservation = string
type Reserve = {
    (from: Date, to: Date, destination: string): Reservation
    (from: Date, destination: string): Reservation

    // only destination
    (destination: string): Reservation
}

let reserve: Reserve = (
    fromOrDestination: Date | string,
    toOrDestination?: Date | string,
    destination?: string
) => {
    if (fromOrDestination instanceof Date) {
        if (toOrDestination instanceof Date && destination !== undefined) {
            return '宿泊旅行を予約する'
        } else if (typeof toOrDestination === 'string') {
            return '日帰り旅行を予約する'
        }
    } else if (typeof fromOrDestination === 'string') {
        return 'すぐ出発する旅行を予約する'
    }
    return 'not exist'
}

console.assert(reserve(new Date(), 'a') === '日帰り旅行を予約する','日帰り旅行を予約する')
console.assert(reserve(new Date(), new Date(), 'a') === '宿泊旅行を予約する','宿泊旅行を予約する')
console.assert(reserve('a') === 'すぐ出発する旅行を予約する','すぐ出発する旅行を予約する')


// 4.4.[難問]callの実装(「4.2.5.2 制限付きポリモーフィズムを使って、可変長引数をモデル化する」を 参照)を、2 番目の引数がstringである関数について「だけ」機能するように書き換えてください。 そうではない関数を渡すと、コンパイル時にエラーとなるようにします。

function call<T extends [unknown, string, ...unknown[]], R>(
    f: (...args: T) => R,
    ...args: T
): R {
    return f(...args)
}

// 4.5. 型安全なアサーション関数、isを実装してください。

function is<T>(a: T, ...b: [T, ...T[]]): boolean {
    if (typeof a === 'object') {
        return b.every(_ => JSON.stringify(_) === JSON.stringify(a))
    }
    return b.every(_ => _ === a)
}

console.assert(is('string', 'string'), 'check strings')
console.assert(is('string', 'string', 'string'), 'check strings')
console.assert(!is('string', 'string', 'otherstring'), 'check strings')
console.assert(!is('string', 'otherstring'), 'check strings')

console.assert(is(1, 1), 'check numbers')
console.assert(is(1, 1,1), 'check numbers')
console.assert(!is(1, 10), 'check numbers')
console.assert(!is(1, 1,10), 'check numbers')

type Sample = {
    a: number,
}
console.assert(is([1], [1], [1]), '1. check array')
console.assert(is({a:1}, {a:1}, {a:1}), '1. check obj')
console.assert(is(new Date(), new Date()), '1. check date')
console.assert(!is(new Date(), new Date(1995, 11, 17)), '1. check date')

// console.assert(is([1,2], [1,2]), '1. check array')
// console.assert(is([1,2], [1,2], [1,2]), '2. check array')
// console.assert(!is([1,2], [1,2,3]), '3. check array')
// console.assert(!is([1,2], [1,2], [1,2,3]), '4. check array')
