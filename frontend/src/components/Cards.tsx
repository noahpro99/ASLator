import React from 'react';

const people = [
    {
        name: 'Mikhail Sannikov',
        description: 'Mechanical Engineering',
        imageSrc: '/images/img-Mik.jpg',
        imageAlt: 'Mikhail Sannikov',
        url: 'https://github.com/msannikov03',
    },
    {
        name: 'Noah Provenzano',
        description: 'Computer Science and Physics',
        imageSrc: '/images/img-noah.jpg',
        imageAlt: 'Noah Provenzano',
        url: 'https://github.com/noahpro99',
    },
    {
        name: 'Rituraj Sharma',
        description: 'Computer Science',
        imageSrc: '/images/img-rit.jpg',
        imageAlt: 'Rituraj Sharma',
        url: 'https://github.com/Rituraj003',
    },
]

function Cards() {
    return (
        <div className="bg-gray-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-6">
                    <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
                        {people.map((person) => (
                            <div key={person.name} className="group relative">
                                <a href={person.url} className="block">
                                    <div className="p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transform transition bg-gray-200">
                                        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 sm:h-64">
                                            <img
                                                src={person.imageSrc}
                                                alt={person.imageAlt}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <h3 className="mt-6 text-sm text-gray-500">{person.description}</h3>
                                        <p className="text-base font-semibold text-gray-900">{person.name}</p>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-20"></div>
        </div>
    )
}
export default Cards;
