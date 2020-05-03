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


// 5.1. クラスとインターフェースの違いは何でしょうか?
// クラスは値と型, インターフェースは型のみ

// 5.2. クラスのコンストラクターをprivateと指定すると、そのクラスをインスタンス化したり拡張した りできないという意味になります。代わりに protectedと指定すると、何が起こるでしょうか? コードエディターでいろいろと試してみてください。
// 拡張はできるけど、外部からnewできない

// 5.3. 「5.11.1 ファクトリーパターン」で作成した実装を拡張して、抽象化を多少犠牲にしてでも、よ り 安 全 に し て く だ さ い。 つ ま り、Shoe.create('boot')を 呼 び 出 す と Boot が 返 さ れ、Shoe. c r e a t e ( ' b a l l e t F l a t ' ) を 呼 び 出 す と B a l l e t F l a t が 返 さ れ る こ と を( ど ち ら も S h o e が 返 さ れ る のではなく)、利用者がコンパイル時にわかるように、実装を書き換えてください。ヒント:「4.1.9 オーバーロードされた関数の型」を思い出してください。

type Shoe = { purpose: string }
class BalletFlat implements Shoe {purpose = 'dancing' }
class Boot implements Shoe {purpose = 'woodcutting' }
class Sneaker implements Shoe {purpose = 'walking' }

type ShoeFactory= {
    create(type: 'balletFlat'): BalletFlat
    create(type: 'boot'): Boot
    create(type: 'sneaker'): Sneaker
}


let Shoe = {
    create(type: 'balletFlat' | 'boot' | 'sneaker'): Shoe {
        switch (type) {
            case 'balletFlat': return new BalletFlat()
            case 'boot': return new Boot()
            case 'sneaker': return new Sneaker()
        }
    }
}

// 5.4. [難問]練習として、型安全なビルダーパターンをどうしたら設計できるか考えてみてください。次 のことを実現できるように、「5.11.2 ビルダーパターン」のビルダーパターンを拡張します。
//  a. 少なくとも URL とメソッドの設定が終わるまでは .sendを呼び出せないことをコンパイル時に 保証します。メソッドを特定の順序で呼び出すことをユーザーに強制したら、これを保証する ことは容易になるでしょうか?(ヒント:thisの代わりに何を返せるでしょうか?)
//  b. [より難問]ユーザーがメソッドを任意の順序で呼び出せるようにしたまま、これを保証したい としたら、設計をどのように変更すればよいでしょうか?(ヒント:それぞれのメソッド呼び出 し の 後 で 、 そ れ ぞ れ の メ ソ ッ ド の 戻 り 値 の 型 を t h i s に「 追 加 す る 」に は 、 T y p e S c r i p t の ど の よ うな機能を使えばよいでしょうか?)


// 6.1. 次のそれぞれの型のペアについて、最初の型が2番目の型に割り当て可能かどうかを、その理由も 添えて答えてください。サブタイプと変性の観点からこれらについて考え、もし確信を持って答え られなければ、章の初めのほうのルールを参照してください(それでも確信が持てなければ、コー ドエディターに入力してチェックしてください)。
//   a.   1 と number : ○
// let a: number
// a = 1 as 1
//   b. number と 1 : ×
//   c. stringとnumber | string : ○
//   d. boolean と number : ×
//   e. number[]と(number | string)[] : ○
//   f. (number | string)[]とnumber[] : ×
//   g. {a: true}と{a: boolean} : ○
//   h. {a: {b: [string]}}と{a: {b: [number | string]}} :○
//   i. (a: number) => stringと(b: number) => string : ○
//   j. (a: number) => stringと(a: string) => string : ×
//   k. (a: number | string) => string と (a: string) => string : ○
let k: (a: string) => string
k = ((a: number | string) => 'b') as (a: number | string) => string
//   l. (列挙型enum E {X = 'X'}で定義されている)E.Xと(列挙型enum F {X = 'X'}で定義されている)F.X : ×

// 6.2. type O = {a: {b: {c: string}}} というオブジェクト型がある場合、keyof Oの型は何になるでしょうか? O['a']['b']については、どうでしょうか?
// keyof O : a,  0['a']['b'] : {c:string}

// 6.3. TかUのどちらかに含まれる(ただし両方には含まれない)型を計算するExclusive<T, U>型を 記述してください。たとえば、Exclusive<1 | 2 | 3, 2 | 3 | 4>は、1 | 4になります。 Exclusive<1 | 2, 2 | 4>を型チェッカーがどのように評価するかを、ステップごとに書き出して ください。
// 6.4. 明確な割り当てアサーションを使わないように、(「6.6.3 明確な割り当てアサーション」の)例を書 き直してください。
