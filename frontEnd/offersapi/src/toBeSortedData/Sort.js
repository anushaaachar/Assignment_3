import React, { useEffect, useState } from "react";
import List from "./List";

const Sort = () => {
  const [base, setBase] = useState([]);
  const [text, setText] = useState("");
  const [list, setList] = useState([]);
  const [sortingMessage, setSortingMessage] = useState({
    trackingState: true,
    findTrue: false,
    sorted: false,
  });

  useEffect(() => {
    // let intervalId ;
    // if(sortingMessage!=""){
    //     if(sortingMessage){
    //       intervalId = setInterval(()=>{
    //         setText("Right order, Go aHead")
    //       },1000)
    //       return(() => {
    //           setTimeout(clearInterval(intervalId),1000)
    //         })
    //     }else{
    //       intervalId = setInterval(()=>{
    //         setText("Not in order,Keep trying")
    //       },1000)
    //       return(() => {
    //           setTimeout(clearInterval(intervalId),1000)
    //         })
    //     }
    // }
    if (sortingMessage.sorted !== true) {
      setTimeout(() => {
        setText("");
      }, 1000);
    }
  }, [sortingMessage]);

  useEffect(() => {
    fetch("http://localhost:8081/objects", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJzZ0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRha0pqL2wzcXdOUkc2V1F2WEdHSVR1c0xpaVNVSlJLTmRDLkJCYjFuSjB6VFQzVFc3NXRreSIsImlhdCI6MTY2NzU1NzU1OX0.Nxv5QJ5K50d01XHFoj54Q7jywwZv5ucZmI3uM2fP7ww",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("datas ", data);
        setBase(() => data);
        let randomized = [...data];
        randomized = randomized.sort(() => Math.random() - 0.5);
        setList(randomized);
      });
  }, []);
  return (
    <div>
      <p
        className={"display-message"}
        style={{ color: sortingMessage.findTrue ? "green" : "red" }}
      >
        {text}
      </p>
      <List
        setSortingMessage={setSortingMessage}
        randomized={list}
        base={base}
        setText={setText}
        setList={setList}
      />
    </div>
  );
};

export default Sort;
