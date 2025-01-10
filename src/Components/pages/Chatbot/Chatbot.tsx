import { useState, useEffect, useRef } from "react";
import { BsChatFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { BiRefresh } from "react-icons/bi";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Message, QueryData, translations, helpOptions, symptomCategories, postOpConditions, generalAdviceOptions, commonSymptoms } from "./health-chatbot-data";

enum ChatState {
    LANGUAGE_SELECT,
    NAME_INPUT,
    AGE_INPUT,
    GENDER_INPUT,
    HELP_OPTIONS,
    CONDITION_SYMPTOMS,
    POST_SURGERY,
    GENERAL_ADVICE,
    DURATION_INPUT,
    AREA_INPUT,
    BETTER_FACTORS,
    WORSE_FACTORS,
    OTHER_SYMPTOMS,
    ANALYSIS,
    COMPLETE
}

export default function HealthChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [queryData, setQueryData] = useState<QueryData>({});
    const [input, setInput] = useState("");
    const [chatState, setChatState] = useState<ChatState>(ChatState.LANGUAGE_SELECT);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [selectedCondition, setSelectedCondition] = useState<string>("");
    const [selectedAdvice, setSelectedAdvice] = useState<string>("");
    const [showButtons, setShowButtons] = useState<boolean>(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setMessages([]);
            setQueryData({});
            setChatState(ChatState.LANGUAGE_SELECT);
            setSelectedSymptoms([]);
            setSelectedCondition("");
            setSelectedAdvice("");
            botReply(translations["en"].welcomeMessage);
            setShowButtons(true);
        }
    }, [isOpen]);

    const getCurrentTranslation = () => {
        return translations[queryData.language || "en"];
    };

    const botReply = (text: string) => {
        setMessages(prev => [...prev, { sender: "bot", text }]);
    };

    const handleLanguageSelect = (language: "en" | "hi") => {
        setQueryData({ ...queryData, language });
        setShowButtons(false);
        // Clear previous messages
        setMessages([]);
        // Add new messages in selected language
        botReply(translations[language].doctorIntro);
        botReply(translations[language].nameQuestion);
        setChatState(ChatState.NAME_INPUT);
    };

    const handleUserInput = async (text: string) => {
        setMessages(prev => [...prev, { sender: "user", text }]);

        switch (chatState) {
            case ChatState.LANGUAGE_SELECT:
                const lang = text.toLowerCase() === "hindi" || text.toLowerCase() === "हिंदी" ? "hi" : "en";
                setQueryData({ ...queryData, language: lang });
                setShowButtons(false);
                // Clear previous messages and add new ones in selected language
                setMessages([]);
                botReply(translations[lang].doctorIntro);
                botReply(translations[lang].nameQuestion);
                setChatState(ChatState.NAME_INPUT);
                break;

            case ChatState.NAME_INPUT:
                setQueryData({ ...queryData, name: text });
                botReply(getCurrentTranslation().ageQuestion);
                setChatState(ChatState.AGE_INPUT);
                break;

            case ChatState.AGE_INPUT:
                setQueryData({ ...queryData, age: text });
                botReply(getCurrentTranslation().genderQuestion);
                setChatState(ChatState.GENDER_INPUT);
                break;

            case ChatState.GENDER_INPUT:
                setQueryData({ ...queryData, gender: text });
                botReply(getCurrentTranslation().helpOptions);
                setShowButtons(true);
                setChatState(ChatState.HELP_OPTIONS);
                break;

            case ChatState.HELP_OPTIONS:
                handleHelpOptionSelection(text);
                break;

            case ChatState.CONDITION_SYMPTOMS:
                setQueryData({ ...queryData, symptoms: text });
                botReply(getCurrentTranslation().durationQuestion);
                setShowButtons(false);
                setChatState(ChatState.DURATION_INPUT);
                break;

            case ChatState.DURATION_INPUT:
                setQueryData({ ...queryData, duration: text });
                botReply(getCurrentTranslation().areaQuestion);
                setChatState(ChatState.AREA_INPUT);
                break;

            case ChatState.AREA_INPUT:
                setQueryData({ ...queryData, area: text });
                botReply(getCurrentTranslation().betterQuestion);
                setChatState(ChatState.BETTER_FACTORS);
                break;

            case ChatState.BETTER_FACTORS:
                setQueryData({ ...queryData, betterWith: text });
                botReply(getCurrentTranslation().worseQuestion);
                setChatState(ChatState.WORSE_FACTORS);
                break;

            case ChatState.WORSE_FACTORS:
                setQueryData({ ...queryData, worseWith: text });
                botReply(getCurrentTranslation().otherSymptomsQuestion);
                displayOtherSymptoms();
                break;

            case ChatState.OTHER_SYMPTOMS:
                await submitToGemini();
                setChatState(ChatState.COMPLETE);
                break;

            case ChatState.POST_SURGERY:
                handlePostSurgerySelection(text);
                break;

            case ChatState.GENERAL_ADVICE:
                handleGeneralAdviceSelection(text);
                break;
        }
    };

    // const displayHelpOptions = () => {
    //     // const options = helpOptions[queryData.language || "en"];
    //     // const optionsText = options.map(opt => `* ${opt}`).join("\n");
    //     botReply(getCurrentTranslation().helpOptions);
    //     setChatState(ChatState.HELP_OPTIONS);
    // };

    const handleHelpOptionSelection = (selection: string) => {
        const lang = queryData.language || "en";

        if (selection === helpOptions[lang][0]) {
            // Know about your condition
            displaySymptomCategories();
            setChatState(ChatState.CONDITION_SYMPTOMS);
        } else if (selection === helpOptions[lang][1]) {
            // Post-Surgery Rehabilitation
            displayPostSurgeryOptions();
            setChatState(ChatState.POST_SURGERY);
        } else if (selection === helpOptions[lang][2]) {
            // General Advice
            displayGeneralAdviceOptions();
            setChatState(ChatState.GENERAL_ADVICE);
        }
    };

    const displaySymptomCategories = () => {
        // const categories = symptomCategories[queryData.language || "en"];
        botReply(getCurrentTranslation().selectSymptoms || "Select your symptoms:");
        setShowButtons(true);
    };

    const displayPostSurgeryOptions = () => {
        // const conditions = postOpConditions[queryData.language || "en"];
        botReply(getCurrentTranslation().selectCondition || "Select your Post Operation Condition:");
        setShowButtons(true);
    };

    const displayGeneralAdviceOptions = () => {
        botReply(getCurrentTranslation().selectAdvice || "Select the type of advice you need:");
        setShowButtons(true);
    };

    const handlePostSurgerySelection = async (selection: string) => {
        setSelectedCondition(selection);
        setQueryData({ ...queryData, condition: selection });

        const updatedMessages = [...messages, { sender: "user" as const, text: selection }];
        setMessages(updatedMessages);

        botReply(getCurrentTranslation().analyzing);

        // Format condition details for Gemini
        const formattedQuery = `
Patient Information:
- Name: ${queryData.name}
- Age: ${queryData.age}
- Gender: ${queryData.gender}
- Post-Surgery Condition: ${selection}

Please provide:
1. Recommended rehabilitation protocol
2. Precautions and contraindications
3. Expected recovery timeline
4. Red flags to watch for
5. When to seek immediate medical attention
6. Recommended exercises and progression

${queryData.language === 'hi' ? 'कृपया हिंदी में जवाब दें।' : 'Please respond in English.'}`;

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: formattedQuery }] }],
                }
            );

            const content = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
                setMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg.text !== "Analyzing...")
                );
                botReply(content);
                botReply(getCurrentTranslation().bookingPrompt);
            }
        } catch (error) {
            console.error("Error communicating with Gemini API:", error);
            botReply("I apologize, but I'm having trouble providing rehabilitation information right now. Please consult with a healthcare professional directly.");
        }

        setChatState(ChatState.COMPLETE);
    };

    const displayOtherSymptoms = () => {
        const symptoms = commonSymptoms[queryData.language || "en"];
        botReply(symptoms.map(s => `* ${s}`).join("\n"));
        setChatState(ChatState.OTHER_SYMPTOMS);
    };

    const handleGeneralAdviceSelection = async (selection: string) => {
        //@ts-ignore
        setQueryData({ ...queryData, adviceType: selection });

        const updatedMessages = [...messages, { sender: "user" as const, text: selection }];
        setMessages(updatedMessages);
        botReply(getCurrentTranslation().analyzing);

        const formattedQuery = `
Patient Information:
- Name: ${queryData.name}
- Age: ${queryData.age}
- Gender: ${queryData.gender}
- Advice Requested: ${selection}

Please provide concise advice regarding ${selection}, including:
1. Best practices
2. Common mistakes to avoid
3. Key lifestyle modifications
4. Basic exercise recommendations
5. When to seek professional help

${queryData.language === 'hi' ? 'कृपया हिंदी में जवाब दें।' : 'Please respond in English.'}`;

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: formattedQuery }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 512,
                    },
                }
            );

            const content = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
                setMessages((prevMessages) =>
                    prevMessages
                        .filter((msg) => msg.text !== "Analyzing...")
                        .concat({ sender: "bot", text: content })
                );
                botReply(getCurrentTranslation().bookingPrompt);
            }
        } catch (error) {
            console.error("Error communicating with Gemini API:", error);
            setMessages((prevMessages) =>
                prevMessages
                    .filter((msg) => msg.text !== "Analyzing...")
                    .concat({ sender: "bot", text: "I apologize, but I'm having trouble providing advice right now. Please consult with a healthcare professional directly." })
            );
        }

        setChatState(ChatState.COMPLETE);
    };


    const submitToGemini = async () => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        botReply(getCurrentTranslation().analyzing);

        const formattedQuery = `
Patient Information:
- Name: ${queryData.name}
- Age: ${queryData.age}
- Gender: ${queryData.gender}
- Symptoms: ${queryData.symptoms}
- Duration: ${queryData.duration}
- Area: ${queryData.area}
- Factors that help: ${queryData.betterWith}
- Factors that worsen: ${queryData.worseWith}

Based on these symptoms and factors, please provide:
1. Possible differential diagnosis
2. Precautionary management
3. Recommended exercises
4. When to seek immediate medical attention
5. Relevant emergency contact numbers in India

${queryData.language === 'hi' ? 'कृपया हिंदी में जवाब दें।' : 'Please respond in English.'}`;

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: formattedQuery }] }],
                }
            );

            const content = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
                setMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg.text !== "Analyzing...")
                );
                botReply(content);
                botReply(getCurrentTranslation().bookingPrompt);
            }
        } catch (error) {
            setMessages((prevMessages) =>
                prevMessages.filter((msg) => msg.text !== "Analyzing...")
            );
            console.error(error);
            botReply("I apologize, but I'm having trouble analyzing your symptoms right now. Please consult with a healthcare professional directly.");
        }
    };

    const resetChat = () => {
        setMessages([]);
        setQueryData({}); // Reset with empty object
        setChatState(ChatState.LANGUAGE_SELECT); // Reset to language selection
        setSelectedSymptoms([]);
        setSelectedCondition("");
        setSelectedAdvice("");
        setShowButtons(true); // Show language selection buttons
        botReply(translations["en"].welcomeMessage); // Show initial welcome message
    };

    const renderButtons = () => {
        const lang = queryData.language || "en";
        switch (chatState) {
            case ChatState.LANGUAGE_SELECT:
                return (
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => handleLanguageSelect("en")}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                            English
                        </button>
                        <button
                            onClick={() => handleLanguageSelect("hi")}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                            हिंदी
                        </button>
                    </div>
                );

            case ChatState.HELP_OPTIONS:
                return (
                    <div className="flex flex-col gap-2">
                        {helpOptions[lang].map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    setMessages(prev => [...prev, { sender: "user", text: option }]);
                                    handleHelpOptionSelection(option);
                                }}
                                className="px-4 py-2 bg-primary-semidark text-white hover:bg-primary-dark hover:text-white rounded-lg text-left transition-colors duration-200"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                );

            case ChatState.CONDITION_SYMPTOMS:
                const categories = symptomCategories[lang];
                return (
                    <div className="max-h-60 overflow-y-auto">
                        {Object.entries(categories).map(([category, symptoms]) => (
                            <div key={category} className="mb-4">
                                <h3 className="font-bold mb-2 text-primary-dark">{category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {symptoms.map((symptom) => (
                                        <button
                                            key={symptom}
                                            onClick={() => {
                                                const isSelected = selectedSymptoms.includes(symptom);
                                                if (isSelected) {
                                                    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
                                                } else {
                                                    setSelectedSymptoms([...selectedSymptoms, symptom]);
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-full text-sm ${selectedSymptoms.includes(symptom)
                                                ? "bg-primary-dark text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-primary-semidark hover:text-white"
                                                } transition-colors duration-200`}
                                        >
                                            {symptom}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {selectedSymptoms.length > 0 && (
                            <button
                                onClick={() => {
                                    handleUserInput(selectedSymptoms.join(", "));
                                    setShowButtons(false);
                                }}
                                className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors duration-200"
                            >
                                {translations[lang].confirm || "Confirm Selection"}
                            </button>
                        )}
                    </div>
                );


            case ChatState.POST_SURGERY:
                const conditions = postOpConditions[queryData.language || "en"];
                return (
                    <div className="max-h-60 overflow-y-auto">
                        {Object.entries(conditions).map(([category, items]) => (
                            <div key={category} className="mb-4">
                                <h3 className="font-bold mb-2 text-primary-dark">{category}</h3>
                                <div className="flex flex-row flex-wrap gap-2 text-sm">
                                    {items.map((condition) => (
                                        <button
                                            key={condition}
                                            onClick={() => {
                                                setSelectedCondition(condition);
                                                handlePostSurgerySelection(condition);
                                                setShowButtons(false);
                                            }}
                                            className={`px-4 py-2 rounded-lg text-left ${selectedCondition === condition
                                                ? "bg-primary text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-primary-semidark hover:text-white"
                                                } transition-colors duration-200`}
                                        >
                                            {condition}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case ChatState.GENERAL_ADVICE:
                return (
                    <div className="flex flex-col gap-2">
                        {generalAdviceOptions[queryData.language || "en"].map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    setSelectedAdvice(option);
                                    handleGeneralAdviceSelection(option);
                                    setShowButtons(false);
                                }}
                                className={`px-4 py-2 rounded-lg text-left ${selectedAdvice === option
                                    ? "bg-primary-semidark text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-primary-semidark hover:text-white"
                                    } transition-colors duration-200`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary hover:bg-primary-semidark text-white p-4 rounded-full shadow-lg transition-colors duration-200"
                >
                    <BsChatFill className="w-6 h-6" />
                </button>
            ) : (
                <div className="w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
                    {/* Header remains the same */}
                    <div className="flex justify-between items-center p-4 bg-primary-dark text-white">
                        <h2 className="text-xl font-bold">
                            {getCurrentTranslation().healthAssistant}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={resetChat}
                                className="p-2 hover:bg-primary-semidark rounded-full transition-colors duration-200"
                                title={getCurrentTranslation().resetChat}
                            >
                                <BiRefresh className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-primary-semidark rounded-full transition-colors duration-200"
                                title={getCurrentTranslation().close}
                            >
                                <IoMdClose className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary-light">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-[80%] ${msg.sender === "bot"
                                    ? "bg-white self-start rounded-br-lg shadow-lg"
                                    : "bg-primary-semidark text-white self-end rounded-bl-lg ml-auto"
                                    } p-3 rounded-t-lg text-sm`}
                            >
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Button or Input Section */}
                    <div className="p-4 border-t bg-white">
                        {showButtons && renderButtons()}
                        {!showButtons && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (input.trim()) {
                                        handleUserInput(input.trim());
                                        setInput("");
                                    }
                                }}
                            >
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={getCurrentTranslation().typeMessage}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-primary text-text-dark placeholder:text-text-light"
                                        disabled={chatState === ChatState.COMPLETE}
                                    />
                                    <button
                                        type="submit"
                                        disabled={chatState === ChatState.COMPLETE}
                                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${chatState === ChatState.COMPLETE
                                            ? "bg-gray-400"
                                            : "bg-primary-semidark hover:bg-primary-dark"
                                            } text-white`}
                                    >
                                        {getCurrentTranslation().send}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}