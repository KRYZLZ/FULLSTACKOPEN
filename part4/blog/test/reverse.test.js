// const { test } = require('node:test')
// const assert = require('node:assert')

const reverse = require('../utils/for_testing').reverse

describe.skip('reverse', () => {
    test('of a', () => {
        const result = reverse('a')

        expect(result).toBe('a')
    })

    test('of react', () => {
        const result = reverse('react')

        expect(result).toBe('tcaer')
    })

    test('of saippuakauppias', () => {
        const result = reverse('saippuakauppias')

        expect(result).toBe('saippuakauppias')
    })

    test('of empty string', () => {
        const result = reverse('')

        expect(result).toBe('')
    })

    test('undefined', () => {
        const result = reverse()

        expect(result).toBeUndefined()
    })
})