import { round, bignumber, subtract, multiply, divide, add } from "mathjs";

export default class MATH {
    static add(a, b) {
        return Number(add(bignumber(a), bignumber(b)));
    }
    static subtract(a, b) {
        return Number(subtract(bignumber(a), bignumber(b)));
    }
    static multiply(a, b) {
        return Number(multiply(bignumber(a), bignumber(b)));
    }
    static divide(a, b) {
        return Number(divide(bignumber(a), bignumber(b)));
    }
    static round(num, length = 2) {
        if (num === "" || typeof num === "undefined") num = 0;
        return Number(round(num, length));
    }
}