const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

let challenge = {
    title: '',
    difficulty: '',
    description: '',
    tags: '',
    packs: '',
    succession: {
        inheritance: '',
        bloodline: '',
        heir: '',
        species: ''
    },
    generations: {
        1: {
            title: '',
            color: '',
            description: '',
            requirements: '',
            milestones: '',
        }
    }
}