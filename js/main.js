"use strict";
(function(){

// Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

//////////// LOGO SELECTION ////////////
// On first load, a button will be present prompting the user to select a logo. When the button is clicked,
// a modal with the available logos will appear. After selection, the button will only appear on hover.

let logo;
$('#logo-submit').click(function() {
    logo = $('input[name="challenge-logo"]:checked').val();
    $('#logo-placeholder').attr('src', `img/logos/${logo}.png`).css('opacity', '100%');
    $('#logo-card').hover(
        function(){
            $('#logo-btn').css('opacity', '100');
            $('#logo-placeholder').css('opacity', '50%');
        },
        function(){
            $('#logo-btn').css('opacity', '0');
            $('#logo-placeholder').css('opacity', '100%');
        }
    );
})

//////////// CHALLENGE DATA OBJECT ////////////
// TODO: Save submitted challenges to Glitch
// Creates an object for the challenge containing
// the challenge's details.

$('#submit').click(function(e) {
    e.preventDefault();

    let challenge = {
        overview: {
            title: $('#challenge-title').val(),
            logo,
            difficulty: $('#challenge-difficulty').val(),
            description: $('#challenge-description').val(),
            tags: $('#challenge-tags').val().split(' '),
            packs
        },
        succession: {
            inheritance: $('.inheritance:selected').attr("name"),
            bloodline: $('.bloodline:selected').attr("name"),
            heir: $('.heir:selected').attr("name"),
            species: $('.species:selected').attr("name")
        },
        generations: [ // TODO: Push generation data to challenge object
            {
                title: $('#gen-title').val(),
                color: $('#gen-color').val(),
                description: $('#gen-description').val(),
                requirements: '',
                milestones: '',
            }
        ]
    }
    console.log(challenge);
});

//////////// CHALLENGE TAGS ////////////
// TODO: Stylize how tags appear in the input field
// Tags will be added to the challenge object for
// improved search ability. The tags field will automatically
// format the input as a hashtag.

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

//////////// SECONDARY SELECT OPTIONS ////////////
// Succession laws which require additional information will
// have a second drop-down menu generated.

    let packContent = [
        {
            name: "Get to Work",
            id: "EP01",
            species: "Alien",
            traits: []
        },
        {
            name: "Get Together",
            id: "EP02",
            species: "",
            traits: ["Dance Machine", "Insider"]
        },
        {
            name: "City Living",
            id: "EP03",
            species: "",
            traits: ["Unflirty"]
        },
        {
            name: "Cats & Dogs",
            id: "EP04",
            species: "",
            traits: ["Cat Lover", "Dog Lover"]
        },
        {
            name: "Seasons",
            id: "EP05",
            species: "",
            traits: []
        },
        {
            name: "Get Famous",
            id: "EP06",
            species: "",
            traits: ["Self-absorbed"]
        },
        {
            name: "Island Living",
            id: "EP07",
            species: "Mermaid",
            traits: ["Child of the Islands", "Child of the Ocean"]
        },
        {
            name: "Discover University",
            id: "EP08",
            species: "",
            traits: []
        },
        {
            name: "Eco Living",
            id: "EP09",
            species: "",
            traits: ["Freegan", "Green Fiend", "Maker", "Recycle Disciple"]
        },
        {
            name: "Snowy Escape",
            id: "EP10",
            species: "",
            traits: ["Adventurous", "Proper"]
        },
        {
            name: "Cottage Living",
            id: "EP11",
            species: "",
            traits: ["Animal Enthusiast", "Lactose Intolerant"]
        },
        {
            name: "High School Years",
            id: "EP12",
            species: "",
            traits: ["Overachiever", "Party Animal", "Socially Awkward"]
        },
        {
            name: "Outdoor Retreat",
            id: "GP01",
            species: "",
            traits: ["Squeamish"]
        },
        {
            name: "Spa Day",
            id: "GP02",
            species: "",
            traits: ["High Maintenance"]
        },
        {
            name: "Dine Out",
            id: "GP03",
            species: "",
            traits: []
        },
        {
            name: "Vampires",
            id: "GP04",
            species: "Vampire",
            traits: []
        },
        {
            name: "Parenthood",
            id: "GP05",
            species: "",
            traits: []
        },
        {
            name: "Jungle Adventure",
            id: "GP06",
            species: "",
            traits: []
        },
        {
            name: "StrangerVille",
            id: "GP07",
            species: "",
            traits: ["Paranoid"]
        },
        {
            name: "Realm of Magic",
            id: "GP08",
            species: "Spellcasters",
            traits: []
        },
        {
            name: "Journey to Batuu",
            id: "GP09",
            species: "",
            traits: []
        },
        {
            name: "Dream Home Decorator",
            id: "GP10",
            species: "",
            traits: []
        },
        {
            name: "My Wedding Stories",
            id: "GP11",
            species: "",
            traits: []
        },
        {
            name: "Werewolves",
            id: "GP12",
            species: "Werewolf",
            traits: []
        }
    ]

    function enableSpecies(packID) {
        packContent.forEach(function(pack) {
            if (pack.id === packID) {
                $(`#${pack.species}`).removeAttr('disabled');
                console.log($(`#${pack.species}`));
            }
        })
    }

    function speciesDropdown() {
        if($('#species-law').val() == 16) {
            $('#species-secondary').html(
                `<select class="form-select d-inline w-50" aria-label="species-secondary" id="species-secondary-menu"
                        data-dbid="species-secondary">
                    <option selected disabled>Select a Species</option>
                    <option name="human" value="19">Human</option>
                    <option name="vampire" value="20" class="species-option" id="Vampire" disabled>Vampire</option>
                    <option name="werewolf" value="21" class="species-option" id="Werewolf" disabled>Werewolf</option>
                    <option name="spellcaster" value="22" class="species-option" id="Spellcaster" disabled>Spellcaster</option>
                    <option name="mermaid" value="23" class="species-option" id="Mermaid" disabled>Mermaid</option>
                    <option name="alien" value="24" class="species-option" id="Alien" disabled>Alien</option>
                </select>`
            ).css('display', 'inline');
            $('#species-law').css('width', '49%').css('display', 'inline');
        } else {
            $('#species-secondary').css('display', 'none');
            $('#species-law').css('width', '100%');
            $('.species-option').attr('disabled');
        }
        packs.forEach(function(pack) {
            enableSpecies(pack);
        });
    }

    $('#species-law').change(() => speciesDropdown());

    function enableTraits(packID) {
        packContent.forEach(function(pack) {
            if (pack.id === packID) {
                pack.traits.forEach(function(trait){
                    $(`#${trait.replaceAll(' ', '-')}`).removeAttr('disabled');
                })
            }
        })
    }

    function heirDropdown() {
        if($('#heir-law').val() == 12) {
            $('#heir-secondary').html(
                `<select class="form-select d-inline w-50" aria-label="heir-secondary" id="heir-secondary-menu"
                        data-dbid="heir-secondary">
                    <option selected disabled>Select a Trait</option>
                    <option id="Active" value="T01">Active</option>
                    <option disabled id="Adventurous" value="T02">Adventurous</option>
                    <option id="Ambitious" value="T03">Ambitious</option>
                    <option disabled id="Animal-Enthusiast" value="T04">Animal Enthusiast</option>
                    <option id="Art-Lover" value="T05">Art Lover</option>
                    <option id="Bookworm" value="T06">Bookworm</option>
                    <option id="Bro" value="T07">Bro</option>
                    <option disabled id="Cat-Lover" value="T08">Cat Lover</option>
                    <option id="Cheerful" value="T09">Cheerful</option> 
                    <option disabled id="Child-of-the-Islands" value="T10">Child of the Islands</option>
                    <option disabled id="Child-of-the-Ocean" value="T11">Child of the Ocean</option>
                    <option id="Childish" value="T12">Childish</option>
                    <option id="Clumsy" value="T13">Clumsy</option>
                    <option id="Creative" value="T14">Creative</option>
                    <option disabled id="Dance-Machine" value="T15">Dance Machine</option>
                    <option disabled id="Dog-Lover" value="T16">Dog Lover</option>
                    <option id="Erratic" value="T17">Erratic</option>
                    <option id="Evil" value="T18">Evil</option>
                    <option id="Family-oriented" value="T19">Family-oriented</option>
                    <option id="Foodie" value="T20">Foodie</option>
                    <option disabled id="Freegan" value="T21">Freegan</option>
                    <option id="Geek" value="T22">Geek</option>
                    <option id="Genius" value="T23">Genius</option>
                    <option id="Gloomy" value="T24">Gloomy</option>
                    <option id="Glutton" value="T25">Glutton</option>
                    <option id="Good" value="T26">Good</option>
                    <option disabled id="Green-Fiend" value="T27">Green Fiend</option>
                    <option id="Goofball" value="T28">Goofball</option>
                    <option id="Hates-Children" value="T29">Hates Children</option>
                    <option disabled id="High-Maintenance" value="T30">High Maintenance</option>
                    <option id="Hot-headed" value="T31">Hot-headed</option>
                    <option disabled id="Insider" value="T32">Insider</option>
                    <option id="Jealous" value="T33">Jealous</option>
                    <option id="Kleptomaniac" value="T34">Kleptomaniac</option>
                    <option disabled id="Lactose-Intolerant" value="T35">Lactose Intolerant</option>
                    <option id="Lazy" value="T36">Lazy</option>
                    <option id="Loner" value="T37">Loner</option>
                    <option id="Loves-Outdoors" value="T38">Loves Outdoors</option>
                    <option disabled id="Loyal" value="T39">Loyal</option>
                    <option disabled id="Maker" value="T40">Maker</option>
                    <option id="Materialistic" value="T41">Materialistic</option>
                    <option id="Mean" value="T42">Mean</option>
                    <option id="Music-Lover" value="T43">Music Lover</option>
                    <option id="Neat" value="T44">Neat</option>
                    <option id="Noncommittal" value="T45">Noncommittal</option>
                    <option id="Outgoing" value="T46">Outgoing</option>
                    <option disabled id="Overachiever" value="T47">Overachiever</option>
                    <option disabled id="Recycle-Disciple" value="T48">Recycle Disciple</option>
                    <option disabled id="Paranoid" value="T49">Paranoid</option>
                    <option disabled id="Party-Animal" value="T50">Party Animal</option>
                    <option id="Perfectionist" value="T51">Perfectionist</option>
                    <option disabled id="Proper" value="T52">Proper</option>
                    <option id="Romantic" value="T53">Romantic</option>
                    <option disabled id="Self-absorbed" value="T54">Self-absorbed</option>
                    <option id="Self-assured" value="T55">Self-assured</option>
                    <option id="Slob" value="T56">Slob</option>
                    <option id="Snob" value="T57">Snob</option>
                    <option disabled id="Socially-Awkward" value="T58">Socially Awkward</option>
                    <option disabled id="Squeamish" value="T59">Squeamish</option>
                    <option disabled id="Unflirty" value="T60">Unflirty</option>
                    <option id="Vegetarian" value="T61">Vegetarian</option>
                </select>`
            ).css('display', 'inline');
            $('#heir-law').css('width', '49%').css('display', 'inline');
        } else {
            $('#heir-secondary').css('display', 'none');
            $('#heir-law').css('width', '100%');
        }
        packs.forEach(function(pack) {
            enableTraits(pack);
        });
    }

    $('#heir-law').change(() => heirDropdown());

    let packs = [];
    $('#pack-container').change(function() {
        packs = [];
        $.each($('input[name="req-pack"]:checked'), function() {
            packs.push($(this).val());
        })
        speciesDropdown();
        heirDropdown();
    })

//////////// GENERATION REQUIREMENTS & MILESTONES ////////////
// Succession laws which require additional information will
// have a second drop-down menu generated.
// TODO: Add generations
// TODO: Rearrange / delete generations
// TODO: Add milestones / requirements
// TODO: Delete milestones & requirements

    function addRequirement(id) {
        let num = 1;
        console.log('addRequirement fired: ', id);
        num++;
        let html = $(`#gen-${id}-req`).html();
        // TODO: log how many req there currently are as a data-dbid
        console.log(html);
        // TODO: wrap in a for loop to limit the amount of milestones
            html += `
                <label class="visually-hidden">Milestones</label>
                <div class="input-group mb-2">
                    <div class="input-group-text">${num}</div>
                    <input type="text" class="form-control" placeholder="Enter a milestone...">
                </div>`;
        $(`#gen-${id}-req`).html(html);
    }
    //
    // $('#add-req').click(() => addRequirement());

    $('.add-req').click((event) => {
        console.log();
        addRequirement($(event.currentTarget).attr('data-gen'));
    });

    $('.add-ms').click((event) => {
        console.log($(event.currentTarget).attr('data-gen'));
    });

    new Swatchy();

})();