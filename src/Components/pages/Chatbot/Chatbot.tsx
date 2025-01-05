import React, { useState, useEffect, useRef } from "react";
import { BsChatFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { BiRefresh } from "react-icons/bi";
import axios from "axios";
import ReactMarkdown from "react-markdown";

// Define types
type Message = {
    sender: "user" | "bot";
    text: string;
};

type QueryData = {
    language?: "en" | "hi";
    age?: string;
    gender?: string;
    duration?: string;
    symptoms?: string;
};

// Bilingual content
const translations = {
    en: {
        welcomeMessage: "Hello! How are you? First, please select your preferred language.",
        languageSelect: "Select Language",
        ageQuestion: "To help you better, please tell me your age.",
        genderQuestion: "Got it! What's your gender?",
        symptomQuestion: "Thank you! Now, please select your symptoms.",
        durationQuestion: "How long have you been feeling this way?",
        analyzing: "Analyzing your data. Please wait...",
        selectedSymptoms: "You selected the following symptoms:",
        confirmSelection: "Confirm Selection",
        typeMessage: "Type your message...",
        send: "Send",
        healthAssistant: "Health Assistant",
        errorMessage: "Sorry, something went wrong while fetching the data.",
        noCandidates: "No response available at the moment.",
        resetChat: "Reset Chat",
        close: "Close"
    },
    hi: {
        welcomeMessage: "नमस्ते! आप कैसे हैं? सबसे पहले, कृपया अपनी पसंदीदा भाषा चुनें।",
        languageSelect: "भाषा चुनें",
        ageQuestion: "आपकी बेहतर मदद करने के लिए, कृपया अपनी उम्र बताएं।",
        genderQuestion: "समझ गया! आपका लिंग क्या है?",
        symptomQuestion: "धन्यवाद! अब, कृपया अपने लक्षण चुनें।",
        durationQuestion: "आप कब से ऐसा महसूस कर रहे हैं?",
        analyzing: "आपका डेटा विश्लेषण किया जा रहा है। कृपया प्रतीक्षा करें...",
        selectedSymptoms: "आपने निम्नलिखित लक्षण चुने हैं:",
        confirmSelection: "चयन की पुष्टि करें",
        typeMessage: "अपना संदेश लिखें...",
        send: "भेजें",
        healthAssistant: "स्वास्थ्य सहायक",
        errorMessage: "क्षमा करें, डेटा प्राप्त करने में कुछ गड़बड़ी हुई।",
        noCandidates: "इस समय कोई प्रतिक्रिया उपलब्ध नहीं है।",
        resetChat: "चैट रीसेट करें",
        close: "बंद करें"
    }
};

const symptomCategories = {
    en: {
        "Musculoskeletal Symptoms": [
            "Joint Pain",
            "Muscle Pain",
            "Swelling",
            "Redness",
            "Muscle Cramps",
            "Radiating Pain",
            "Stiffness",
            "Limitation in activities"
        ],
        "Respiratory Symptoms": [
            "Cough",
            "Difficulty in breathing",
            "Chest pain",
            "Wheezing",
            "Secretions in chest"
        ],
        "Cardiovascular Symptoms": [
            "Chest pain",
            "Palpitations",
            "Dizziness",
            "Fainting",
            "Swelling of legs"
        ],
        "Neurological Symptoms": [
            "Headache",
            "Paralysis",
            "Burning",
            "Shooting pain",
            "Numbness",
            "Tingling",
            "Weakness",
            "Fatigue",
            "Loss of balance",
            "Gait disturbance"
        ],
        "Skin Symptoms": [
            "Rash",
            "Itching",
            "Redness",
            "Swelling",
            "Warmth",
            "Nodules"
        ]
    },
    hi: {
        "मांसपेशियों और हड्डियों के लक्षण": [
            "जोड़ों का दर्द",
            "मांसपेशियों का दर्द",
            "सूजन",
            "लाली",
            "मांसपेशियों में ऐंठन",
            "फैलता दर्द",
            "अकड़न",
            "गतिविधियों में सीमाएं"
        ],
        "श्वसन संबंधी लक्षण": [
            "खांसी",
            "सांस लेने में कठिनाई",
            "छाती में दर्द",
            "सांस फूलना",
            "छाती में कफ"
        ],
        "हृदय संबंधी लक्षण": [
            "छाती में दर्द",
            "धड़कन",
            "चक्कर आना",
            "बेहोशी",
            "पैरों में सूजन"
        ],
        "तंत्रिका संबंधी लक्षण": [
            "सिरदर्द",
            "लकवा",
            "जलन",
            "चुभता दर्द",
            "सुन्नपन",
            "झुनझुनी",
            "कमजोरी",
            "थकान",
            "संतुलन की कमी",
            "चलने में परेशानी"
        ],
        "त्वचा संबंधी लक्षण": [
            "चकत्ते",
            "खुजली",
            "लाली",
            "सूजन",
            "गर्मापन",
            "गांठें"
        ]
    }
};

export default function HealthChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [queryData, setQueryData] = useState<QueryData>({});
    const [input, setInput] = useState("");
    const [showLanguageSelector, setShowLanguageSelector] = useState(true);
    const [showSymptomSelector, setShowSymptomSelector] = useState(false);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [initialized, setInitialized] = useState(false); // New state to track initialization

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen && !initialized && messages.length === 0) {
            botReply(translations.en.welcomeMessage);
            setInitialized(true);
        }
    }, [isOpen, initialized, messages.length]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const resetConversation = () => {
        setMessages([]);
        setQueryData({});
        setInput("");
        setShowLanguageSelector(true);
        setShowSymptomSelector(false);
        setSelectedSymptoms([]);
        setAnalysisComplete(false);
        botReply(translations.en.welcomeMessage);
        setInitialized(false);
    };

    const selectLanguage = (language: "en" | "hi") => {
        setQueryData({ ...queryData, language });
        setShowLanguageSelector(false);
        botReply(translations[language].ageQuestion);
    };

    const getCurrentTranslation = () => {
        return translations[queryData.language || "en"];
    };

    const getCurrentSymptomCategories = () => {
        return symptomCategories[queryData.language || "en"];
    };

    const handleUserInput = async (text: string) => {
        const updatedMessages: Message[] = [
            ...messages,
            { sender: "user", text }
        ];
        setMessages(updatedMessages);

        if (!queryData.age) {
            setQueryData({ ...queryData, age: text });
            botReply(getCurrentTranslation().genderQuestion);
        } else if (!queryData.gender) {
            setQueryData({ ...queryData, gender: text });
            botReply(getCurrentTranslation().symptomQuestion);
            setShowSymptomSelector(true);
        } else if (!queryData.duration) {
            setQueryData({ ...queryData, duration: text });
            botReply(getCurrentTranslation().analyzing);
            await submitToGemini();
        }
    };

    const handleSymptomSelection = () => {
        setQueryData({ ...queryData, symptoms: selectedSymptoms.join(", ") });
        setShowSymptomSelector(false);
        botReply(`${getCurrentTranslation().selectedSymptoms} ${selectedSymptoms.join(", ")}`);
        botReply(getCurrentTranslation().durationQuestion);
    };

    const botReply = (text: string) => {
        let formattedText = text;
        formattedText = formattedText.replace(/(\*\*.*?\*\*)/g, '\n$1');
        formattedText = formattedText.replace(/\n\*/g, '\n\n*');
        formattedText = formattedText.replace(/\n\n\n/g, '\n\n');
        formattedText = formattedText.replace(/\n\n/g, '\n\n\n');
        formattedText = formattedText.replace(/\*(.*?)\*/g, (_, content) => `*${content}*`);

        setMessages((prev) => [...prev, { sender: "bot", text: formattedText }]);
    };

    const submitToGemini = async () => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const formattedQuery = `Patient details: ${JSON.stringify(queryData)}. ${queryData.language === 'hi'
            ? 'कृपया कुछ संभावित कारण और इस स्थिति में प्राथमिक चिकित्सा के बारे में बताएं। रोगी भारतीय है, इसलिए भारतीय आपातकालीन नंबर दें।'
            : 'Please provide some possible causes and what can I do to prevent it? Patient is Indian so give Indian emergency numbers.'
            }`;

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: formattedQuery }] }],
                }
            );

            const candidates = response?.data?.candidates;
            if (candidates && candidates.length > 0) {
                const content = candidates[0]?.content?.parts;
                const result = content && content.length > 0 ? content[0]?.text : getCurrentTranslation().noCandidates;
                botReply(result);
            } else {
                botReply(getCurrentTranslation().noCandidates);
            }

            setAnalysisComplete(true);
        } catch (error) {
            console.error("Error communicating with Gemini API:", error);
            botReply(getCurrentTranslation().errorMessage);
            setAnalysisComplete(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            handleUserInput(input.trim());
            setInput("");
        }
    };

    const toggleSymptom = (symptom: string) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptom)
                ? prev.filter((s) => s !== symptom)
                : [...prev, symptom]
        );
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
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 bg-primary-dark text-white">
                        <h2 className="text-xl font-bold">
                            {getCurrentTranslation().healthAssistant}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={resetConversation}
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

                    {/* Language Selector */}
                    {showLanguageSelector && (
                        <div className="p-4 flex flex-row gap-4">
                            <button
                                onClick={() => selectLanguage("en")}
                                className="w-full bg-primary-semidark hover:bg-primary-dark text-white py-2 rounded-lg transition-colors duration-200"
                            >
                                English
                            </button>
                            <button
                                onClick={() => selectLanguage("hi")}
                                className="w-full bg-primary-semidark hover:bg-primary-dark text-white py-2 rounded-lg transition-colors duration-200"
                            >
                                हिंदी
                            </button>
                        </div>
                    )}

                    {/* Messages */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary-light"
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-[80%] ${msg.sender === "bot"
                                    ? "bg-white self-start rounded-br-lg shadow-lg"
                                    : "bg-primary-semidark text-white self-end rounded-bl-lg ml-auto"
                                    }
                                    p-3 rounded-t-lg text-sm`}
                            >
                                {msg.sender === "bot" ? (
                                    <div className="prose prose-sm">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <span>{msg.text}</span>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Symptom Selector */}
                    {showSymptomSelector ? (
                        <div className="p-4 border-t bg-white">
                            <div className="max-h-60 overflow-y-auto mb-4">
                                {Object.entries(getCurrentSymptomCategories()).map(([category, symptoms]) => (
                                    <div key={category} className="mb-4">
                                        <h3 className="font-bold text-text-dark mb-2">{category}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {symptoms.map((symptom) => (
                                                <button
                                                    key={symptom}
                                                    onClick={() => toggleSymptom(symptom)}
                                                    className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${selectedSymptoms.includes(symptom)
                                                        ? "bg-primary-semidark text-white"
                                                        : "bg-primary-light text-text-light hover:bg-primary-light hover:text-text-dark"
                                                        }`}
                                                >
                                                    {symptom}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleSymptomSelection}
                                className="w-full bg-secondary hover:bg-secondary-dark text-white py-2 rounded-lg transition-colors duration-200"
                            >
                                {getCurrentTranslation().confirmSelection}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={getCurrentTranslation().typeMessage}
                                    disabled={analysisComplete}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:border-primary text-text-dark placeholder:text-text-light"
                                />
                                <button
                                    type="submit"
                                    disabled={analysisComplete}
                                    className={`px-4 py-2 shrink-0 rounded-lg transition-colors duration-200 ${analysisComplete
                                        ? "bg-text-light"
                                        : "bg-primary-semidark hover:bg-primary-dark"
                                        } text-white`}
                                >
                                    {getCurrentTranslation().send}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}