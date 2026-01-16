import { createContext, useState } from "react";

export const FavContext = createContext();

export function FavProvider({children}){
    
    const [favCart, setFavCart] = useState([]);
    const addFavCart = (product)=>{
        setFavCart((prev) => [...prev, product]);
    }

    const removeFavFromCart = (index)=>{
        setFavCart((prev) => prev.filter((_, el) => el !== index));
    }
    const clearFav = () =>{
        setFavCart([]);
    }

    return (
        <FavContext.Provider value={{favCart, addFavCart, removeFavFromCart, clearFav}}>
            {children}
        </FavContext.Provider>
    );
}
export default FavProvider;