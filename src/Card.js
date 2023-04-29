import React, {useState} from "react";
import "./Card.css";

function Card({image}) {
    const [angle] = useState(Math.random()*90-45);
    const transform = `rotate(${angle}deg)`

    return (
        <img 
        className="Card-img"
        src={image}
        style={{transform}} />
    )
}

export default Card;