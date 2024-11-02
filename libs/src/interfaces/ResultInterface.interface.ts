export interface ResultInterface<E> {
    data: "success" | "error";
    error?:E;
}