let users = [{
    id: '1',
    first_name: 'tom',
    email: 't@google.com'
}, {
    id: '2',
    first_name: 'bob',
    last_name: 'bob',
    email: 'bob@bob.com',
    age: '23'
}, {
    id: '3',
    first_name: 'A Name',
    email: 'Someone@gmail.com',
    age: '44'
}];

let posts = [
    {
        id: '1',
        title: 'A cool Book',
        body: 'Vivamus facilisis nisi nibh. Aenean sollicitudin elit sed lacinia cursus. Ut pellentesque, magna eu tempus venenatis, sapien felis fermentum felis, at auctor urna lacus eget tortor. Suspendisse imperdiet malesuada eros sit amet semper. Curabitur et molestie purus. Integer ut nisi vel ex aliquet gravida. Donec et turpis non felis viverra fringilla.',
        published: false,
        author: '1'
    },
    {
        id: '2',
        title: 'asdf',
        body: 'Sed dignissim, diam id fermentum tempus, odio neque feugiat ante, eget elementum neque ex at felis. Vivamus id urna ornare dui elementum euismod ac sed quam. Nam eleifend pellentesque pulvinar. Donec id ipsum et est sollicitudin luctus. Integer placerat rutrum felis, sit amet sodales massa malesuada id. Proin aliquet nunc at pharetra vulputate. Proin elementum auctor risus, eget dictum tellus tempor id. Nullam eleifend, est non dapibus viverra, eros magna sollicitudin velit, id porta mi erat et arcu. Aenean vel risus id nisi vulputate bibendum. Aliquam maximus lectus at justo venenatis gravida. Nam condimentum ex in ex ultrices tempus. Fusce ut aliquet nunc. Duis non consectetur libero.',
        published: true,
        author: '2'
    },
    {
        id: '3',
        title: "JoJo's Bizarre Adventure: Part 1--Phantom Blood, Vol. 1",
        body: `The legendary Shonen Jump series, now available in English for the first time, in a deluxe edition featuring color pages and newly drawn cover art! JoJo’s Bizarre Adventure is a groundbreaking manga famous for its outlandish characters, wild humor and frenetic battles. A multigenerational tale of the heroic Joestar family and their never-ending battle against evil!

        Young Jonathan Joestar’s life is forever changed when he meets his new adopted brother, Dio. For some reason, Dio has a smoldering grudge against him and derives pleasure from seeing him suffer. But every man has his limits, as Dio finds out. This is the beginning of a long and hateful relationship!`,
        published: true,
        author: '3'
    }
];

let comments = [
    {
        id: '1',
        text: 'This is my comment!',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'Buff E100',
        author: '1',
        post: '2'
    },
    {
        id: '3',
        text: 'Go sit under a tree.',
        author: '2',
        post: '3'
    },
    {
        id: '4',
        text: "I don't like your attitued",
        author: '3',
        post: '3'
    }
];

export default {
    users,
    posts,
    comments
};