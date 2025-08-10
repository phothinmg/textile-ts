import { describe, it } from "node:test";
import assert from "node:assert";
import { extend } from "../src/lib/textile-jml";

describe("Extend", () => {
  it("test", () => {
    const obj = { a: 2 };
    assert.deepEqual(extend(obj), obj);
  });
});
