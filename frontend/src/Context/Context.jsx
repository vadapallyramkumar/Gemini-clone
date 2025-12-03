import { createContext, useState } from "react"
import runChat from "../Config/gemini";

// eslint-disable-next-line react-refresh/only-export-components
export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentprompt, setRecentprompt] = useState("");
    const [previousPrompts, setPreviousPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState(null);

    const delayParam = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index)
    }

    const newChat = () => {
        setShowResult(false);
        setResultData("");
    }

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true);
        setShowResult(true);

        let response;
        if(prompt != undefined) {
            response = await runChat(prompt);
            setRecentprompt(prompt)
        } else {
            setPreviousPrompts(prev => [...prev, input]);
            setRecentprompt(input)
            response = await runChat(input);
        }

        let responseArray = response.split("**");

        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if(i == 0 || i % 2 !== 1) {
                newResponse += responseArray[i]; 
            } else {
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponse1 = newResponse2.split(" ");
        for (let i = 0; i < newResponse1.length; i++) {
            delayParam(i, newResponse1[i] + " ");
        }

        setLoading(false);
        setInput("");
    }

    const contextValue = {
        previousPrompts,
        setPreviousPrompts,
        onSent,
        setRecentprompt,
        recentprompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
};

export default ContextProvider;