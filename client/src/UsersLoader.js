const testData = [
    {
        id: 1,
        name: 'Павел',
        lastName: 'Дуров',
        link: 'vk.com/durov',
        photoPath: 'https://pp.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1',
        occupation: 'Telegram',
    },
    {
        id: 5,
        name: 'Илья',
        lastName: 'Перекопский',
        link: 'vk.com/ilya',
        photoPath: 'https://pp.userapi.com/c846523/v846523309/b0887/YdeEa0YreoY.jpg?ava=1',
        occupation: 'ООО "В Контакте"',
    },
    {
        id: 6,
        name: 'Николай',
        lastName: 'Дуров',
        link: 'vk.com/abacabadabacabaeabacabadabacaba',
        photoPath: 'https://pp.userapi.com/c320116/v320116006/1ac0/x12kL0OPKSo.jpg?ava=1',
        occupation: 'СПбГУ',
    },
    {
        id: 9,
        name: 'Настя',
        lastName: 'Васильева',
        link: 'vk.com/zhavoronok_mutant',
        photoPath: 'https://pp.userapi.com/c834404/v834404827/105f2c/78hK6EF5t_Y.jpg?ava=1',
        occupation: 'Институт Физики Атмосферы РАН',
    },
    {
        id: 10,
        name: 'Александр',
        lastName: 'Кузнецов',
        link: 'vk.com/kuzya',
        photoPath: 'https://pp.userapi.com/c847120/v847120776/3c5bc/aMn2hVTfz60.jpg?ava=1',
        occupation: 'Replika',
    },
    {
        id: 14,
        name: 'Андрей',
        lastName: 'Городецкий',
        link: 'vk.com/thz',
        photoPath: 'https://pp.userapi.com/c629421/v629421014/3da78/_rXRKowK7t0.jpg?ava=1',
        occupation: 'Imperial College London',
    },
    {
        id: 15,
        name: 'Сергей',
        lastName: 'Васильков',
        link: 'vk.com/vasilkov',
        photoPath: 'https://pp.userapi.com/c639626/v639626447/59ca3/oJskzXGqU4o.jpg?ava=1',
        occupation: 'СПбГУ',
    },
    {
        id: 16,
        name: 'Виктория',
        lastName: 'Беспалова',
        link: 'vk.com/bobrombre',
        photoPath: 'https://pp.userapi.com/c629304/v629304016/25788/lz2HeB_nps8.jpg?ava=1',
        occupation: 'СПбГЭТУ (ЛЭТИ)',
    },
    {
        id: 17,
        name: 'Александр',
        lastName: 'Беспалов',
        link: 'vk.com/magisterbes',
        photoPath: 'https://pp.userapi.com/c836736/v836736674/6998a/H_QUMqkHzEU.jpg?ava=1',
        occupation: 'СПбГЭТУ (ЛЭТИ)',
    },
    {
        id: 21,
        name: 'Михаил',
        lastName: 'Равдоникас',
        link: 'vk.com/mr',
        photoPath: 'https://pp.userapi.com/c628230/v628230021/67a3a/2Xgy3TXfadM.jpg?ava=1',
        occupation: 'СПбГУ',
    },
];

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} lastName
 * @property {string} link
 * @property {string} photoPath
 * @property {string} occupation
 */

export default class UsersLoader {
    static load(cb) {
        cb(testData);
    }
}
