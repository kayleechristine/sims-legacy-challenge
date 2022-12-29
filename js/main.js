"use strict";
(function(){

// Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Challenge Data
let logo;
$('#logo-submit').click(function() {
    logo = $('input[name="challenge-logo"]:checked').val();
    console.log(logo);
})

$('#submit').click(function(e) {
    e.preventDefault();

    let packs = [];
    $.each($('input[name="req-pack"]:checked'), function() {
        packs.push($(this).val());
    })

    let challenge = {
        overview: {
            title: $('#challenge-title').val(),
            logo: `img/logos/${logo}.png`,
            difficulty: $('#challenge-difficulty').val(),
            description: $('#challenge-description').val(),
            tags: $('#challenge-tags').val().split(' '),
            packs
        },
        succession: {
            inheritance: $('#inheritance-law').val(),
            bloodline: $('#bloodline-law').val(),
            heir: $('#heir-law').val(),
            species: $('#species-law').val()
        },
        generations: { // TODO: Push generation data to challenge object
            1: {
                title: '',
                color: '',
                description: '',
                requirements: '',
                milestones: '',
            }
        }
    }
    console.log(challenge);
});

// Challenge Tags
// TODO: Stylize how tags appear in the input field
let input = document.getElementById('challenge-tags');
input.addEventListener('keydown', hashtag, false);

function hashtag(e) {
    if (e.keyCode === 32 && e.target.value.length) {
        e.preventDefault();

        let elem = e.target,
            val = elem.value;

        if (val.slice(-1) !== '#') {
            elem.value += ' #';
        }
    } else if (!e.target.value.length) {
        if (e.keyCode === 32) {
            e.preventDefault();
        }
        e.target.value = '#';
    }
}
//////////// SUCCESSION LAW CARDS ////////////
// TODO: Add all laws to succession laws object
// When the succession laws are selected in the form's drop-down menu,
// cards with the name and description of each law replace the placeholders.

    const laws = [
        {
            id: 0,
            name: 'Matriarchy',
            description: 'The founder and all heirs must be female. If there are no eligible female heirs, the heir may be male.',
            image: 'img/laws/pink-crown.png',
            alt: 'pink crown'
        },
        {
            id: 1,
            name: 'Patriarchy',
            description: 'The founder and all heirs must be male. If there are no eligible male heirs, the heir may be female.',
            image: 'img/laws/blue-crown.png',
            alt: 'blue crown'
        },
        {
            id: 2,
            name: 'Equality',
            description: 'The founder and all heirs can be of either gender. There are no gender restrictions.',
            image: 'img/laws/green-crown.png',
            alt: 'green crown'
        },
        {
            id: 3,
            name: 'Traditional',
            description: 'Heirs should be direct descendents of the founder. Adopted children may become the heir if there are no direct descendents.',
            image: 'img/laws/genetic.png',
            alt: 'dna'
        },
        {
            id: 4,
            name: 'Foster',
            description: 'Heirs should be adopted into the founder\'s family. Direct descendents may become heir if there are no adopted children.',
            image: 'img/laws/adoption.png',
            alt: 'child adoption'
        },
        {
            id: 5,
            name: 'Modern',
            description: 'The heirs may either be adopted or direct descendents. There are no bloodline restrictions.',
            image: 'img/laws/children.png',
            alt: 'children'
        },
        {
            id: 6,
            name: 'First Born',
            description: 'The first born eligible child of each generation is the heir by default.',
            image: 'img/laws/teenager.png',
            alt: 'teenager'
        },
        {
            id: 7,
            name: 'Last Born',
            description: 'The last born eligible child of each generation is heir by default.',
            image: 'img/laws/baby.png',
            alt: 'baby'
        },
        {
            id: 8,
            name: 'Living Will',
            description: 'The sim with the highest relationship with the current heir will become the next heir.',
            image: 'img/laws/favorite-child.png',
            alt: 'parent and child'
        },
        {
            id: 9,
            name: 'Merit',
            description: 'The sim with the most developed skills will be named heir.',
            image: 'img/laws/bar-chart.png',
            alt: 'bar chart'
        },
        {
            id: 10,
            name: 'Strength',
            description: 'The first born will be heir by default, but the title of heir can be taken by challenging the current heir to a fight and winning.',
            image: 'img/laws/boxing-gloves.png',
            alt: 'boxing glove'
        },
        {
            id: 11,
            name: 'Random',
            description: 'The heir will be chosen at random at the end of the generation.',
            image: 'img/laws/dice.png',
            alt: 'hand holding die'
        },
        {
            id: 12,
            name: 'Exemplar',
            description: 'One of the founder\'s traits will be selected as the exemplar trait. A sim must possess this trait to be eligible for heir.',
            image: 'img/laws/fleur-de-lis.png',
            alt: 'fleur de lis'
        },
        {
            id: 13,
            name: 'Democracy',
            description: 'The heir will be determined by popular vote.',
            image: 'img/laws/vote.png',
            alt: 'vote sign'
        },
        {
            id: 14,
            name: 'Strongest Bloodline',
            description: 'The heir with the strongest bloodline trait will become heir.',
            image: 'img/laws/blood.png',
            alt: 'blood drop'
        },
        {
            id: 15,
            name: 'Xenocracy',
            description: 'Heirs must alternate between different species (ie; human, vampire, werewolf, alien, or spellcaster).',
            image: 'img/laws/different-people.png',
            alt: 'two people'
        },
        {
            id: 16,
            name: 'Xenophobe',
            description: 'Heirs may only be the same species as the founder.',
            image: 'img/laws/one-person.png',
            alt: 'one person with checkmark'
        },
        {
            id: 17,
            name: 'Brood',
            description: 'Heirs may be any species, but must be carried in a pregnancy by the previous heir. Regardless of gender.',
            image: 'img/laws/group.png',
            alt: 'group of different people'
        },
        {
            id: 18,
            name: 'Tolerant',
            description: 'The species of a sim has no impact on eligibility for heir. There are no restrictions on species.',
            image: 'img/laws/people.png',
            alt: 'group of different people'
        }
    ];

    function populateCards(section, id) {
        let html = '';
            html += `            
                <div class="col-md-4 p-2 d-flex card-image">
                    <img src="${laws[id].image}" class="rounded-start" style="width: 100px" alt="plumbob">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${laws[id].name}
                        </h5>
                        <p class="card-text small">
                            ${laws[id].description}
                        </p>
                    </div>
                </div>`;
        $(`#${section}-container`).html(html);
    }

    $('.succession-laws').change(function() {
        console.log(this.getAttribute('data-dbid'));
        populateCards(this.getAttribute('data-dbid'), this.value);
    })



})();