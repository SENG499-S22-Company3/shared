/**
 * This file tests Algorithm 2's API directly, validating the interoperability betwen
 * algorithm 2 between company 3 and company 4.
 */

import {
    ALGORITHM2_URL
} from "../config";

import { isSupportedCourseArrayValid, isCourseCapacityPredictionValid } from './utils/algorithm2-utils';
require('isomorphic-fetch'); 

describe("Root path returns expected data", () => {
    it("should return expected list of courses model is trained on", async () => {
        // Given & When
        const response = await fetch(ALGORITHM2_URL, {
            method: "GET"
        });
        
        // Then
        const responseJSON = await response.json();
        
        // Validate that course array has expected information
        isSupportedCourseArrayValid(responseJSON);

        // Validate that course names are expected
        const expectedCourseNames = [
            'CHEM 101', 'CSC 111',  'CSC 115',  'CSC 225',
            'CSC 226',  'CSC 230',  'CSC 320',  'CSC 355',
            'CSC 360',  'CSC 361',  'CSC 370',  'CSC 460',
            'ECE 255',  'ECE 260',  'ECE 310',  'ECE 355',
            'ECE 360',  'ECE 455',  'ECE 458',  'ECON 180',
            'ENGR 001', 'ENGR 002', 'ENGR 003', 'ENGR 004',
            'ENGR 110', 'ENGR 120', 'ENGR 130', 'ENGR 141',
            'MATH 100', 'MATH 101', 'MATH 109', 'MATH 110',
            'MATH 122', 'PHYS 110', 'PHYS 111', 'SENG 265',
            'SENG 275', 'SENG 310', 'SENG 321', 'SENG 350',
            'SENG 360', 'SENG 371', 'SENG 401', 'SENG 426',
            'SENG 440', 'SENG 499', 'STAT 260'
        ];

        // Extract course names & sort
        let actualCourseNames = [];
        for (const course of responseJSON) {
            actualCourseNames.push(course.name);
        }
        actualCourseNames.sort()

        // Ensure course names are expected
        expect(JSON.stringify(expectedCourseNames) == JSON.stringify(actualCourseNames)).toBeTruthy();
    });
});

describe("Predicts class size with expected input", () => {
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