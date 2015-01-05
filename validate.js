#!/usr/bin/env node

var cli = require('cli').enable('version', 'status');
var fs = require('fs');
var util = require('util');
var jsonschema = require('jsonschema');
var schema_file = "schemas/quill.json";
var examples_path = "examples/";


function load(filename) {
    return JSON.parse(fs.readFileSync(filename));
}


function validate(validator, filename, model) {
    var result = validator.validate(load(filename), model);
    if (result.errors.length > 0) {
        console.log(result);
        throw new Error(result);
    }
}


cli.parse({
    model: ['m', 'Model to validate against', 'string', 'topic'],
});


cli.main(function(args, options) {
    var filename = args[0];
    if (filename === undefined) {
        cli.fatal("A filename is required");
    };

    var schema = load(schema_file);
    var validator = new jsonschema.Validator();
    validator.addSchema(schema, '/');

    var model = options.model == 'topic' ? schema: schema.definitions[options.model];
    cli.info("Validating " + filename + " as " + options.model);
    validate(validator, filename, model);
    console.log("ok");
});

