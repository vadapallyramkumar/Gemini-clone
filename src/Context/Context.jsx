import { createContext, useState } from "react"
// import runChat from "../Config/gemini";

// eslint-disable-next-line react-refresh/only-export-components
export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentprompt, setRecentprompt] = useState("");
    const [previousPrompts, setPreviousPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState(null);

    const onSent = async () => {
        setResultData("")
        setLoading(true);
        setShowResult(true);
        setRecentprompt(input);
        const response = 'Hello' //await runChat(input);
        setResultData(response);
        setLoading(false);
        setInput("")
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
        setInput
    };

    

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
};

export default ContextProvider;