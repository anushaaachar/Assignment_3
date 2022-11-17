import React, { useRef } from "react";

const List = ({ setSortingMessage, randomized, setList, setText, base }) => {
  console.log("ra", randomized);
  const dragItem = useRef();
  const dragOverItem = useRef();
  const dragStart = (e, position) => {
    dragItem.current = position;
    console.log("start", e.target.innerHTML, dragItem.current);
  };
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    console.log("enter ", e.target.innerHTML);
  };
  const drop = (e) => {
    const copyListItems = [...randomized];
    const dragItemContent = copyListItems[dragItem.current]; //content
    copyListItems.splice(dragItem.current, 1); // index of drag start
    copyListItems.splice(dragOverItem.current, 0, dragItemContent); //
    console.log("drop");
    setList(copyListItems);
    console.log(
      base.indexOf(dragItemContent),
      "check ==>",
      dragOverItem.current
    );
    if (base.indexOf(dragItemContent) === dragOverItem.current) {
      setText("Right order, Go aHead");
      setSortingMessage((prev) => {
        return {
          ...prev,
          trackingState: !prev.trackingState,
          findTrue: true,
        };
      });
    } else {
      setText("Not in order,Keep trying");
      setSortingMessage((prev) => {
        return {
          ...prev,
          trackingState: !prev.trackingState,
          findTrue: false,
        };
      });
    }
    let finalCondition = true;
    for (let i = 0; i < base.length; i++) {
      if (copyListItems[i] === base[i]) {
      } else {
        finalCondition = false;
        break;
      }
    }
    if (finalCondition) {
      // setTimeout(()=>{
      setSortingMessage((prev) => {
        return {
          ...prev,
          trackingState: !prev.trackingState,
          findTrue: true,
          sorted: true,
        };
      });
      setText("You are sorted sucessfully");
      // },1000)
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };
  return (
    <>
      <div className="card-container">
        {randomized.map(
          ({ offer_id, offer_title, offer_description, offer_image }, i) => (
            <div
              className="outter"
              draggable
              key={i}
              onDragEnd={drop}
              onDragEnter={(e) => dragEnter(e, i)}
              onDragStart={(e) => dragStart(e, i)}
            >
              <div className="inner">
                <h1 className="head">OFFER ID : {offer_id}</h1>
                <h2 className="title">TITLE : {offer_title}</h2>
                <p className="desc">DESCRIPTION :{offer_description}</p>
                <p className="img-text">IMAGE SOURCE</p>
                <div className="image-container">
                  <img className="image" src={offer_image} alt="offer img" />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};
//   renderItems

// }

export default List;
