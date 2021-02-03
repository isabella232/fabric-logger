import { convertBuffers, isLikelyText } from '../src/convert';

describe('convertBuffers', () => {
    it('should return an object without buffers as-is', () => {
        expect(
            convertBuffers({
                foo: 'bar',
                some: 'thing',
                anumber: 3,
                so: true,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "anumber": 3,
              "foo": "bar",
              "so": true,
              "some": "thing",
            }
        `);
    });

    it('should modify an object property containing a buffer', () => {
        expect(
            convertBuffers({
                some: Buffer.from('foobar'),
            })
        ).toMatchInlineSnapshot(`
            Object {
              "some_string": "foobar",
            }
        `);
    });

    it('should convert an array of buffers to inline objects with the hex values', () => {
        expect(
            convertBuffers({
                args: [Buffer.from('foobar'), Buffer.from('hello'), Buffer.from('world')],
            })
        ).toMatchInlineSnapshot(`
            Object {
              "args": Array [
                Object {
                  "string": "foobar",
                },
                Object {
                  "string": "hello",
                },
                Object {
                  "string": "world",
                },
              ],
            }
        `);
    });

    it('should convert Longs to strings', () => {
        expect(convertBuffers({ low: 4, high: 0, unsigned: false })).toMatchInlineSnapshot(`"4"`);
        expect(convertBuffers({ low: 4, high: 32, unsigned: false })).toMatchInlineSnapshot(`"137438953476"`);
    });
});

describe('isLikelyText', () => {
    it('returns true for simple text buffers', () => {
        expect(isLikelyText(Buffer.from('foobar'))).toBe(true);
        expect(isLikelyText(Buffer.from('hello world'))).toBe(true);
        expect(isLikelyText(Buffer.from(''))).toBe(true);
    });

    it('returns appropriate result for a sample chain code input', () => {
        const buf = (hex: string) => Buffer.from(hex, 'hex');
        expect(isLikelyText(buf('6465706c6f79'))).toBe(true);
        expect(isLikelyText(buf('636f6d6d6f6e'))).toBe(true);
        expect(isLikelyText(buf('0a1e08011216120f686967682d7468726f7567687075741a03312e301a020a00'))).toBe(false);
        expect(
            isLikelyText(
                buf(
                    '1210120e08011202080012020801120208021a0c120a0a084b617267614d53501a11120f0a0d4e65766572677265656e4d53501a0f120d0a0b41746c616e7469734d5350'
                )
            )
        ).toBe(false);
        expect(isLikelyText(buf('65736363'))).toBe(true);
        expect(isLikelyText(buf('76736363'))).toBe(true);
    });
});
