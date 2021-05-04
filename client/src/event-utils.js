
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'LFG LoL',
    description: 'We should group up for League of Legends',
    gameTitle: 'League of Legends',
    start: '2021-04-23' + 'T19:30:00',
    end: '2021-04-23' + 'T20:00:00',
    creator: '6086eea4c9a88c5730b006d6'
  },
  {
    id: createEventId(),
    title: 'Destiny 2 Group',
    description: 'Looking for a group for Destiny 2',
    gameTitle: 'Destiny 2',
    start: todayStr + 'T18:00:00',
    end: todayStr + 'T20:00:00',
    creator: '6086eea4c9a88c5730b006d6'
  },
]

export function createEventId() {
  return String(eventGuid++)
}
