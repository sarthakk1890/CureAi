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
        analyzing: "Analyzing...",
        healthAssistant: "Health Assistant",
        resetChat: "Reset Chat",
        close: "Close",
        selectSymptoms: "Select your symptoms:",
        selectCondition: "Select your Post Operation Condition:",
        selectAdvice: "Select the type of advice you need:",
        confirm: "Confirm Selection"
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
        analyzing: "विश्लेषण कर रहे हैं...",
        healthAssistant: "स्वास्थ्य सहायक",
        resetChat: "चैट रीसेट करें",
        close: "बंद करें",
        selectSymptoms: "अपने लक्षण चुनें:",
        selectCondition: "अपनी सर्जरी के बाद की स्थिति चुनें:",
        selectAdvice: "किस प्रकार की सलाह चाहिए चुनें:",
        confirm: "चयन की पुष्टि करें"
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
            "Warmth",
            "Limitation in activity",
            "muscle Cramps",
            "radiating pain",
            "Redness",
            "Swelling",
            "Stiffness"
        ],
        "Neurological": [
            "Numbness",
            "Tingling sensation",
            "Weakness",
            "Paralysis",
            "Fatigue",
            "Dizziness",
            "Limitation in function",
            "Radiating pain",
            "Balance Issues",
            "Headaches"
        ],
        "Cardio respiratory": [
            "Difficulty in Breathing",
            "Chest Pain",
            "Secretions in chest",
            "Swelling in legs",
            "Coughing",
            "Fatigue",
            "Palpitations"
        ],
        "Dermatology": [
            "Skin Rash",
            "Itching",
            "Swelling",
            "Redness",
            "Bruising",
            "Nodules"
        ]
    },
    hi: {
        "मांसपेशियों और जोड़ों से संबंधित": [
            "जोड़ों का दर्द",
            "मांसपेशियों का दर्द",
            "गरमहाट",
            "लालपन",
            "सूजन",
            "अकड़न",
            "फैलता दर्द",
            "मांसपेशियों में ऐंठन",
            "काम करने में रुकावट"
        ],
        "सिर/दिमाग से संबंधित": [
            "सुन्नपन",
            "लकवा",
            "थकान",
            "चक्कर आना",
            "फैलता दर्द",
            "झुनझुनी",
            "कमजोरी",
            "संतुलन की समस्याएं",
            "काम करने में रुकावट",
            "सिरदर्द"
        ],
        "हृदय और सांस से संबंधित": [
            "सांस की तकलीफ",
            "छाती में दर्द",
            "खांसी",
            "बलगम",
            "पैरों में सूजन",
            "थकान",
            "धड़कन"
        ],
        "त्वचा संबंधी": [
            "त्वचा पर चकत्ते",
            "खुजली",
            "सूजन",
            "लाली",
            "गांठ",
            "नील/चोट का निशान"
        ]
    }
};

// Common symptoms data
const commonSymptoms = {
    en: [
        "Morning stiffness",
        "Night pain"
    ],
    hi: [
        "सुबह की अकड़न",
        "रात का दर्द"
    ]
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
        "हड्डी से संबंधित": [
            "कूल्हे की सर्जरी/बदलना",
            "घुटने की सर्जरी/बदलना",
            "कंधे की सर्जरी",
            "लिगामेंट सर्जरी",
            "रीढ़ की हड्डी की सर्जरी",
            "फ्रैक्चर रिकवरी"
        ],
        "सिर/दिमाग से संबंधित": [
            "स्ट्रोक रिहेब",
            "ट्रॉमेटिक ब्रेन इंजरी",
            "स्पाइनल कॉर्ड इंजरी",
            "न्यूरोमस्कुलर विकार",
            "संतुलन की समस्याएं",
            "स्पास्टिसिटी",
            "पक्षाघात"
        ],
        "हृदय और सांस से संबंधित": [
            "पोस्ट-कार्डियक सर्जरी",
            "पल्मोनरी  रिहेब",
            "सांस लेने में कठिनाई",
            "हृदय  सेह्नशक्ति  में कमी",
            "छाती की दीवार की गतिशीलता",
            "अस्थमा"
        ],
        "खेल संबंधित चोट": [
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
            "संतुलन प्रशिक्षण",
            "तालमेल  समस्या"
        ],
        "वृद्धावस्था स्थितियां": [
            "ऑस्टियोपोरोसिस",
            "मुद्रा सुधार",
            "संतुलन समस्या",
            "चाल प्रशिक्षण",
            "ताकात बढाना"
        ],
        "एम्प्यूटेशन": [
            "कृत्रिम अंग अभ्यास",
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
        "बेहतर गातिहिन जीवन शैली",
        "एर्गोनॉमिक्स सलाह"
    ]
};

export {
    type Message,
    type QueryData,
    translations,
    helpOptions,
    symptomCategories,
    commonSymptoms,
    postOpConditions,
    generalAdviceOptions
};
