const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

let challenge = {
    title: '',
    difficulty: '',
    description: '',
    tags: '',
    packs: '',
    // succession: {
    //     inheritance: '',
    //     bloodline: '',
    //     heir: '',
    //     species: ''
    // },
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

$('#submit').click(function(e) {
    e.preventDefault();
    challenge.title = $('#challenge-title').val();
    challenge.difficulty = $('#challenge-difficulty').val();
    challenge.description = $('#challenge-description').val();
    challenge.tags = $('#challenge-tags').val().split(", ");
    let packs = [];
    $.each($('input[name="req-pack"]:checked'), function() {
        packs.push($(this).val());
    })
    challenge.packs = packs;
    console.log(challenge);
});