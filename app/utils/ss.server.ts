import { singleton } from "~/utils/singleton.server";

export const db = singleton(
  "example_singleton",
  () => getRandomNumber()
);

function getRandomNumber() {
    return Math.floor(Math.random() * (15000 - 10 + 1)) + 10;
  }
  