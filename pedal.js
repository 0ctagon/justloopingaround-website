tierlist = window.myConfig.tierlist;
language = window.myConfig.language;

const hofTitles = [
    "Pour présenter Marc",
    "Masterclass",
    "Passe toujours tout le temps ca sonne INCREDIBLE",
    "Masterclass storytelling",
    "Masterclass de composition",
    "Mood patraque",
    "Reposant",
    "Je danse",
    "Trop court des DIAMANTS si c'était plus long",
    "Streams qui m'ont particulièrement marqués"
];

let jukeboxSongsList = [
    {
        name: "Outside experiment",
        rank: "S",
        genre: "chill funk",
        tempo: "medium fast",
        length: "08'40",
        comment: "ptn cette basse",
        choree: "Oooh oh baby",
        url: "https://youtu.be/hrbielT80bE?t=0",
        albumId: "s200524",
        albumTitle: "EASY SUNDAY (NO CALLS)",
        albumDate: "13 F\u00e9vrier 2021",
    }
];

const svgPath = "./svg";
const rankedOnTxt = "Noté le";
let tableHeader = [];

if (tierlist) {
    tableHeader = ["Titre<br>(avec lien cliquable)", "Rank", "Genre", "Durée", "Tempo", "Commentaire", "Chant"]
} else {
    tableHeader = ["Titre<br>(avec lien cliquable)", "Durée", "Tempo", "Chant"]
}
const databaseTableHeader = [...tableHeader, "Date", "Titre de live"];