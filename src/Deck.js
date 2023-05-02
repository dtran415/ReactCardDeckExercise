import React, {useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

function Deck() {
    const [deck, setDeck] = useState();
    // array of drawn cards
    const [cards, setCards] = useState([]);
    const [hasCards, setHasCards] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    const timerRef = useRef();

    async function getDeck() {
        try {
            /*
                resp = {
                    "success":bool, 
                    "deck_id":string, 
                    "remaining":int, 
                    "shuffled":bool
                }
            */
            const resp = await axios.get(`${API_BASE_URL}/new/shuffle`);
            setDeck(resp.data);
        } catch(e) {
            alert(e);
        }
    }

    async function getCard() {
        try {
            /* response = {
                    "success": bool,
                    "deck_id": string,
                    "cards": [
                        {
                            "code": string,
                            "image": string,
                            "images": {
                                "svg": string,
                                "png": string
                            },
                            "value": string,
                            "suit": string
                        }
                    ],
                    "remaining": int
                }
            } */
            if (hasCards) {
                const resp = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw`);
                const card = resp.data.cards[0];
                if (card) {
                    setCards(cards => [...cards, resp.data.cards[0]])
                }
                if (resp.data.remaining===0) {
                    clearTimer();
                    setHasCards(false);
                    alert("No more cards");
                }
            }
            
        } catch(e) {
            alert(e);
        }
    }

    async function toggleDraw() {
        setIsDrawing(isDrawing=>!isDrawing);
    }

    function clearTimer() {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }

    useEffect(()=>{
        getDeck();
    },[]);

    useEffect(()=> {
        if (isDrawing) {
            timerRef.current = setInterval(async() => {
                await getCard();
            }, 1000);
        }

        return ()=>{clearTimer()};
    },[isDrawing]);

    const cardComponents = (<div>
        {cards.map(card=><Card key={card.code} image={card.image}/>)}
    </div>)

    return (
        <div>
            {hasCards?
                (<><button onClick={()=>getCard()}>Draw Card</button>
                <button onClick={()=>toggleDraw()}>{isDrawing?"Stop Drawing":"Start Drawing"}</button></>)
                :""}
            <div>{cardComponents}</div>
            
        </div>
    )
}


export default Deck;