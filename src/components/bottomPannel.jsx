import React, { useEffect, useState } from "react";
import car from "../assets/car-door.png";
import beam from "../assets/low-beam.png";
import steering from "../assets/steering.png";
const BottomPannel = ({ colorData, updateLayer,enterCar,feature}) => {
  let [newColor, setNewColor] = useState(null);
  useEffect(() => {
    colorData(newColor);
  }, [newColor]);
  return (
    <>
      <div className="bottomMainContainer">
        <div className="bottomPannel">
          <div>
            <button>
              <img src={car} alt="" />
            </button>
          </div>
          <div>
            <input
              style={{ backgroundColor: `${newColor || "black"}` }}
              type="color"
              name="color"
              id="objColor"
              onChange={(e) => {
                setNewColor(e.target.value);
              }}
            />
          </div>
          <div>
            <button onClick={() => updateLayer()}>
              <img src={beam} alt="" />
            </button>
          </div>
        </div>
        <div className="featurebtn">
            <button className="featuredis" onClick={()=>{feature()}}>Show Feature</button>
            <button className="EnterCar" onClick={()=>{enterCar()}}>
                <img src={steering} alt="" />
            </button>
        </div>
      </div>
    </>
  );
};

export default BottomPannel;
