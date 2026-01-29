import type { ThinkFirstQuestion } from '../../types/thinkFirstTypes';

// Linear Search Think First Questions
export const linearSearchQuestions: ThinkFirstQuestion[] = [
    {
        id: 1,
        codeLine: "for (int i = 0; i < arr.length; i++) {",
        question: "Why do we use a for loop in linear search?",
        options: [
            "To sort the array",
            "To visit each element one by one",
            "To skip elements",
            "To reduce array size"
        ],
        correctIndex: 1,
        hint: "Linear search checks elements sequentially."
    },
    {
        id: 2,
        codeLine: "if (arr[i] == target) {",
        question: "Why do we compare arr[i] with target?",
        options: [
            "To change array values",
            "To check if current element matches",
            "To count elements",
            "To sort the array"
        ],
        correctIndex: 1,
        hint: "Search means matching values."
    },
    {
        id: 3,
        codeLine: "return i;",
        question: "Why do we return i when the element is found?",
        options: [
            "To return the value",
            "To return the index position",
            "To continue searching",
            "To restart the loop"
        ],
        correctIndex: 1,
        hint: "Index shows where the element exists."
    },
    {
        id: 4,
        codeLine: "return -1;",
        question: "Why do we return -1 at the end?",
        options: [
            "Element always exists at -1",
            "To indicate element not found",
            "To stop the loop",
            "To sort the array"
        ],
        correctIndex: 1,
        hint: "Think of a value that means not present."
    }
];
