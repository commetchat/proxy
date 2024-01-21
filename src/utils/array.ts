export default {

    joinArray(a: Uint8Array, b: Uint8Array): Uint8Array {
        var mergedArray = new Uint8Array(a.length + b.length);
        mergedArray.set(a);
        mergedArray.set(b, a.length);
        return mergedArray
    }
}