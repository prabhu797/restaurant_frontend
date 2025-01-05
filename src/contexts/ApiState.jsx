import { useState } from "react";
import ApiContext from "./ApiContext";

const ApiState = (props) => {

    const [apiKey, setApiKey] = useState('');
    const url = `http://localhost:8080/`;

    const changeApiKey = (key) => {
        setApiKey(key);
    }

    return (
        <ApiContext.Provider value={{apiKey, url, changeApiKey}}>
            {props.children}
        </ApiContext.Provider>
    )
}

export default ApiState;