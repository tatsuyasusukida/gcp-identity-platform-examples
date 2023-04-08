import { createContext } from "react";

const MyFirstContext = createContext<string>("defaultValue");

export default function ReactContext() {
  return (
    <>
      <MyFirstContext.Provider value="passedValue">
        <h1>React Context</h1>
        <MyFirstContext.Consumer>
          {(value) => <p>{value}</p>}
        </MyFirstContext.Consumer>
      </MyFirstContext.Provider>
    </>
  );
}
