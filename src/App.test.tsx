import {render} from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  const {getByText} = render(<App />);

  expect(getByText(/learn/i)).toBeInTheDocument();
});

// function add(a, b) {
//   if (typeof a === "string") {
//     window.alert("a is string");
//   }
//   return a + b;
// }

// if (add(1, 2) === 3) {
//   console.log("success");
// } else {
//   console.log("error");
// }

// if (add(5, 7) === 12) {
//   console.log("success");
// } else {
//   console.log("error");
// }

// if (add("3", "4") === 7) {
//   console.log("success");
// } else {
//   console.log("error");
// }

// describe("add function", () => {
//   test("adds 1 + 2 to equal 3", () => {
//     expect(add(1, 2)).toBe(3);
//   });
//   xit("should adds -2 + -3 to equal -5", () => {
//     expect(add(-2, -3)).toBe(-5);
//   });
//   it("should alert if a is a string", () => {
//     expect(add(2, 6)).toBe(8);
//   });

//   // test("test alert", () => {
//   //   // 用 jest.spyOn() 監聽 window.alert 方法
//   //   const spy = jest.spyOn(window, "alert").mockImplementation(() => {});

//   //   // 調用要測試的函數，它調用了 alert
//   //   // myFunctionThatUsesAlert();

//   //   // 驗證 alert 是否被調用
//   //   expect(spy).toHaveBeenCalled();

//   //   // 清除 spy
//   //   spy.mockRestore();
//   // });
// });

// describe 描述在 run 的東西
// test
// expect

// https://jestjs.io/docs/using-matchers

// mock fake spy stub
// Testing Running Tests Coverage Reporting
// 測試覆蓋率 80%

// TDD 先測試再開發

// checkBoxWithLabel-test.js
// enzyme
// test-renderer -> 測 render

// 先測核心功能、使用者最常使用到的部分

// component -> Snapshot Testing，比較不會去動到 UI

// 要 push 上 github
