// Types
type Message = {
    sender: "user" | "bot";
    text: string;
};

type QueryData = {
    language?: "en" | "hi";
    name?: string;
    age?: string;
    gender?: string;
    condition?: string;
    symptoms?: string;
    duration?: string;
    betterWith?: string;
    worseWith?: string;
    otherSymptoms?: string[];
    area?: string;
};

// Translations
const translations = {
    en: {
        welcomeMessage: "Choose language - English/Hindi",
        doctorIntro: "Hello !! I'm Dr. Cure, your Physiotherapy assistant. Please tell me more about you.",
        nameQuestion: "Please tell me your name?",
        ageQuestion: "Please tell me your age?",
        genderQuestion: "Please tell me your Gender?",
        helpOptions: "How can I help you today?",
        durationQuestion: "How long have you been feeling this way?",
        areaQuestion: "Please, tell me Area of symptoms/Area causing problem.",
        betterQuestion: "What are the things that make you feel better in your problems?",
        worseQuestion: "What are the things that make you symptoms worse?",
        otherSymptomsQuestion: "Any other symptoms like:",
        bookingPrompt: "Please book an appointment with our top doctors and other healthcare professionals and download our app for personal guidance.",
        typeMessage: "Type your message...",
        send: "Send",
        healthAssistant: "Health Assistant",
        resetChat: "Reset Chat",
        close: "Close"
    },
    hi: {
        welcomeMessage: "भाषा चुनें - अंग्रेजी/हिंदी",
        doctorIntro: "नमस्ते !! मैं डॉ. क्योर हूं, आपका फिजियोथेरेपी सहायक। कृपया मुझे अपने बारे में और बताएं।",
        nameQuestion: "कृपया अपना नाम बताएं?",
        ageQuestion: "कृपया अपनी उम्र बताएं?",
        genderQuestion: "कृपया अपना लिंग बताएं?",
        helpOptions: "आज मैं आपकी कैसे मदद कर सकता हूं?",
        durationQuestion: "आप कब से ऐसा महसूस कर रहे हैं?",
        areaQuestion: "कृपया लक्षणों का क्षेत्र/समस्या का क्षेत्र बताएं।",
        betterQuestion: "ऐसी कौन सी चीजें हैं जो आपकी समस्याओं में आपको बेहतर महसूस कराती हैं?",
        worseQuestion: "ऐसी कौन सी चीजें हैं जो आपके लक्षणों को बदतर बनाती हैं?",
        otherSymptomsQuestion: "कोई अन्य लक्षण जैसे:",
        bookingPrompt: "कृपया हमारे शीर्ष डॉक्टरों और अन्य स्वास्थ्य पेशेवरों के साथ एक अपॉइंटमेंट बुक करें और व्यक्तिगत मार्गदर्शन के लिए हमारा ऐप डाउनलोड करें।",
        typeMessage: "अपना संदेश टाइप करें...",
        send: "भेजें",
        healthAssistant: "स्वास्थ्य सहायक",
        resetChat: "चैट रीसेट करें",
        close: "बंद करें"
    }
};

// Help options
const helpOptions = {
    en: [
        "Know about your condition",
        "Post-Surgery Rehabilitation",
        "General Advice"
    ],
    hi: [
        "अपनी स्थिति के बारे में जानें",
        "सर्जरी के बाद पुनर्वास",
        "सामान्य सलाह"
    ]
};

// Symptom categories
const symptomCategories = {
    en: {
        "Musculoskeletal": [
            "Joint Pain",
            "Muscle Pain",
            "Back Pain",
            "Neck Pain",
            "Stiffness"
        ],
        "Neurological": [
            "Numbness",
            "Tingling",
            "Weakness",
            "Balance Issues",
            "Headaches"
        ],
        "Cardio respiratory": [
            "Shortness of Breath",
            "Chest Pain",
            "Coughing",
            "Fatigue",
            "Palpitations"
        ],
        "Dermatology": [
            "Skin Rash",
            "Itching",
            "Swelling",
            "Redness",
            "Bruising"
        ]
    },
    hi: {
        "मस्कुलोस्केलेटल": [
            "जोड़ों का दर्द",
            "मांसपेशियों का दर्द",
            "पीठ दर्द",
            "गर्दन का दर्द",
            "अकड़न"
        ],
        "न्यूरोलॉजिकल": [
            "सुन्नपन",
            "झुनझुनी",
            "कमजोरी",
            "संतुलन की समस्याएं",
            "सिरदर्द"
        ],
        "कार्डियो रेस्पिरेटरी": [
            "सांस की तकलीफ",
            "छाती में दर्द",
            "खांसी",
            "थकान",
            "धड़कन"
        ],
        "डर्मेटोलॉजी": [
            "त्वचा पर चकत्ते",
            "खुजली",
            "सूजन",
            "लाली",
            "चोट का निशान"
        ]
    }
};


