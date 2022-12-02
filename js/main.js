"use strict";

// Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Challenge Data
let challenge = {
    title: '',
    difficulty: '',
    description: '',
    tags: '',
    packs: '',
    succession: { // TODO: Push data to challenge object
        inheritance: '',
        bloodline: '',
        heir: '',
        species: ''
    },
    // generations: {
    //     1: {
    //         title: '',
    //         color: '',
    //         description: '',
    //         requirements: '',
    //         milestones: '',
    //     }
    // }
}

// Challenge Tags
// TODO: Stylize how tags appear in the input field
let input = document.getElementById('challenge-tags');
input.addEventListener('keydown', addHash, false);

function addHash(e) {
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

// Submit - Generate Challenge
$('#submit').click(function(e) {
    e.preventDefault();
    challenge.title = $('#challenge-title').val();
    challenge.difficulty = $('#challenge-difficulty').val();
    challenge.description = $('#challenge-description').val();
    challenge.tags = $('#challenge-tags').val().split(' ');
    let packs = [];
    $.each($('input[name="req-pack"]:checked'), function() {
        packs.push($(this).val());
    })
    challenge.packs = packs;
    console.log(challenge);
});