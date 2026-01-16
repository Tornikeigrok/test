import { createContext, useContext, useState } from "react";

const userContent = createContext();
export const DocumentContentProvider = ({children})=>{
    const [uID, setuID] = useState(0);
    return(
        <userContent.Provider value={{uID, setuID}}>
            {children}
        </userContent.Provider>
    )
}

export const useContent = ()=> useContext(userContent);