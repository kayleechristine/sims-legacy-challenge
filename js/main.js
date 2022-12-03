"use strict";
(function(){

// Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Challenge Data
$('#submit').click(function(e) {
    e.preventDefault();

    let packs = [];
    $.each($('input[name="req-pack"]:checked'), function() {
        packs.push($(this).val());
    })

    let challenge = {
        overview: {
            title: $('#challenge-title').val(),
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

})();