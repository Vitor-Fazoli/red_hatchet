import { hatchet } from 'red-hatchet';

const counter = hatchet("counter", { value: 0 })
counter.value++;
console.log("Counter value:", counter.value)