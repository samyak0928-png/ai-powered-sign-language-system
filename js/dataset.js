/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * Gesture Dataset & Telemetry Signatures (Simulated Demo Vocabulary)
 * 
 * IMPORTANT: Telemetry and confidence values are simulated for prototype demonstration.
 */

export const GESTURE_DATASET = [
  {
    id: 'hello',
    label: 'Hello',
    category: 'Greeting',
    description: 'Open palm facing forward, slight wave motion.',
    simulatedFlex: { thumb: 15, index: 12, middle: 14, ring: 16, little: 18 },
    simulatedImu: { accelX: 0.15, accelY: 1.85, accelZ: 9.75, pitch: 12.4, roll: -5.2, yaw: 45.0 },
    recognizedSign: 'HELLO',
    nlpSentence: 'Hello, good to see you.',
    confidenceTier: 'High Confidence',
    confidenceScore: 95,
    sampleScenario: 'Everyday Greeting'
  },
  {
    id: 'yes',
    label: 'Yes',
    category: 'Response',
    description: 'Closed fist with repetitive nodding motion at wrist.',
    simulatedFlex: { thumb: 85, index: 88, middle: 90, ring: 86, little: 82 },
    simulatedImu: { accelX: 0.05, accelY: 3.20, accelZ: 9.10, pitch: 35.8, roll: 2.1, yaw: 10.5 },
    recognizedSign: 'YES',
    nlpSentence: 'Yes, that is correct.',
    confidenceTier: 'High Confidence',
    confidenceScore: 93,
    sampleScenario: 'Confirmation'
  },
  {
    id: 'no',
    label: 'No',
    category: 'Response',
    description: 'Index and middle fingers snap shut against the thumb.',
    simulatedFlex: { thumb: 70, index: 78, middle: 75, ring: 20, little: 18 },
    simulatedImu: { accelX: -0.42, accelY: 0.88, accelZ: 9.65, pitch: -8.5, roll: 14.2, yaw: -18.0 },
    recognizedSign: 'NO',
    nlpSentence: 'No, I disagree.',
    confidenceTier: 'High Confidence',
    confidenceScore: 91,
    sampleScenario: 'Decline'
  },
  {
    id: 'help',
    label: 'Help',
    category: 'Emergency / Urgent',
    description: 'Closed fist resting atop flat open palm, moving upward together.',
    simulatedFlex: { thumb: 55, index: 68, middle: 64, ring: 58, little: 52 },
    simulatedImu: { accelX: 0.08, accelY: 4.10, accelZ: 9.40, pitch: 42.0, roll: -1.5, yaw: 5.0 },
    recognizedSign: 'HELP',
    nlpSentence: 'I need help, please assist me.',
    confidenceTier: 'High Confidence',
    confidenceScore: 96,
    sampleScenario: 'Emergency Assistance'
  },
  {
    id: 'water',
    label: 'Water',
    category: 'Basic Need',
    description: 'W-handshape (index, middle, ring extended) tapping near chin.',
    simulatedFlex: { thumb: 75, index: 15, middle: 12, ring: 18, little: 82 },
    simulatedImu: { accelX: 0.22, accelY: 1.15, accelZ: 9.80, pitch: 18.2, roll: -12.4, yaw: 30.2 },
    recognizedSign: 'WATER',
    nlpSentence: 'I would like some water.',
    confidenceTier: 'High Confidence',
    confidenceScore: 92,
    sampleScenario: 'Healthcare / Hospitality'
  },
  {
    id: 'food',
    label: 'Food',
    category: 'Basic Need',
    description: 'Fingertips pinched together touching lips repeatedly.',
    simulatedFlex: { thumb: 68, index: 72, middle: 70, ring: 74, little: 76 },
    simulatedImu: { accelX: 0.12, accelY: 2.30, accelZ: 9.60, pitch: 24.5, roll: 8.0, yaw: 15.0 },
    recognizedSign: 'FOOD',
    nlpSentence: 'I need food or something to eat.',
    confidenceTier: 'High Confidence',
    confidenceScore: 89,
    sampleScenario: 'Everyday Care'
  },
  {
    id: 'thank_you',
    label: 'Thank You',
    category: 'Politeness',
    description: 'Flat hand starting at chin and extending outward toward person.',
    simulatedFlex: { thumb: 20, index: 15, middle: 16, ring: 18, little: 20 },
    simulatedImu: { accelX: 0.45, accelY: 3.80, accelZ: 9.20, pitch: 28.0, roll: -3.0, yaw: 2.0 },
    recognizedSign: 'THANK YOU',
    nlpSentence: 'Thank you very much.',
    confidenceTier: 'High Confidence',
    confidenceScore: 94,
    sampleScenario: 'Social Interaction'
  },
  {
    id: 'please',
    label: 'Please',
    category: 'Politeness',
    description: 'Flat hand circling over the chest area.',
    simulatedFlex: { thumb: 22, index: 18, middle: 16, ring: 20, little: 22 },
    simulatedImu: { accelX: 1.10, accelY: 1.05, accelZ: 9.70, pitch: 10.0, roll: 25.0, yaw: 60.0 },
    recognizedSign: 'PLEASE',
    nlpSentence: 'Please, if you could.',
    confidenceTier: 'High Confidence',
    confidenceScore: 90,
    sampleScenario: 'Polite Request'
  },
  {
    id: 'i',
    label: 'I / Me',
    category: 'Pronoun',
    description: 'Index finger pointing toward signer chest.',
    simulatedFlex: { thumb: 80, index: 25, middle: 85, ring: 88, little: 84 },
    simulatedImu: { accelX: -0.15, accelY: 0.65, accelZ: 9.85, pitch: -15.0, roll: 5.5, yaw: -10.0 },
    recognizedSign: 'I',
    nlpSentence: 'I am communicating.',
    confidenceTier: 'High Confidence',
    confidenceScore: 97,
    sampleScenario: 'Sentence Subject'
  },
  {
    id: 'you',
    label: 'You',
    category: 'Pronoun',
    description: 'Index finger pointing straight outward at the listener.',
    simulatedFlex: { thumb: 78, index: 12, middle: 86, ring: 88, little: 82 },
    simulatedImu: { accelX: 0.35, accelY: 0.45, accelZ: 9.90, pitch: 5.0, roll: -2.0, yaw: 0.0 },
    recognizedSign: 'YOU',
    nlpSentence: 'You / referring to you.',
    confidenceTier: 'High Confidence',
    confidenceScore: 95,
    sampleScenario: 'Sentence Object'
  },
  {
    id: 'need',
    label: 'Need',
    category: 'Verb',
    description: 'Bent index finger (X-handshape) moving downward firmly.',
    simulatedFlex: { thumb: 60, index: 55, middle: 82, ring: 85, little: 80 },
    simulatedImu: { accelX: 0.10, accelY: -2.80, accelZ: 9.35, pitch: -22.0, roll: 6.0, yaw: 8.0 },
    recognizedSign: 'NEED',
    nlpSentence: 'I have an urgent requirement.',
    confidenceTier: 'High Confidence',
    confidenceScore: 91,
    sampleScenario: 'Expressing Necessity'
  },
  {
    id: 'want',
    label: 'Want',
    category: 'Verb',
    description: 'Open claw hands pulling inward toward the body.',
    simulatedFlex: { thumb: 45, index: 50, middle: 52, ring: 48, little: 46 },
    simulatedImu: { accelX: -0.85, accelY: 1.90, accelZ: 9.55, pitch: 16.5, roll: -15.0, yaw: -25.0 },
    recognizedSign: 'WANT',
    nlpSentence: 'I would like to have this.',
    confidenceTier: 'High Confidence',
    confidenceScore: 93,
    sampleScenario: 'Expressing Desire'
  },
  {
    id: 'doctor',
    label: 'Doctor',
    category: 'Professional',
    description: 'M-hand or bent fingers tapping the pulse area of opposite wrist.',
    simulatedFlex: { thumb: 50, index: 48, middle: 46, ring: 70, little: 75 },
    simulatedImu: { accelX: 0.18, accelY: 0.95, accelZ: 9.75, pitch: -5.0, roll: 32.0, yaw: 40.0 },
    recognizedSign: 'DOCTOR',
    nlpSentence: 'I need to see a medical doctor.',
    confidenceTier: 'High Confidence',
    confidenceScore: 88,
    sampleScenario: 'Hospital / Clinic'
  },
  {
    id: 'stop',
    label: 'Stop',
    category: 'Directive',
    description: 'Open flat hand slicing down vertically onto flat open palm.',
    simulatedFlex: { thumb: 25, index: 18, middle: 16, ring: 20, little: 22 },
    simulatedImu: { accelX: 0.05, accelY: -4.50, accelZ: 8.80, pitch: -38.0, roll: 0.0, yaw: 0.0 },
    recognizedSign: 'STOP',
    nlpSentence: 'Please stop immediately.',
    confidenceTier: 'High Confidence',
    confidenceScore: 96,
    sampleScenario: 'Urgent Safety'
  }
];

