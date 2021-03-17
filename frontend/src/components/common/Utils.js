

export const getDateFromString = (s) => {
    return new Date(s.slice(0, 4), s.slice(5, 7) - 1, s.slice(8, 10), s.slice(11, 13), s.slice(14, 16))
}