tierlist = window.myConfig.tierlist;
language = window.myConfig.language;

hofTitles = [];
jukeboxSongsList = [];
svgPath = "";
rankedOnTxt = "";
tableHeader = [];
databaseTableHeader = [];
hallOfFameCategories = [];

if (language === "fr") {
    hofTitles = [
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

    jukeboxSongsList = [
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

    svgPath = "../svg";
    jsPath = "../js";
    rankedOnTxt = "Noté le";

    if (tierlist) {
        tableHeader = ["Titre<br>(avec lien cliquable)", "Rank", "Genre", "Durée", "Tempo", "Commentaire", "Chant"]
    } else {
        tableHeader = ["Titre<br>(avec lien cliquable)", "Genre", "Durée", "Tempo", "Chant"]
    }
    databaseTableHeader = [...tableHeader, "Date", "Titre de live"];

} else {

    hofTitles = [
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

    jukeboxSongsList = [
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

    svgPath = "svg";
    jsPath = "js";
    rankedOnTxt = "Ranked on";

    if (tierlist) {
        tableHeader = ["Title<br>(with clickable link)", "Rank", "Genre", "Length", "Tempo", "Comment", "Choral"]
    } else {
        tableHeader = ["Title<br>(with clickable link)", "Genre", "Length", "Tempo", "Choral"]
    }
    databaseTableHeader = [...tableHeader, "Date", "Live title"];
}

if (tierlist) {
    hallOfFameCategories = [
        {
            title: hofTitles[0],
            songs: [
                { id: "s190623", name: "Katie's pregnant", overlayName: "Katie's pregnant" }
            ]
        },
        {
            title: hofTitles[1],
            songs: [
                { id: "s210328", name: "Get up", overlayName: "- Get up" }
            ]
        },
        {
            title: hofTitles[2],
            songs: [
                { id: "s200524", name: "Outside experiment", overlayName: "Outside experiment" },
                { id: "s190825", name: "Entitlement", overlayName: "Entitlement" },
                { id: "s201223t", name: "Die with harmonics", overlayName: "Die with harmonics" },
                { id: "s200605t", name: "Mii Psychiatry", overlayName: "Mii Psychiatry", time: "0h46m20s" },
                { id: "s180921", name: "Diarrhea", overlayName: "Diarrhea" },
                { id: "s180429", name: "Gibberish", overlayName: "Gibberish" },
                { id: "s180415", name: "Stoned", overlayName: "Stoned" },
                { id: "s200517", name: "Classified", overlayName: "Classified" },
                { id: "s210808", name: "Fuck Billionairs", overlayName: "- Fuck Billionairs" },
            ]
        },
        {
            title: hofTitles[3],
            songs: [
                { id: "s200510", name: "Birthday freedom", overlayName: "Birthday freedom" }
            ]
        },
        {
            title: hofTitles[4],
            songs: [
                { id: "s190825", name: "Mushroom trip", overlayName: "Mushroom trip" },
                { id: "s200421t", name: "Fall in love", overlayName: "Fall in love", time: "0h20m26s" },
                { id: "s230717", name: "Jim and the Desperado", overlayName: "Jim and the Desperado" }
            ]
        },
        {
            title: hofTitles[5],
            songs: [
                { id: "s190609", name: "Hold on", overlayName: "Wrestling" },
                { id: "s190908", name: "Love your fellow human", overlayName: "Love your fellow human" },
                { id: "s181013", name: "Linda's 2nd Life", overlayName: "Linda's 2nd Life" },
                { id: "s190714", name: "Somewhere", overlayName: "- Somewhere" },
                { id: "s200302", name: "Cuddle puddle", overlayName: "Cuddle puddle" }
            ]
        },
        {
            title: hofTitles[6],
            songs: [
                { id: "s200405", name: "Sexting", overlayName: "Sexting" },
                { id: "s190728", name: "8-bit fucking", overlayName: "8-bit fucking" },
                { id: "s210523", name: "Therapy 2.0", overlayName: "Therapy 2.0" },
                { id: "s210606", name: "Quiet end", overlayName: "Quiet end" },
                { id: "s200419", name: "Mister Mustachio", overlayName: "- Mister Mustachio" },
                { id: "s200719", name: "B-side summer song", overlayName: "B-side summer song" }
            ]
        },
        {
            title: hofTitles[7],
            songs: [
                { id: "s200605t", name: "Tempo love", overlayName: "Tempo love", time: "0h11m27s" },
                { id: "s210523", name: "Move your body now", overlayName: "Move your body now" },
                { id: "s200412", name: "Bisexual Jesus", overlayName: "Bisexual Jesus" },
                { id: "s200503", name: "Therapy", overlayName: "Therapy" },
                { id: "s210404", name: "Need that brunch", overlayName: "Need that brunch" },
                { id: "s210411", name: "Professional", overlayName: "Professional" },
                { id: "s210613", name: "Gettin' fucked up tonight", overlayName: "- Gettin' fucked up tonight" },
                { id: "s210606", name: "Connection", overlayName: "Connection" },
                { id: "s210411", name: "Keep working & flying", overlayName: "- Keep working & flying" },
                { id: "s200321", name: "Love", overlayName: "Love" },
                { id: "s180715l", name: "Girl's club", overlayName: "Girl's club" },
                { id: "s241011", name: "After the storm", overlayName: "After the storm" },
            ]
        },
        {
            title: hofTitles[8],
            songs: [
                { id: "s190909t", name: "AFK song", overlayName: "Afk song", time: "0h7m25s" },
                { id: "s200426", name: "Running", overlayName: "Running" },
                { id: "s210629", name: "Upright position", overlayName: "Airplane" },
                { id: "s180420l", name: "Acte 3: Ascending", overlayName: "Acte 3: Ascending" }
            ]
        },
        {
            title: hofTitles[9],
            songs: [
                { id: "s200605t", name: "I'm feeling it", overlayName: "I'm feeling it" },
                { id: "s210523", name: "HARRY MACK IS ON THE STREAM", overlayName: "HARRY MACK IS ON THE STREAM" },
                { id: "s170915", name: "Music Break No. 4 | Bored Certified", overlayName: "Music Break No. 4 | Bored Certified" }
            ]
        }
    ];
}
else {
    hallOfFameCategories = [
        {
            songs: [
                { id: "s210328", name: "Get up", overlayName: "- Get up" },
                { id: "s180715l", name: "Girl's club", overlayName: "Girl's club" },
                { id: "s210314", name: "Vaccinated attitude", overlayName: "Vaccinated attitude" },
                { id: "s201129t", name: "Show me ur tits", overlayName: "Show me ur tits", time: "0h24m17s" },
                { id: "s180715l", name: "Move like that", overlayName: "Move like that" },
                { id: "s210523", name: "Move your body now", overlayName: "Move your body now" },
                { id: "s210519t", name: "You lookin fine", overlayName: "Damn, u lookin good" },
                { id: "s191020", name: "Work that ass for daddy", overlayName: "Work that ass for daddy" },
                { id: "s190825", name: "Mushroom trip", overlayName: "Mushroom trip" },
                { id: "s180715l", name: "Look at that ass", overlayName: "Look at that ass" },
                { id: "s210418", name: "Smoke eloge", overlayName: "Smoke eloge" },
                { id: "s230403l", name: "Time to dance", overlayName: "Time to dance" },
                { id: "s210613", name: "Breathe", overlayName: "- Breathe" },
                { id: "s230515l", name: "Fantasaxtic", overlayName: "Fantasaxtic; Ft. Gabriel Richards" },
                { id: "s240126l", name: "Late to work", overlayName: "Late to work" },
                { id: "s200412", name: "Bisexual Jesus", overlayName: "Bisexual Jesus" },
                { id: "s200215", name: "Big old titties", overlayName: "Big old titties" },
                { id: "s210411", name: "Professional", overlayName: "Professional" },
                { id: "s190623", name: "Katie's pregnant", overlayName: "Katie's pregnant" },
                { id: "s200719", name: "B-side summer song", overlayName: "B-side summer song" },
                { id: "s200524", name: "Outside experiment", overlayName: "Outside experiment" },
                { id: "s190825", name: "Entitlement", overlayName: "Entitlement" },
                { id: "s201223t", name: "Die with harmonics", overlayName: "Die with harmonics" },
                { id: "s200605t", name: "Mii Psychiatry", overlayName: "Mii Psychiatry", time: "0h46m20s" },
                { id: "s200517", name: "Classified", overlayName: "Classified" },
                { id: "s200510", name: "Birthday freedom", overlayName: "Birthday freedom" },
                { id: "s200421t", name: "Fall in love", overlayName: "Fall in love", time: "0h20m26s" },
                { id: "s190609", name: "Hold on", overlayName: "Wrestling" },
                { id: "s190908", name: "Love your fellow human", overlayName: "Love your fellow human" },
                { id: "s181013", name: "Linda's 2nd Life", overlayName: "Linda's 2nd Life" },
                { id: "s190714", name: "Somewhere", overlayName: "- Somewhere" },
                { id: "s200405", name: "Sexting", overlayName: "Sexting" },
                { id: "s190728", name: "8-bit fucking", overlayName: "8-bit fucking" },
                { id: "s210523", name: "Therapy 2.0", overlayName: "Therapy 2.0" },
                { id: "s200503", name: "Therapy", overlayName: "Therapy" },
                { id: "s210606", name: "Quiet end", overlayName: "Quiet end" },
                { id: "s210404", name: "Need that brunch", overlayName: "Need that brunch" },
                { id: "s210613", name: "Gettin' fucked up tonight", overlayName: "- Gettin' fucked up tonight" },
                { id: "s210411", name: "Keep working & flying", overlayName: "- Keep working & flying" },
                { id: "s200321", name: "Love", overlayName: "Love" },
                { id: "s200426", name: "Running", overlayName: "Running" },
                { id: "s210606", name: "Connection", overlayName: "Connection" },
            ]
        }
    ];
}