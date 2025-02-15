tierlist = window.myConfig.tierlist;
language = window.myConfig.language;

const hofTitles = [
    "To introduce Marc",
    "Masterclass",
    "Songs that you can listen all the time bc they are INCREDIBLE",
    "Storytelling masterclass",
    "Composition masterclass",
    "Sad mood",
    "Relaxing",
    "I dance",
    "Too short, they are DIAMONDS if they were longer",
    "Streams that really impacted me"
];

let jukeboxSongsList = [
    {
        name: "Outside experiment",
        rank: "S",
        genre: "chill funk",
        tempo: "medium fast",
        length: "08'40",
        comment: "omg this bass",
        choree: "Oooh oh baby",
        url: "https://youtu.be/hrbielT80bE?t=0",
        albumId: "s200524",
        albumTitle: "EASY SUNDAY (NO CALLS)",
        albumDate: "13th February 2021",
    }
];

const svgPath = "../svg";
const rankedOnTxt = "Ranked on";
let tableHeader = [];

if (tierlist) {
    tableHeader = ["Title<br>(with clickable link)", "Rank", "Genre", "Length", "Tempo", "Comment", "Choral"]
} else {
    tableHeader = ["Title<br>(with clickable link)", "Length", "Tempo", "Choral"]
}
const databaseTableHeader = [...tableHeader, "Date", "Live title"];