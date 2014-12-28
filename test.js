#!/usr/bin/env node

var fs = require('fs');
var util = require('util');
var jsonschema = require('jsonschema');
var schema_file = "schemas/quill.json";
var examples_path = "examples/";


var tests = {
    'statement': [
        'statement-simple.json',
    ],
    'feedback': [
        'feedback-simple.json',
    ]
};


function load(filename) {
    return JSON.parse(fs.readFileSync(filename));
}


function validate(validator, filename, model) {
    console.log(util.format("Validating %s with %s", model.title, filename));
    var result = validator.validate(load(filename), model);
    if (result.errors.length > 0) {
        console.log(result);
        throw new Error(result);
    }
}


function run() {
    var schema = load(schema_file);
    var validator = new jsonschema.Validator();
    validator.addSchema(schema, '/');

    for (var model in tests) {
        for (var testcase in tests[model]) {
            validate(validator,
                     examples_path + tests[model][testcase],
                     schema.definitions[model]);
        }
    }
    console.log("ok");
}

run()