export const SENTENCE_PRESETS = [
  {
    name: 'Medical Emergency',
    signs: ['I', 'NEED', 'DOCTOR'],
    synthesizedSentence: 'I need a doctor immediately.',
    context: 'Hospital / Triage'
  },
  {
    name: 'Hydration Request',
    signs: ['I', 'WANT', 'WATER'],
    synthesizedSentence: 'I want water, please.',
    context: 'Everyday Care'
  },
  {
    name: 'Urgent Assistance',
    signs: ['PLEASE', 'HELP', 'I'],
    synthesizedSentence: 'Please help me, I need assistance.',
    context: 'Public Space'
  },
  {
    name: 'Gratitude & Closure',
    signs: ['THANK YOU', 'YOU', 'HELP'],
    synthesizedSentence: 'Thank you for your help.',
    context: 'Customer Service'
  },
  {
    name: 'Emergency Stop',
    signs: ['STOP', 'PLEASE', 'HELP'],
    synthesizedSentence: 'Please stop, I need help.',
    context: 'Urgent Directive'
  }
];

export const LOW_CONFIDENCE_DEMO = {
  id: 'uncertain_gesture',
  label: 'Simulate Ambiguous Gesture',
  description: 'Simulates a noisy, partial, or rapid motion that falls below the confidence threshold.',
  simulatedFlex: { thumb: 42, index: 51, middle: 39, ring: 44, little: 40 },
  simulatedImu: { accelX: 2.8, accelY: -3.2, accelZ: 7.1, pitch: 18.0, roll: 45.0, yaw: 72.0 },
  recognizedSign: 'UNCERTAIN',
  nlpSentence: null,
  confidenceTier: 'Low Confidence (Threshold Unmet)',
  confidenceScore: 48,
  systemPrompt: 'Gesture ambiguous — please repeat the sign.',
  safeAction: 'Hold output to prevent miscommunication'
};
