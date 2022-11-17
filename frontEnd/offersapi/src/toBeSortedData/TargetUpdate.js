import React, { useState } from "react";

const TargetUpdate = () => {
  const [targetedText, setTargetedText] = useState("");
  const [idText, setIdText] = useState("");
  const [displayMessage, setdisplayMessage] = useState({
    status: "",
    message: "",
  });
  let { status, message } = displayMessage;
  function postTargetToServer(e) {
    // {console.log("submiyyed")}
    (async function updateToserver() {
      // console.log("it is ");
      await fetch("http://localhost:8081/objects", {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJzZ0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRha0pqL2wzcXdOUkc2V1F2WEdHSVR1c0xpaVNVSlJLTmRDLkJCYjFuSjB6VFQzVFc3NXRreSIsImlhdCI6MTY2NzU1NzU1OX0.Nxv5QJ5K50d01XHFoj54Q7jywwZv5ucZmI3uM2fP7ww",
        },
        body: JSON.stringify({
          offer_id: idText,
          target: targetedText,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("data", data);
          setdisplayMessage(() => data);
          if (data.status == "success") {
            setTargetedText(() => "");
            setIdText(() => "");
          }
        });
    })();
    e.preventDefault();
  }
  function updateText(e) {
    setTargetedText(() => e.target.value);
    // console.log(targetedText)
  }
  function updateIDText(e) {
    setIdText(() => e.target.value);
  }
  return (
    <form onSubmit={(e) => postTargetToServer(e)}>
      <input
        value={idText}
        onChange={updateIDText}
        placeholder="enter offer id (ex: off-105)"
        type={"text"}
      />
      <input
        value={targetedText}
        onChange={updateText}
        placeholder="enter targeted players with fieldName , operator, values"
        type={"text"}
      />
      <button>Submit</button>
      {status && (
        <p className="target-server-message">
          status {status} , message {message}
        </p>
      )}
    </form>
  );
};

export default TargetUpdate;
