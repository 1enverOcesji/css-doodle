import test from 'ava';

import parseSvg from '../src/parser/parse-svg.js';
import compare from './_compare.js';
compare.use(parseSvg);

test('edge cases', t => {

  compare(t, '', {
    type: 'block',
    name: 'svg',
    value: []
  });

  compare(t, 'any', {
    type: 'block',
    name: 'svg',
    value: []
  });

  compare(t, 'any:;', {
    type: 'block',
    name: 'svg',
    value: [{
      name: 'any',
      type: 'statement',
      value: ''
    }]
  });

  compare(t, 'circle {}', {
    type: 'block',
    name: 'svg',
    value: [{
      name: 'circle',
      type: 'block',
      value: []
    }]
  });

  compare(t, 'circle { name: } ', {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: 'circle',
      value: [{
        type: 'statement',
        name: 'name',
        value: ''
      }]
    }]
  });

  compare(t, '{}', {
    type: 'block',
    name: 'svg',
    value: []
  });

  compare(t, '{', {
    type: 'block',
    name: 'svg',
    value: []
  });

  compare(t, '}', {
    type: 'block',
    name: 'svg',
    value: []
  });

  compare(t, '{any}', {
    type: 'block',
    name: 'svg',
    value: []
  });

  compare(t, 'text { {} }', {
    type: 'block',
    name: 'svg',
    value: [{
      value: [],
      name: 'text',
      type: 'block'
    }]
  });

});

test('statement', t => {

  compare(t, 'viewBox: 0 0 0 10', {
    name: 'svg',
    type: 'block',
    value: [{
      type: 'statement',
      name: 'viewBox',
      value: '0 0 0 10',
      detail: {
        value: [0, 0, 0, 10]
      }
    }]
  });

  compare(t, 'viewBox: 0 0 10 10 padding .2', {
    name: 'svg',
    type: 'block',
    value: [{
      type: 'statement',
      name: 'viewBox',
      value: '0 0 10 10 padding .2',
      detail: {
        value: [0, 0, 10, 10],
        padding: .2
      }
    }]
  });

  compare(t, 'circle { cx: 5; cy: 5 }', {
    name: 'svg',
    type: 'block',
    value: [{
      type: 'block',
      name: 'circle',
      value: [
        { type: 'statement', name: 'cx', value: '5' },
        { type: 'statement', name: 'cy', value: '5' },
      ]
    }]
  });

});

test('group property', t => {
  compare(t, 'cx, cy: 5', {
    name: 'svg',
    type: 'block',
    value: [
      { type: 'statement', origin: { name: ['cx', 'cy'], value: '5' }, name: 'cx', value: '5'},
      { type: 'statement', origin: { name: ['cx', 'cy'], value: '5' }, name: 'cy', value: '5'},
    ]
  });

  compare(t, 'cx, cy: 5 6', {
    name: 'svg',
    type: 'block',
    value: [
      { type: 'statement', origin: { name: ['cx', 'cy'], value: '5 6' }, name: 'cx', value: '5'},
      { type: 'statement', origin: { name: ['cx', 'cy'], value: '5 6' }, name: 'cy', value: '6'},
    ]
  });
});

test('semicolon separated values', t => {
  compare(t, 'values: 60; 100; 180', {
    name: 'svg',
    type: 'block',
    value: [
      { type: 'statement', name: 'values', value: '60;100;180' }
    ]
  });

  compare(t, 'values: 20 50; 100; 110; cy: 10', {
    name: 'svg',
    type: 'block',
    value: [
      { type: 'statement', name: 'values', value: '20 50;100;110' },
      { type: 'statement', name: 'cy', value: '10' }
    ]
  });
});

test('colon separated properties', t => {
  compare(t, 'xlink:href: url(#app)', {
    name: 'svg',
    type: 'block',
    value: [
      { type: 'statement', name: 'xlink:href', value: 'url(#app)' }
    ]
  });

  compare(t, 'xlink:title: hello:world', {
    name: 'svg',
    type: 'block',
    value: [
      { type: 'statement', name: 'xlink:title', value: 'hello:world' }
    ]
  });
});

test('block names', t => {
  compare(t, 'g circle { } ', {
    name: 'svg',
    type: 'block',
    value: [{
      type: 'block',
      name: 'g',
      value: [{
        type: 'block',
        name: 'circle',
        value: []
      }]
    }]
  });

  compare(t, 'g circle { name: value } ', {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: 'g',
      value: [{
        type: 'block',
        name: 'circle',
        value: [{
          type: 'statement',
          name: 'name',
          value: 'value'
        }]
      }]
    }]
  });

  compare(t, `
    circle {}
    circle {}
  `, {
    type: 'block',
    name: 'svg',
    value: [
      {
        type: 'block',
        name: 'circle',
        value: []
      },
      {
        type: 'block',
        name: 'circle',
        value: []
      }
    ]
  });
});

test('id expand', t => {
  compare(t, 'g circle#id { } ', {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: 'g',
      value: [{
        type: 'block',
        name: 'circle',
        value: [{
          type: 'statement',
          name: 'id',
          value: 'id'
        }]
      }]
    }]
  });

  compare(t, 'g#id circle {} ', {
    name: 'svg',
    type: 'block',
    value: [{
      type: 'block',
      name: 'g',
      value: [
        {
          type: 'block',
          name: 'circle',
          value: []
        },
        {
          type: 'statement',
          name: 'id',
          value: 'id'
        },
      ]
    }]
  });
});

test('empty id expand', t => {
  compare(t, '#abc {}', {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: '#abc',
      value: []
    }]
  });
});

test('ignore tail semicolons', t => {
  compare(t, 'path {};', {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: 'path',
      value: []
    }]
  });
});

test('statement end on quotes', t => {
  compare(t, `
    text { content: '' }
    g {}
  `, {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: 'text',
      value: [{
        name: 'content',
        type: 'statement',
        value: '\'\''
      }]
    }, {
      name: 'g',
      type: 'block',
      value: []
    }]
  });
});

test('content values', t => {
  compare(t, `
    text { content: "world;}" }
  `, {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: 'text',
      value: [{
        name: 'content',
        type: 'statement',
        value: '"world;}"'
      }]
    }]
  });

  compare(t, `
    text { content: "}"; }
  `, {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: 'text',
      value: [{
        name: 'content',
        type: 'statement',
        value: '"}"'
      }]
    }]
  });
});

test('times syntax', t => {
  compare(t, `
    circle*10 {}
  `, {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: 'circle*10',
      pureName: 'circle',
      times: '10',
      value: []
    }]
  });

  compare(t, `
    circle * 5 {}
  `, {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: 'circle*5',
      pureName: 'circle',
      times: '5',
      value: []
    }]
  });
});

test('complex values with parens', t => {
  compare(t, `
    p {
      d: @plot(r: 1; unit: none);
    }
  `, {
    type: 'block',
    name: 'svg',
    value: [{
      type: 'block',
      name: 'p',
      value: [{
        type: 'statement',
        name: 'd',
        value: '@plot(r:1;unit:none)'
      }]
    }]
  });
});

test('svg variable', t => {
  compare(t, '--a: 1', {
    name: 'svg',
    type: 'block',
    value: [{
      type: 'statement',
      name: '--a',
      value: '1',
      variable: true
    }]
  });

  compare(t, '--a: 1; svg {}', {
    name: 'svg',
    type: 'block',
    value: [{
      type: 'statement',
      name: '--a',
      value: '1',
      variable: true
    }]
  });
});
