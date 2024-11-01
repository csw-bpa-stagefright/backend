export abstract class Result<T, E> {
    abstract isOk(): this is Ok<T, E>;
    abstract isErr(): this is Err<T, E>;
    abstract map<U>(fn: (value: T) => U): Result<U, E>;
    abstract mapErr<F>(fn: (error: E) => F): Result<T, F>;
    abstract unwrap(): T;
    abstract unwrapOr(defaultValue: T): T;
}

export class Ok<T, E> extends Result<T, E> {
    constructor(private value: T) {
        super();
    }

    isOk(): this is Ok<T, E> {
        return true;
    }

    isErr(): this is Err<T, E> {
        return false;
    }

    map<U>(fn: (value: T) => U): Result<U, E> {
        return new Ok(fn(this.value));
    }

    mapErr<F>(fn: (error: E) => F): Result<T, F> {
        return new Ok(this.value);
    }

    unwrap(): T {
        return this.value;
    }

    unwrapOr(defaultValue: T): T {
        return this.value;
    }
}

export class Err<T, E> extends Result<T, E> {
    private err: E;
    constructor(private error: E) {
        super();
        this.err = error;
    }

    isOk(): this is Ok<T, E> {
        return false;
    }

    isErr(): this is Err<T, E> {
        return true;
    }

    map<U>(fn: (value: T) => U): Result<U, E> {
        return new Err(this.error);
    }

    mapErr<F>(fn: (error: E) => F): Result<T, F> {
        return new Err(fn(this.error));
    }

    unwrap(): T {
        throw new Error("Called unwrap on Err");
    }

    unwrapOr(defaultValue: T): T {
        return defaultValue;
    }

    unwrapErr(): E {
        return this.err;
    }
}
