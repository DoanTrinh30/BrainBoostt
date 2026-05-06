import axios from 'axios';
import dotenv from 'dotenv';

interface AIFlashCardItem {
    front_text: string;
    back_text: string;
}

interface AIFlashCardResponse {
    [key: string]: AIFlashCardItem;
}

interface QuestionAnswerPair {
    question: string;
    answer: string;
}

interface DistractorsResult {
    question: string;
    answer: string;
    distractors: string[];
}

dotenv.config();

export class AIRepository {
    handleRequest = async (quantity: number, level: string, topic: string): Promise<any> => {
        const payload = {
            model: process.env.AI_MODEL,
            prompt: `Generate ${quantity} flashcards for the topic "${topic}" at the "${level}" level.
                        Provide the response as a single JSON array. Each element in the array should be a JSON object containing two keys: "front_text" (for the question or term) and "back_text" (for the answer or definition).

                        Example of one flashcard object: {"front_text": "Term/Question", "back_text": "Definition/Answer"}`,
            stream: false,
            format: 'json',
            temperature: 1,
        };

        try {
            const response = await axios.post(`${process.env.AI_SERVER_URL}`, payload);
            const parsedResponse = JSON.parse(response.data?.response);
            return parsedResponse;
        } catch (error) {
            console.error('Error in AIRepository.handleRequest:', error);
            throw new Error('Error communicating with AI server');
        }
    };

    postProcessResponse = (inputResponse: any): AIFlashCardItem[] => {
        if (!inputResponse) throw new Error('Empty response from AI server');

        if (Array.isArray(inputResponse)) {
            return inputResponse
                .filter(
                    (item) =>
                        item &&
                        typeof item === 'object' &&
                        'front_text' in item &&
                        'back_text' in item
                )
                .map((item) => ({
                    front_text: (item as AIFlashCardItem).front_text,
                    back_text: (item as AIFlashCardItem).back_text,
                }));
        }

        if (typeof inputResponse === 'object') {
            return Object.values(inputResponse)
                .filter(
                    (item) =>
                        item &&
                        typeof item === 'object' &&
                        'front_text' in item &&
                        'back_text' in item
                )
                .map((item) => ({
                    front_text: (item as AIFlashCardItem).front_text,
                    back_text: (item as AIFlashCardItem).back_text,
                }));
        }

        throw new Error('Unsupported response format from AI server');
    };

    handleGenerateDistractors = async (question: string, answer: string): Promise<any> => {
        const payload = {
            model: process.env.AI_MODEL,
            prompt: `Generate 3 definitely incorrect and plausible options for the question "${question}" where "${answer}" is the ONLY correct answer.
                     These options should be wrong but believable enough to serve as distractors in a multiple-choice question.
                     IMPORTANT: Ensure ALL options are factually INCORRECT and cannot be considered valid answers to the question.
                     Provide the response as a single JSON array of strings. 
                     Example format: ["Incorrect Option 1", "Incorrect Option 2", "Incorrect Option 3"]`,
            stream: false,
            format: 'json',
            temperature: 1,
        };

        try {
            const response = await axios.post(`${process.env.AI_SERVER_URL}`, payload);
            const parsedResponse = JSON.parse(response.data?.response);
            return parsedResponse;
        } catch (error) {
            console.error('Error in AIRepository.handleGenerateDistractors:', error);
            throw new Error('Error communicating with AI server');
        }
    };

    handleBatchGenerateDistractors = async (
        questionAnswerPairs: QuestionAnswerPair[]
    ): Promise<DistractorsResult[]> => {
        if (!questionAnswerPairs || questionAnswerPairs.length === 0) {
            return [];
        }

        const questionsJson = JSON.stringify(questionAnswerPairs);

        const payload = {
            model: process.env.AI_MODEL,
            prompt: `Generate 3 definitely incorrect and plausible options for each of the following question-answer pairs:
                     ${questionsJson}
                     
                     For each question, the provided answer is the ONLY correct answer.
                     The distractors should be wrong but believable enough to serve as options in multiple-choice questions.
                     IMPORTANT: Ensure ALL distractors are factually INCORRECT and cannot be considered valid answers to their respective questions.
                     
                     Provide the response as a JSON array where each item contains:
                     1. The original question
                     2. The correct answer
                     3. An array of 3 distractors (incorrect options)
                     
                     Example format:
                     response: [
                       {
                         "question": "Original question 1",
                         "answer": "Correct answer 1",
                         "distractors": ["Incorrect Option 1", "Incorrect Option 2", "Incorrect Option 3"]
                       },
                       {
                         "question": "Original question 2",
                         "answer": "Correct answer 2",
                         "distractors": ["Incorrect Option 1", "Incorrect Option 2", "Incorrect Option 3"]
                       }
                     ]`,
            stream: false,
            format: 'json',
            temperature: 1,
        };

        try {
            const response = await axios.post(`${process.env.AI_SERVER_URL}`, payload);
            return JSON.parse(response.data?.response || null);
        } catch (error) {
            console.error('Error in AIRepository.handleBatchGenerateDistractors:', error);
            throw new Error('Error communicating with AI server');
        }
    };
}
