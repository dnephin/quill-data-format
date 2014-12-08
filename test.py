#!/usr/bin/env python
import json
import sys

import jsonschema

schema_file = "schemas/quill.json"


def load(filename):
    with open(filename, 'r') as fh:
        return json.load(fh)

tests = {
    'statement': [
        'statement-simple.json',
    ],
    'feedback': [
        'feedback-simple.json',
    ]
}


def run():
    schema = load(schema_file)
    resolver = jsonschema.RefResolver.from_schema(schema)

    for model_name, examples in tests.iteritems():
        for example in examples:
            model = schema['definitions'][model_name]
            doc = load('examples/%s' % example)
            jsonschema.validate(doc, model, resolver=resolver)

    print "ok"


if __name__ == "__main__":
    run()
