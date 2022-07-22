import { isCourseCapacityPredictionValid } from './utils/algorithm2-utils';

require('isomorphic-fetch'); 
const ALGORITHM2_URL = "https://seng499company4algorithm2.herokuapp.com";

describe("Company 4 - Predicts class size with expected input", () => {
    it("should return an empty list when input is an empty set of courses", async () => {
        // Given
        const actualCourseInput: any = [];

        // When
        const response = await fetch(ALGORITHM2_URL + "/predict_class_size", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(actualCourseInput)
        });

        // Then
        const responseJSON = await response.json();
        expect(responseJSON.length).toEqual(0);
        expect(Array.isArray(responseJSON)).toBeTruthy();
    });

    it("should return valid prediction when input is a normal set of courses, no split", async () => {
        // Given
        const actualCourseInput: any = [
            {"subject":"CSC","code":"225","seng_ratio":0.75,"semester":"SUMMER","capacity":0},
            {"subject":"SENG","code":"275","seng_ratio":0.75,"semester":"SUMMER","capacity":0},
            {"subject":"ECE","code":"250","seng_ratio":0.75,"semester":"SUMMER","capacity":0}
        ];

        // When
        const response = await fetch(ALGORITHM2_URL + "/predict_class_size", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(actualCourseInput)
        });

        // Then
        const responseJSON = await response.json();
        isCourseCapacityPredictionValid(actualCourseInput, responseJSON);     
    });

    it("should return valid prediction when input is an unrecognized course", async () => {
        // Given
        const actualCourseInput: any = [
            {"subject":"ECON","code":"180","seng_ratio":0.75,"semester":"SUMMER","capacity":0}
        ];

        // When
        const response = await fetch(ALGORITHM2_URL + "/predict_class_size", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(actualCourseInput)
        });

        // Then
        const responseJSON = await response.json();
        isCourseCapacityPredictionValid(actualCourseInput, responseJSON);
        
        // Validate that ECON 180 has a capacity set to 0.
        expect(responseJSON.length).toEqual(1);
        expect(responseJSON[0].capacity).toEqual(0);
        expect(responseJSON[0].code).toEqual('180');
        expect(responseJSON[0].semester).toEqual('SUMMER');
        expect(responseJSON[0].seng_ratio).toEqual(0.75);
        expect(responseJSON[0].subject).toEqual('ECON');
    });

    it("should return a valid prediction when input is a mixture of recognized and unrecognized courses", async () => {
        // Given
        const actualCourseInput: any = [
            {"subject":"ECON","code":"180","seng_ratio":0.75,"semester":"SUMMER","capacity":0},
            {"subject":"CSC","code":"111","seng_ratio":0.50,"semester":"FALL","capacity":0},
            {"subject":"CSC","code":"115","seng_ratio":0.75,"semester":"SPRING","capacity":0},
            {"subject":"CSC","code":"116","seng_ratio":0.75,"semester":"FALL","capacity":0},
            {"subject":"CHEM","code":"101","seng_ratio":0.75,"semester":"SPRING","capacity":0},
        ];

        // When
        const response = await fetch(ALGORITHM2_URL + "/predict_class_size", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(actualCourseInput)
        });

        // Then
        const responseJSON = await response.json();
        isCourseCapacityPredictionValid(actualCourseInput, responseJSON);
        
        // Validate that ECON 180 has a capacity set to 0.
        const filterECON180Course = (element: any, index: any, array: any) => {
            return element.code == "180" && element.subject == "ECON";
        };
        const econ180Course = await responseJSON.filter(filterECON180Course)[0];
        expect(econ180Course.capacity).toEqual(0);

        // Validate that CHEM 101 has a capacity set to 0.
        const filterCHEM101Course = (element: any, index: any, array: any) => {
            return element.code == "101" && element.subject == "CHEM";
        };
        const chem101Course = await responseJSON.filter(filterCHEM101Course)[0];
        expect(chem101Course.capacity).toEqual(0);
    });

    it("should return valid prediction when input is a normal set of courses, with CSC 111 resulting in large capacity.", async () => {
        // Given
        const actualCourseInput: any = [
            {"subject":"CSC","code":"111","seng_ratio":0.75,"semester":"SUMMER","capacity":0},
            {"subject":"SENG","code":"275","seng_ratio":0.75,"semester":"SUMMER","capacity":0},
            {"subject":"ECE","code":"250","seng_ratio":0.75,"semester":"SUMMER","capacity":0}
        ];

        // When
        const response = await fetch(ALGORITHM2_URL + "/predict_class_size", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(actualCourseInput)
        });

        // Then
        const responseJSON = await response.json();
        isCourseCapacityPredictionValid(actualCourseInput, responseJSON);
    });

    it("should return valid prediction when input is a set of courses, with the crouse offered in multiple semester", async () => {
        // Given
        const actualCourseInput: any = [
            {"subject":"CSC","code":"111","seng_ratio":0.75,"semester":"FALL","capacity":0},
            {"subject":"CSC","code":"111","seng_ratio":0.75,"semester":"SPRING","capacity":0},
            {"subject":"CSC","code":"111","seng_ratio":0.75,"semester":"SUMMER","capacity":0}
        ];

        // When
        const response = await fetch(ALGORITHM2_URL + "/predict_class_size", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(actualCourseInput)
        });

        // Then
        const responseJSON = await response.json();
        isCourseCapacityPredictionValid(actualCourseInput, responseJSON);        
    });
});