const postOpConditions = {
    en: {
        "Orthopaedic conditions": [
            "Total Hip replacement",
            "Total Knee Replacement",
            "Rotator cuff repair",
            "Ligament surgery",
            "Spinal Surgery",
            "Fracture recovery"
        ],
        "Neurological Conditions": [
            "Stroke Rehabilitation",
            "Traumatic brain injury",
            "Spinal cord injury",
            "Neuromuscular disorders",
            "Balance issues",
            "Spasticity",
            "Paralysis"
        ],
        "Cardio Pulmonary conditions": [
            "Post-cardiac surgery",
            "Pulmonary rehabilitation",
            "Difficulty in breathing",
            "Decrease cardiac endurance",
            "Chest wall mobility",
            "Asthma"
        ],
        "Sports injury": [
            "Ligament injury",
            "Muscle Strain",
            "Overuse injury",
            "Plantar fasciitis",
            "Stress fracture"
        ],
        "Pediatric conditions": [
            "Cerebral palsy",
            "Spina Bifida",
            "Club foot correction",
            "Scoliosis",
            "Balance strength training",
            "Coordination issue"
        ],
        "Geriatric Conditions": [
            "Osteoporosis",
            "Posture correction",
            "Balance problem",
            "Gait training",
            "Strength building"
        ],
        "Amputation": [
            "Prosthetic training",
            "Phantom limb pain"
        ],
        "Work-related problems": [
            "Strain injury",
            "Carpal Tunnel syndrome",
            "Tendonitis",
            "Posture correction"
        ]
    },
    hi: {
        "ऑर्थोपेडिक स्थितियां": [
            "कूल्हे का पूर्ण प्रतिस्थापन",
            "घुटने का पूर्ण प्रतिस्थापन",
            "रोटेटर कफ मरम्मत",
            "लिगामेंट सर्जरी",
            "रीढ़ की हड्डी की सर्जरी",
            "फ्रैक्चर रिकवरी"
        ],
        "न्यूरोलॉजिकल स्थितियां": [
            "स्ट्रोक पुनर्वास",
            "ट्रॉमेटिक ब्रेन इंजरी",
            "स्पाइनल कॉर्ड इंजरी",
            "न्यूरोमस्कुलर विकार",
            "संतुलन की समस्याएं",
            "स्पास्टिसिटी",
            "पक्षाघात"
        ],
        "कार्डियो पल्मोनरी स्थितियां": [
            "पोस्ट-कार्डियक सर्जरी",
            "पल्मोनरी पुनर्वास",
            "सांस लेने में कठिनाई",
            "कार्डियक एंड्योरेंस में कमी",
            "छाती की दीवार की गतिशीलता",
            "अस्थमा"
        ],
        "खेल चोट": [
            "लिगामेंट चोट",
            "मांसपेशी खिंचाव",
            "अत्यधिक उपयोग चोट",
            "प्लांटर फासिइटिस",
            "स्ट्रेस फ्रैक्चर"
        ],
        "बाल रोग स्थितियां": [
            "सेरेब्रल पाल्सी",
            "स्पाइना बिफिडा",
            "क्लब फुट सुधार",
            "स्कोलियोसिस",
            "संतुलन शक्ति प्रशिक्षण",
            "समन्वय समस्या"
        ],
        "वृद्धावस्था स्थितियां": [
            "ऑस्टियोपोरोसिस",
            "मुद्रा सुधार",
            "संतुलन समस्या",
            "चाल प्रशिक्षण",
            "शक्ति निर्माण"
        ],
        "अंग-छेदन": [
            "कृत्रिम अंग प्रशिक्षण",
            "फैंटम लिम्ब पेन"
        ],
        "काम से संबंधित समस्याएं": [
            "तनाव चोट",
            "कार्पल टनल सिंड्रोम",
            "टेंडोनाइटिस",
            "मुद्रा सुधार"
        ]
    }
};

// Also let's add the general advice options that were mentioned in the dialog flow
const generalAdviceOptions = {
    en: [
        "Weight Control/obesity",
        "Better Sedentary lifestyle",
        "Ergonomics advice"
    ],
    hi: [
        "वजन नियंत्रण/मोटापा",
        "बेहतर बैठे रहने की जीवन शैली",
        "एर्गोनॉमिक्स सलाह"
    ]
};

export {
    type Message,
    type QueryData,
    translations,
    helpOptions,
    symptomCategories,
    postOpConditions,
    generalAdviceOptions
};