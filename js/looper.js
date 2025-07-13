tierlist = window.myConfig.tierlist
language = window.myConfig.language;

if (document.querySelector('.hof-content-section')) {
    const content_section = document.querySelector('.hof-content-section');
    if (!tierlist) {
        content_section.style.height = '100%';
        const container = document.querySelector('.hof-container');
        const img = container.querySelector('img');
        if (img) {
            img.style.height = `${content_section.offsetHeight}px`;
            img.style.objectFit = 'cover';
        }
        if (img) {
            img.style.objectPosition = 'center 9%';
        }
    }

    hallOfFameCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('hof-category');

        const title = document.createElement('h3');
        title.textContent = category.title;
        categoryDiv.appendChild(title);

        const songsDiv = document.createElement('div');
        songsDiv.classList.add('hof-songs');
        category.songs.forEach((song, index) => {
            const songP = document.createElement('p');
            const songLink = document.createElement('a');
            songLink.classList.add('custom-link');

            songLink.onclick = (event) => {
                if (song.time) {
                    showAlbumOverlay(event, song.id, song.overlayName, song.time);
                } else {
                    showAlbumOverlay(event, song.id, song.overlayName);
                }
            };

            songLink.innerHTML = `<u>${song.name}</u>`;
            songP.appendChild(songLink);
            songsDiv.appendChild(songP);

            if (index < category.songs.length - 1) {
                const dashP = document.createElement('p');
                dashP.textContent = '-';
                songsDiv.appendChild(dashP);
            }
        });
        categoryDiv.appendChild(songsDiv);
        content_section.appendChild(categoryDiv);
    });
}





// DICTIONARIES
const rankColors = {
    "S": ["#FFCC00", "#FF9900"],
    "A+": ["#F0B2FF", "#D94AFF"],
    "A": ["#F0B2FF", "#D760FF"],
    "B+": ["#99FF99", "#00FF00"],
    "B": ["#99FF99", "#66FF99"],
    "C+": ["#CCECFF", "#99E6FF"],
    "C": ["#CCECFF", "#A5DEFF"],
    "D": ["#C4C4C4", "#A6A6A6"],
    "I": ["#C4C4C4", "#A6A6A6"],
};

const rankOrder = ["S", "A+", "A", "B+", "B", "C+", "C", "D", "I"];
const rankColorsOrder = rankOrder.map(rank => rankColors[rank] ? rankColors[rank][1] : '#ffffff');

const tempoText = {
    "Fast": "Fast",
    "Fmed": "Medium Fast",
    "Med": "Medium",
    "Smed": "Medium Slow",
    "Slow": "Slow"
}

// UTILITIES

function extractYtVideoId(url) {
    let liveCode;
    if (url.includes(".be")) {
        liveCode = url.substring(url.indexOf(".be") + 4);
    } else if (url.includes("live/")) {
        liveCode = url.substring(url.indexOf("live/") + 5, url.indexOf("live/") + 5 + 11);
    } else if (url.includes("v=")) {
        liveCode = url.substring(url.indexOf("v=") + 2);
    }
    if (liveCode.includes("t=")) {
        liveCode = liveCode.substring(0, liveCode.indexOf("t=") - 1);
    }
    return liveCode;
}

function extractTwVideoId(url) {
    let liveCode;
    liveCode = url.substring(url.indexOf("videos/") + 7);
    if (liveCode.includes("t=")) {
        liveCode = liveCode.substring(0, liveCode.indexOf("t=") - 1);
    }
    return liveCode;
}

function extractYtTimestamp(url) {
    let timestamp;
    if (url.includes("t=")) {
        timestamp = url.substring(url.indexOf("t=") + 2);
        if (timestamp.includes("s")) {
            timestamp = timestamp.substring(0, timestamp.indexOf("s"));
        }
    }
    else {
        timestamp = "0";
    }
    return timestamp;
}


function extractTwTimestamp(url) {
    let timer;
    timer = url.substring(url.indexOf("t=") + 2);
    if (timer.includes("s")) {
        timer = timer.substring(0, timer.indexOf("s") + 1);
    }
    const hours = parseInt(timer.substring(0, timer.indexOf("h")), 10);
    const minutes = parseInt(timer.substring(timer.indexOf("h") + 1, timer.indexOf("m")), 10);
    const seconds = parseInt(timer.substring(timer.indexOf("m") + 1, timer.indexOf("s")), 10);
    return hours * 60 * 60 + minutes * 60 + seconds;
}

function getTwTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h${minutes}m${secs}s`;
}

function getYtLength(length) {
    // length is in the format "X'Y" (e.g., "3'45")
    const parts = length.split("'");
    if (parts.length !== 2) {
        seconds = parseInt(length, 10);
        minutes = 0;
    }
    else {
        minutes = parseInt(parts[0], 10);
        seconds = parseInt(parts[1], 10);
    }
    return minutes * 60 + seconds;
}

function applyRankColors(row, rank, songTitle = null, currentTitle = null) {
    for (let i = 0; i < row.cells.length; i++) {
        if (rankColors[rank]) {
            // If the song title matches the provided songTitle, apply special styling
            if (songTitle && currentTitle === songTitle) {
                row.style.backgroundColor = rankColors[rank][0];
                row.cells[i].style.color = 'black';
            } else {
                // Regular styling
                row.cells[i].style.color = rankColors[rank][0];
                if (i === 1) {
                    row.cells[i].style.color = rankColors[rank][1];
                }
            }
        } else {
            // Handle cases where rank includes a letter but is not an exact match
            const baseRank = rank[0];
            if (rankColors[baseRank]) {
                if (songTitle && currentTitle === songTitle) {
                    row.style.backgroundColor = rankColors[baseRank][0];
                    row.cells[i].style.color = 'black';
                } else {
                    row.cells[i].style.color = rankColors[baseRank][0];
                    if (i === 1) {
                        row.cells[i].style.color = rankColors[baseRank][1];
                    }
                }
            }
        }
    }
}


function createAlbumCircle(numSongs, colors) {
    const svgNS = "http://www.w3.org/2000/svg";
    const circleSize = 30;
    const circleRadius = circleSize / 2;
    const strokeWidth = 6.5;
    const circumference = 2 * Math.PI * circleRadius;
    const arcLength = circumference / numSongs;

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", circleSize);
    svg.setAttribute("height", circleSize);
    svg.setAttribute("viewBox", `0 0 ${circleSize} ${circleSize}`);

    // Create the larger background circle (translucent black)
    const backgroundCircle = document.createElementNS(svgNS, "circle");
    backgroundCircle.setAttribute("cx", circleRadius);
    backgroundCircle.setAttribute("cy", circleRadius);
    backgroundCircle.setAttribute("r", circleRadius);
    backgroundCircle.setAttribute("fill", "rgba(0, 0, 0, 0.5)");
    svg.appendChild(backgroundCircle);

    // Create the arcs for each song, adjusting offset based on the number of songs
    for (let index = 0; index < colors.length; index++) {
        const color = colors[index];
        const arc = document.createElementNS(svgNS, "circle");
        arc.setAttribute("cx", circleRadius);
        arc.setAttribute("cy", circleRadius);
        arc.setAttribute("r", circleRadius - strokeWidth);
        arc.setAttribute("fill", "none");
        arc.setAttribute("stroke", color);
        arc.setAttribute("stroke-width", strokeWidth);
        if (index != 0) {
            arc.setAttribute("stroke-dasharray", `0 ${(arc.getAttribute("r") * index * 2 * Math.PI)/numSongs} 10000 10000`);
        }
        arc.setAttribute("transform", `rotate(-90 ${circleRadius} ${circleRadius})`);

        svg.appendChild(arc);
    }

    return svg;
}



// DATABASE
let all_albums = [];
let response;

async function getdb() {
    try {
        const dbUrl = ""

        if (language === "en") {
            response = await fetch(extractDb(dbUrl+"_EN})"));
        }
        else {
            response = await fetch(extractDb(dbUrl+"_FR})"));
        }
        if (!response.ok) {
            throw new Error('Database fetch failed, reload the page');
        }
        const data = await response.json();
        renderAlbums(data.albums);
        if (document.getElementById('jukebox-overlay')) {
            updateJukeboxSongs();
        }
        if (document.getElementById('loople-controls')) {
            updateSongGame();
        }
    } catch (error) {
        console.error('Database fetch failed, reload the page: ', error);
    }
}

// Render albums
document.addEventListener('DOMContentLoaded', getdb);

function renderAlbums(albums) {
    albums.forEach(album => {

        all_albums.push(album);
        const albumItem = document.createElement('div');
        albumItem.className = 'album-item';
        albumItem.id = album.id;
        albumItem.onclick = (event) => showAlbumOverlay(event, album.id);

        const albumImage = document.createElement('img');
        albumImage.className = 'album-item-image';
        albumImage.src = album.picture_link;
        albumImage.alt = album.title;

        const albumTitle = document.createElement('div');
        albumTitle.className = 'album-item-title';
        albumTitle.textContent = album.title;

        const albumDate = document.createElement('div');
        albumDate.className = 'album-item-date';
        albumDate.textContent = album.date;

        albumItem.appendChild(albumImage);
        albumItem.appendChild(albumTitle);
        albumItem.appendChild(albumDate);

        const n_songs = album.songs.length;
        let songColors = [];
        for (song of album.songs) {
            songColors.push(rankColors[song.rank][1]);
        }
        songColors.sort((a, b) => {
            const aIndex = rankColorsOrder.indexOf(a);
            const bIndex = rankColorsOrder.indexOf(b);
            return aIndex - bIndex;
        });
        if (tierlist) {
            const circle = createAlbumCircle(n_songs, songColors);
            albumItem.appendChild(circle);
        }

        // Add YouTube icon SVG
        // const youtube-icon = createYouTube-icon();

        if (album.id.includes('t')) {
            const imgtwitch = document.createElement('img');
            imgtwitch.src = svgPath + '/stream/twitch.svg';
            imgtwitch.className = 'twitch-icon';
            imgtwitch.alt = 'Twitch icon';
            albumItem.appendChild(imgtwitch);
        }
        else {
            const imgyt = document.createElement('img');
            imgyt.src = svgPath + '/stream/youtube.svg';
            imgyt.className = 'youtube-icon';
            imgyt.alt = 'YouTube icon';
            albumItem.appendChild(imgyt);
        }

        if (album.id.includes('l') || album.id === 's230328t' || album.id === 's230328tB') {
            const imglive = document.createElement('img');
            imglive.src = svgPath + '/stream/live.svg';
            imglive.className = 'live-icon';
            imglive.alt = 'Live icon';
            albumItem.appendChild(imglive);
        }
        if (document.getElementById('album-container')) {
            document.getElementById('album-container').appendChild(albumItem);
        }
    });
}

// OVERLAY
function showAlbumOverlay(event, albumId, songTitle = null, timestamp = "0h0m0s") {
    event.stopPropagation();
    const album = all_albums.find(album => album.id === albumId);
    if (album) {
        const songs = album.songs;
        const overlay = document.getElementById('album-overlay');
        const overlayContent = document.getElementById('album-overlay-content');
        overlayContent.innerHTML = ''; // Clear previous content
        const closeBtnDiv = document.createElement('div');
        closeBtnDiv.className = 'go-right';
        const closeBtn = document.createElement('img');
        closeBtn.src = svgPath + '/ui/close.svg';
        closeBtn.id = 'close-btn';
        closeBtn.className = 'close-btn';
        closeBtn.onclick = buttonHideOverlay.bind(null, 'album');
        closeBtnDiv.appendChild(closeBtn);
        overlayContent.appendChild(closeBtnDiv);

        const firstSongUrl = songs[0].url;

        // Create player
        if (albumId.includes('t')) {
            const twitchEmbedDiv = document.createElement('div');
            twitchEmbedDiv.id = 'twitch-embed';
            twitchEmbedDiv.className = 'twitch-embed';
            overlayContent.appendChild(twitchEmbedDiv);

            const twitchScript = document.createElement('script');
            twitchScript.src = "https://player.twitch.tv/js/embed/v1.js";
            twitchScript.onload = function() {
                const player = new Twitch.Player("twitch-embed", {
                    video: extractTwVideoId(firstSongUrl),
                    autoplay: false,
                    width: twitchEmbedDiv.offsetWidth,
                    height: twitchEmbedDiv.offsetWidth * 9 / 16,
                    time: timestamp
                });
                window.twitchPlayer = player;
            };
            twitchScript.onerror = function () {
                console.warn("Failed to load Twitch script, trying local fallback...");
                const fallbackScript = document.createElement('script');
                fallbackScript.src = jsPath + "/twitch-embed.js";
                fallbackScript.onload = function () {
                    console.log("Local Twitch fallback loaded.");

                    const player = new Twitch.Player("twitch-embed", {
                        video: extractTwVideoId(firstSongUrl),
                        autoplay: false,
                        width: twitchEmbedDiv.offsetWidth,
                        height: twitchEmbedDiv.offsetWidth * 9 / 16,
                        time: timestamp
                    });
                    window.twitchPlayer = player;
                };

                fallbackScript.onerror = function () {
                    console.error("Local fallback script also failed. Giving up.");
                    document.getElementById("twitch-embed").innerText =
                        "Twitch video unavailable. Please use direclty the URL from the song name or try again later.";
                };
                document.body.appendChild(fallbackScript);
            };
            overlayContent.appendChild(twitchScript);
        } else {
            const videoId = extractYtVideoId(firstSongUrl);
            const iframe = document.createElement('iframe');
            iframe.className = 'youtube-iframe';
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            overlayContent.appendChild(iframe);
            window.youtubePlayer = iframe;
        }
        const albumInfo = document.createElement('div');
        albumInfo.className = 'album-info';

        const albumTitle = document.createElement('div');
        albumTitle.className = 'album-title';
        albumTitle.textContent = album.title;
        albumInfo.appendChild(albumTitle);

        const albumDate = document.createElement('div');
        albumDate.className = 'album-date';
        albumDate.innerHTML = "<span class='album-date-label'>Date:</span> <span class='album-date-value'>" + album.date + "</span>";
        albumInfo.appendChild(albumDate);

        const whenRanked = document.createElement('div');
        whenRanked.className = 'album-when-ranked';
        if (tierlist) {
            whenRanked.innerHTML = "<span class='album-when-ranked-label'>" + rankedOnTxt +":</span> <span class='album-when-ranked-value'>" + album.when_ranked + "</span>";
        }
        albumInfo.appendChild(whenRanked);

        if (album.comment != "-" && tierlist) {
            const albumComment = document.createElement('div');
            albumComment.className = 'album-comment';
            albumComment.textContent = '"' + album.comment + '"';
            albumInfo.appendChild(albumComment);
        }

        overlayContent.appendChild(albumInfo);


        // Create table
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const headers = tableHeader;
        headers.forEach(header => {
            const th = document.createElement('th');
            th.className = 'top-column';
            th.innerHTML = header;
            headerRow.appendChild(th);
            // th.style.fontVariant = 'small-caps';
        });
        table.appendChild(headerRow);

        songs.forEach(song => {
            const row = document.createElement('tr');
            Object.values(song).forEach(value => {
                if (value !== song.url && value !== song.albumId && value !== song.date && value !== song.albumTitle &&
                    (tierlist || (value !== song.rank && value !== song.comment))) {
                    const cell = document.createElement('td');
                    // If value is song name, make it clickable with the URL
                    if (value == song.name) {
                        if (song.name.length > 40) {
                            cell.className = 'title-break-column';
                        }
                        else {
                            cell.className = 'normal-column';
                        }
                        const link = document.createElement('a');
                        link.href = song.url;
                        if (tierlist) {
                            link.className = 'custom-link';
                        }
                        else {
                            link.className = 'custom-link-notierlist';
                        }
                        link.textContent = value;
                        link.target = "_blank";
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            if (albumId.includes('t')) {
                                const player = window.twitchPlayer;
                                player.seek(extractTwTimestamp(song.url));
                                player.play();
                            } else {
                                window.youtubePlayer.src = `https://www.youtube.com/embed/${extractYtVideoId(song.url)}?&amp;start=${extractYtTimestamp(song.url)};&autoplay=1`;

                            }
                        });

                        if (songTitle && song.name === songTitle && !albumId.includes('t')) {
                            window.youtubePlayer.src = `https://www.youtube.com/embed/${extractYtVideoId(song.url)}?&start=${extractYtTimestamp(song.url)}&autoplay=1`;
                        }


                        if (songTitle && song.name === songTitle) {
                            if (tierlist) {
                                link.style.color = "black";
                            } else {
                                link.style.fontWeight = "bold";
                                link.style.color = "#FF9900";
                            }
                        } else if (tierlist) {
                            link.style.color = rankColors[song.rank] ? rankColors[song.rank][0] : '#ffffff';
                        }

                        link.addEventListener('mouseover', function() {
                            if (!(songTitle && song.name === songTitle) && tierlist) {
                                link.style.color = rankColors[song.rank] ? rankColors[song.rank][1] : '#ffffff';
                            }
                        });

                        link.addEventListener('mouseout', function() {
                            if (songTitle && song.name === songTitle) {
                                if (tierlist) {
                                    link.style.color = "black";
                                }
                                else {
                                    link.style.color = "#FF9900";
                                }
                            } else if (tierlist) {
                                link.style.color = rankColors[song.rank] ? rankColors[song.rank][0] : '#ffffff';
                            }
                        });

                        cell.appendChild(link);
                    }
                    else {
                        cell.textContent = value;
                        if (value == song.comment) {
                            cell.className = 'break-column';
                        }
                        else if (value == song.choree) {
                            if (value.length > 40) {
                                cell.className = 'break-column';
                            }
                            else {
                                cell.className = 'choree-column';
                            }
                        }
                        else if (value == song.rank) {
                            cell.className = 'normal-column';
                            cell.textContent = value;
                            cell.style.fontWeight = 950;
                            cell.style.fontVariant = 'small-caps';
                        }
                        else if (value == song.tempo) {
                            cell.className = 'normal-column';
                            if (tempoText[value]) {
                                cell.textContent = tempoText[value];
                            }
                        }
                        else {
                            cell.className = 'normal-column';
                        }

                        if (songTitle && song.name === songTitle) {
                            if (!tierlist) {
                                cell.style.fontWeight = "bold";
                            }
                        }
                    }

                    row.appendChild(cell);
                }
            });
            if (tierlist) {
                applyRankColors(row, song.rank, songTitle, song.name);
            }
            table.appendChild(row);
        });
        overlayContent.appendChild(table);
        overlay.style.display = 'flex';
    }
}


function buttonHideOverlay(whichOverlay) {
    if (whichOverlay === 'album') {
        hideAlbumOverlay();
    }
    else if (whichOverlay === 'jukebox') {
        hideJokeboxOverlay();
    }
    else if (whichOverlay === 'database') {
        hideDatabaseOverlay();
    }
}

function hideAlbumOverlay() {
    const overlay = document.getElementById('album-overlay');
    const iframe = overlay.querySelector('iframe');
    if (iframe) {
        iframe.src = '';
    }
    overlay.style.display = 'none';
}



// JUKEBOX
function showJukeboxOverlay() {
    updateJukeboxSongs();
    const overlay = document.getElementById('jukebox-overlay');
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
}

function hideJokeboxOverlay() {
    const overlay = document.getElementById('jukebox-overlay');
    overlay.style.display = 'none';
}

// Arrays to hold selected options
let selectedRanks = [];
let selectedTempos = [];
let selectedDuration = "Any duration";
let selectedPublic = "Any live";
let selectedDate = [];
let rankDefault = "Any rank";
let tempoDefault = "Any tempo";
let durationDefault = "Any duration";
let publicDefault = "Any live";
let dateDefault = "Any date";

if (document.getElementById('jukebox-overlay')) {
    rankDefault = document.getElementById('rankDropdownBtn').textContent;
    tempoDefault = document.getElementById('tempoDropdownBtn').textContent;
    durationDefault = document.getElementById('durationDropdownBtn').textContent;
    publicDefault = document.getElementById('publicDropdownBtn').textContent;
    dateDefault = document.getElementById('dateDropdownBtn').textContent;
}
// Array to hold songs that pass the filter
let matchingSongsList = [];

function updateSelection(input) {
    const dropdownBtn = input.closest('.dropdown').querySelector('.dropbtn');
    const checkboxes = input.closest('.dropdown-content').querySelectorAll('input[type="checkbox"]');
    const radioButtons = input.closest('.dropdown-content').querySelectorAll('input[type="radio"]');

    let selectedOptions = [];

    // Check for checkboxes
    checkboxes.forEach((cb) => {
        if (cb.checked) {
            selectedOptions.push(cb.value);
        }
    });

    // Check for radio buttons
    radioButtons.forEach((rb) => {
        if (rb.checked) {
            selectedOptions.push(rb.value);
        }
    });

    // Update button text with selected options or default message
    if (selectedOptions.length > 0) {
        dropdownBtn.textContent = selectedOptions.join(', ');
    } else {
        dropdownBtn.textContent = dropdownBtn.id.includes("rank") ? rankDefault :
                                dropdownBtn.id.includes("tempo") ? tempoDefault :
                                dropdownBtn.id.includes("duration") ? durationDefault :
                                dropdownBtn.id.includes("public") ? publicDefault : dateDefault;
    }

    // Update selected options based on dropdown
    if (dropdownBtn.id === 'rankDropdownBtn') {
        selectedRanks = updateArray(selectedRanks, input);
    } else if (dropdownBtn.id === 'tempoDropdownBtn') {
        selectedTempos = updateArray(selectedTempos, input);
    } else if (dropdownBtn.id === 'dateDropdownBtn') {
        selectedDate = updateArray(selectedDate, input);
    } else if (dropdownBtn.id === 'durationDropdownBtn') {
        selectedDuration = input.value;
    } else if (dropdownBtn.id === 'publicDropdownBtn') {
        selectedPublic = input.value;
    }

    updateJukeboxSongs();
}

// Helper function to update arrays
function updateArray(array, input) {
    const value = input.value;
    if (input.checked) {
        array.push(value);
    } else {
        array = array.filter(item => item !== value);
    }
    return array;
}

// Helper function to convert song length to minutes
function convertToMinutes(lengthStr) {
    const [minutes, seconds] = lengthStr.split("'").map(Number);
    return minutes + seconds / 60;
}

// Function to update nsongs count and store matching songs
function updateJukeboxSongs() {
    let totalSongs = 0;
    matchingSongsList = [];

    all_albums.forEach(album => {
        const matchingSongs = album.songs.filter(song => {
            const songDuration = convertToMinutes(song.length);

            const matchesRank = selectedRanks.length === 0 || selectedRanks.includes(song.rank);
            const matchesTempo = selectedTempos.length === 0 || selectedTempos.includes(song.tempo);
            const matchesDate = selectedDate.length === 0 || selectedDate.includes(album.date_short.substring(0, 4));
            const matchesDuration = selectedDuration === "Any duration" || selectedDuration === "N'importe" ||
                (selectedDuration === "<10min" && songDuration < 10) ||
                (selectedDuration === ">10min" && songDuration > 10);
            const matchesPublic = selectedPublic === "Any live" || selectedPublic === "N'importe" ||
                (selectedPublic === "Only live show" && album.id.includes('l')) ||
                (selectedPublic === "Que avec public" && album.id.includes('l')) ||
                (selectedPublic === "Only without public" && !album.id.includes('l')) ||
                (selectedPublic === "Que sans public" && !album.id.includes('l'));

            return matchesRank && matchesTempo && matchesDuration && matchesPublic && matchesDate;
        }).map(song => ({
            ...song,
            albumId: album.id,
            albumTitle: album.title,
            albumDate: album.date
        }));

        // Add the modified songs to the global list and update count
        matchingSongsList = matchingSongsList.concat(matchingSongs);
        totalSongs += matchingSongs.length;
    });

    // Update the jukebox-param-nsongs element
    const elements = document.querySelectorAll('#jukebox-nsongs');
    elements.forEach(element => {
        element.textContent = totalSongs;
    });
}


let currentSongIndex = 0;

function getNextSong() {
    if (jukeboxSongsList.length === 0) {
        return;
    }
    if (currentSongIndex === jukeboxSongsList.length - 1)
    {
        addSongToJukebox();
    }
    if (currentSongIndex === jukeboxSongsList.length - 1) {
        currentSongIndex = 0;
    }
    else {
        currentSongIndex++;
    }
    nextSong(currentSongIndex);
    document.getElementById("jukebox-next").style.display = "flex";
    document.getElementById("jukebox-prev").style.display = "flex";
    document.getElementById("jukebox-song").style.width = "100%";
}

function getPrevSong() {
    if (jukeboxSongsList.length === 0) {
        return;
    }
    if (currentSongIndex === 0 && jukeboxSongsList.length > 1) {
        currentSongIndex = jukeboxSongsList.length - 1;
    }
    else if (jukeboxSongsList.length > 1) {
        currentSongIndex--;
    }

    nextSong(currentSongIndex);
}

function addSongToJukebox() {
    if (matchingSongsList.length === 0) {
        return;
    }
    const randomIndex = Math.floor(Math.random() * matchingSongsList.length);
    const randomSong = matchingSongsList[randomIndex];
    jukeboxSongsList.push(randomSong);
}

function nextSong(currentSongIndex) {
    const song = jukeboxSongsList[currentSongIndex];

    // Update song details
    document.querySelector('.jukebox-song-title').textContent = song.name;
    if (tierlist) {
        document.querySelector('.jukebox-song-title').style.color = rankColors[song.rank] ? rankColors[song.rank][1] : '#ffffff';
    }
    else {
        document.querySelector('.jukebox-song-title').style.color = '#FFCC00';
    }
    document.getElementById('song-length').textContent = song.length;
    document.getElementById('song-genre').textContent = song.genre;
    document.getElementById('song-tempo').textContent = song.tempo;
    document.getElementById('song-comment').textContent = song.comment;
    document.getElementById('song-choral').textContent = song.choree;
    document.getElementById('song-album').textContent = song.albumTitle;
    document.getElementById('song-album-date').textContent = song.albumDate;
    if (song.url.includes('twitch')) {
        document.getElementById('jukebox-song-album-detail').onclick = (event) => showAlbumOverlay(event, song.albumId, song.name, getTwTime(extractTwTimestamp(song.url)));
    }
    else {
        document.getElementById('jukebox-song-album-detail').onclick = (event) => showAlbumOverlay(event, song.albumId, song.name);
    }
    document.getElementById('jukebox-song-details').style.display = 'grid';
    document.getElementById('jukebox-song-album-detail').style.display = 'flex';
    const img = document.getElementById('jukebox-img');
    if (img) img.remove();
    const playbtn = document.getElementById('jukebox-play-button');
    if (playbtn) playbtn.remove();

    // Create player
    document.getElementById('jukebox-embed-container').innerHTML = '';

    const embedContainer = document.getElementById('jukebox-embed-container');
    if (song.url.includes('twitch')) {
        const twitchEmbedDiv = document.createElement('div');
        twitchEmbedDiv.id = 'jukebox-twitch-embed';
        twitchEmbedDiv.className = 'jukebox-twitch-embed';
        embedContainer.appendChild(twitchEmbedDiv);

        // const jukeboxTwitchScript = document.createElement('script');
        // jukeboxTwitchScript.src = "https://player.twitch.tv/js/embed/v1.js";
        // jukeboxTwitchScript.onload = function() {
        //     const jukeboxTwitchPlayer = new Twitch.Player("jukebox-twitch-embed", {
        //         video: extractTwVideoId(song.url),
        //         width: twitchEmbedDiv.offsetWidth,
        //         height: twitchEmbedDiv.offsetWidth * 9 / 16,
        //         time: getTwTime(extractTwTimestamp(song.url))
        //     });
        //     window.jukeboxTwitchPlayer = jukeboxTwitchPlayer;
        // };
        // embedContainer.appendChild(jukeboxTwitchScript);
        const jukeboxTwitchScript = document.createElement('script');
        jukeboxTwitchScript.src = "https://player.twitch.tv/js/embed/v1.js";
        jukeboxTwitchScript.onload = function() {
            const jukeboxTwitchPlayer = new Twitch.Player("jukebox-twitch-embed", {
                video: extractTwVideoId(song.url),
                autoplay: false,
                width: twitchEmbedDiv.offsetWidth,
                height: twitchEmbedDiv.offsetWidth * 9 / 16,
                time: getTwTime(extractTwTimestamp(song.url))
            });
            window.jukeboxTwitchPlayer = jukeboxTwitchPlayer;
        };
        jukeboxTwitchScript.onerror = function () {
            console.warn("Failed to load Twitch script, trying local fallback...");
            const jukeboxFallbackScript = document.createElement('script');
            jukeboxFallbackScript.src = jsPath + "/twitch-embed.js";
            jukeboxFallbackScript.onload = function () {
                console.log("Local Twitch fallback loaded.");

                const jukeboxTwitchPlayer = new Twitch.Player("jukebox-twitch-embed", {
                    video: extractTwVideoId(song.url),
                    autoplay: false,
                    width: twitchEmbedDiv.offsetWidth,
                    height: twitchEmbedDiv.offsetWidth * 9 / 16,
                    time: getTwTime(extractTwTimestamp(song.url))
                });
                window.jukeboxTwitchPlayer = jukeboxTwitchPlayer;
            };

            jukeboxFallbackScript.onerror = function () {
                console.error("Local fallback script also failed. Giving up.");
                document.getElementById("twitch-embed").innerText =
                    "Twitch video unavailable. Please use direclty the URL from the song name or try again later.";
            };
            document.body.appendChild(jukeboxFallbackScript);
        };
        embedContainer.appendChild(jukeboxTwitchScript);
    } else {
        const videoId = extractYtVideoId(song.url);
        const iframe = document.createElement('iframe');
        iframe.className = 'jukebox-youtube-iframe';
        iframe.id = 'jukebox-youtube-embed';
        iframe.src = `https://www.youtube.com/embed/${extractYtVideoId(song.url)}?&amp;start=${extractYtTimestamp(song.url)};&autoplay=1`;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        embedContainer.appendChild(iframe);
        window.jukeboxYoutubePlayer = iframe;
    }
}



// DATABASE SEARCHER

const columnTranslater = {
    "Titre<br>(avec lien cliquable)" : "name",
    "Title<br>(with clickable link)" : "name",
    "Rank" : "rank",
    "Genre" : "genre",
    "Tempo" : "tempo",
    "Durée" : "length",
    "Length" : "length",
    "Commentaire" : "comment",
    "Comment" : "comment",
    "Chant" : "choree",
    "Choral" : "choree",
    "Date" : "date",
    "Titre de live" : "albumTitle",
    "Live title" : "albumTitle"
};


function createTableHeaders() {
    const thead = document.querySelector('#songsTable thead');
    thead.innerHTML = '';

    const headerRow = document.createElement('tr');

    databaseTableHeader.forEach(header => {
        const th = document.createElement('th');
        th.className = 'normal-column';
        th.dataset.column = columnTranslater[header];
        th.dataset.order = 'desc';

        // Set inner HTML to include the text and arrow
        th.innerHTML = `${header} <span class="arrow">&#9660;</span>`;
        th.addEventListener('click', () => sortData(header));

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
}

if (document.querySelector('#songsTable thead')) {
    createTableHeaders();
}

function showDatabaseOverlay() {
    fill_songDatabase();
    renderTable(songDatabase);
    const overlay = document.getElementById('database-overlay');
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
}

function hideDatabaseOverlay() {
    const overlay = document.getElementById('database-overlay');
    overlay.style.display = 'none';
    songDatabase = [];
    renderTable([]);
    document.getElementById('songsTable').style.display = 'none';
    searchCount.textContent = '';
    document.getElementById('searchBar').value = '';
}

let songDatabase = [];
let allSongs = [];

function fill_songDatabase() {
    songDatabase = [];
    allSongs = [];

    all_albums.forEach(album => {
        album.songs.forEach(song => {
            song.albumId = album.id;
            song.date = album.date_short;
            song.albumTitle = album.title;

            songDatabase.push(song);
            allSongs.push(song);
        });
    });
}

function renderTable(data = []) {
    const tbody = document.querySelector('#songsTable tbody');
    tbody.innerHTML = '';

    data.forEach(song => {
       createSongRow(song, tbody);
    });
}

// Helper function to create and append a song row
function createSongRow(song, tbody) {
    const row = document.createElement('tr');

    Object.values(song).forEach(value => {
        if (value !== song.url && value !== song.albumId &&
            (tierlist || (value !== song.rank && value !== song.comment))) {
            const cell = document.createElement('td');

            // If the value is the song name, make it clickable with a link to the URL
            if (value === song.name) {
                cell.className = song.name.length > 40 ? 'title-break-column' : 'normal-column';

                const paragraph = document.createElement('p');

                const link = document.createElement('a');
                if (tierlist) {
                    link.className = 'custom-link';
                }
                else {
                    link.className = 'custom-link-notierlist';
                }
                link.innerHTML = `<u>${song.name}</u>`;
                if (song.url.includes('twitch')) {
                    link.onclick = function(event) {
                        showAlbumOverlay(event, song.albumId, song.name, getTwTime(extractTwTimestamp(song.url)));
                    };
                }
                else {
                    link.onclick = function(event) {
                        showAlbumOverlay(event, song.albumId, song.name);
                    };
                }

                if (tierlist) {
                    link.style.color = rankColors[song.rank] ? rankColors[song.rank][0] : '#ffffff';
                }

                if (tierlist) {
                    link.addEventListener('mouseover', function () {
                        link.style.color = rankColors[song.rank] ? rankColors[song.rank][1] : '#ffffff';
                    });
                    link.addEventListener('mouseout', function () {
                        link.style.color = rankColors[song.rank] ? rankColors[song.rank][0] : '#ffffff';
                    });
                }

                paragraph.appendChild(link);
                cell.appendChild(paragraph);
            } else {
                cell.textContent = value;
                if (value === song.comment || value === song.albumTitle) {
                    cell.className = 'break-column-center';
                } else if (value === song.choree || value === song.genre) {
                    cell.className = value.length > 40 ? 'break-column-center' : 'normal-column';
                } else if (value === song.rank) {
                    cell.className = 'normal-column';
                    cell.style.fontWeight = 950;
                    cell.style.fontVariant = 'small-caps';
                } else if (value === song.tempo && tempoText[value]) {
                    cell.textContent = tempoText[value];
                    cell.className = 'normal-column';
                } else {
                    cell.className = 'normal-column';
                }
            }

            row.appendChild(cell);
        }
    });

    if (tierlist) {
        applyRankColors(row, song.rank);
    }
    tbody.appendChild(row);
}


let sortOrder = {};

function sortData(column) {
    const order = sortOrder[column] === 'asc' ? 'desc' : 'asc';
    sortOrder[column] = order;

    songDatabase.sort((a, b) => {
        let valA = a[column].toUpperCase();
        let valB = b[column].toUpperCase();

        if (column === 'rank') {
            valA = rankOrder.indexOf(valA);
            valB = rankOrder.indexOf(valB);
        }
        else if (column === 'length') {
            valA = convertToMinutes(valA);
            valB = convertToMinutes(valB);
        }

        if (valA < valB) {
            return order === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    renderTable(songDatabase);

    // Update arrow direction
    const headers = document.querySelectorAll('#songsTable th');
    headers.forEach(header => {
        const arrow = header.querySelector('.arrow');
        if (header.dataset.column === column) {
            arrow.classList.remove('asc', 'desc');
            arrow.classList.add(order);
        } else {
            arrow.classList.remove('asc', 'desc');
        }
    });
}

document.querySelectorAll('.sort').forEach(button => {
    button.addEventListener('click', () => {
        const sortBy = button.getAttribute('data-sort');
        sortData(sortBy);
    });
});

const headers = document.querySelectorAll('#songsTable th');
headers.forEach(header => {
    header.addEventListener('click', () => {
        const column = header.dataset.column;
        sortData(column);
    });
});

const searchBar = document.getElementById('searchBar');
if (searchBar) {
    searchBar.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            handleSearch(event.target.value);
        }
    });
}

function handleSearch(query) {
    query = query.toLowerCase();
    const searchCount = document.getElementById('searchCount');
    document.getElementById('songsTable').style.display = 'block';
    songDatabase = allSongs.filter(song =>
        song.name.toLowerCase().includes(query) ||
        song.rank.toLowerCase().includes(query) ||
        song.genre.toLowerCase().includes(query) ||
        song.tempo.toLowerCase().includes(query) ||
        song.length.toLowerCase().includes(query) ||
        song.comment.toLowerCase().includes(query) ||
        song.choree.toLowerCase().includes(query) ||
        song.date.toLowerCase().includes(query) ||
        song.albumTitle.toLowerCase().includes(query)
    );
    renderTable(songDatabase);
    if (songDatabase.length === 0) {
        searchCount.textContent = 'No songs found';
    } else if (songDatabase.length === 1) {
        searchCount.textContent = 'Found 1 song';
    } else {
        searchCount.textContent = `Found ${songDatabase.length} songs`;
    }
}


// LOOPLE SCRIPT

// Get the current date in Tokyo timezone
function getCurrentLocalDate(withTime = false) {
    const options = { timeZone: 'Etc/GMT+6', year: 'numeric', month: '2-digit', day: '2-digit' };
    if (withTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
    }
    const date = new Date().toLocaleDateString('en-US', options);
    return date.replace(/\//g, '-');
}

function getSeedFromDate(dateString) {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        const chr = dateString.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

function getRandomFromList(list, withTime = false) {
    const index = getSeedFromDate(getCurrentLocalDate(withTime)) % list.length;
    return list[index];
}

function getRandomLoopleSong() {
    songs_title = [];
    all_albums.forEach(album => {
        album.songs.forEach(song => {
            if (!song.name.toLowerCase().includes("(cut)") && !album.id.includes('t')) {
            // if (!song.name.toLowerCase().includes("(cut)") && !album.id.includes('t') && (["S", "A+"].includes(song.rank))) {
                songs_title.push([song.name, album.title]);
            }
        });
    });
    console.log(getCurrentLocalDate());
    loople_song = getRandomFromList(songs_title, isEndlessMode());
    if (!isEndlessMode()) {
        // At launch, manually select some songs so it's not so difficult :)
        if (getCurrentLocalDate() === "07-13-2025") {
            loople_song = [atob("QWZ0ZXIgdGhlIHN0b3Jt"), atob("U1VSUFJJU0UgU1RSRUFN")];
        }
        else if (getCurrentLocalDate() === "07-14-2025") {
            loople_song = [atob("U3RvbmVk"), atob("TElWRSBTVFJFQU0gSU4gWU9VUiBGQUNFIDQuMTQuMjAxOA==")];
        }
        else if (getCurrentLocalDate() === "07-15-2025") {
            loople_song = [atob("LSBHZXQgdXA="), atob("U1RSRUFNIElTIExJRkU=")];
        }
        else if (getCurrentLocalDate() === "07-16-2025") {
            loople_song = [atob("LSBCcmVhdGhl"), atob("SSBET04nVCBXQU5UIFRPIFNUUkVBTSBUT0RBWQ==")];
        }
        else if (getCurrentLocalDate() === "07-17-2025") {
            loople_song = [atob("QmVsb25n"), atob("Qk9SRUQgQ0VSVElGSUVEOiBFUElTT0RFIDMgKEZVTEwgU1RSRUFNKQ==")];
        }
        else if (getCurrentLocalDate() === "07-18-2025") {
            loople_song = [atob("LSBLZWVwIHdvcmtpbmcgJiBmbHlpbmc="), atob("V0UgQVJFIFNUUkVBTUlORw==")];
        }
        else if (getCurrentLocalDate() === "07-19-2025") {
            loople_song = [atob("RmlyZWZpZ2h0ZXJz"), atob("VEhJUyBJUyBBIExJVkUgU1RSRUFN")];
        }
        else if (getCurrentLocalDate() === "07-20-2025") {
            loople_song = [atob("RW50aXRsZW1lbnQ="), atob("U1VOREFZIEZVTkRBWQ==")];
        }
    }
    all_albums.forEach(album => {
        album.songs.forEach(song => {
            if (song.name === loople_song[0] && album.title === loople_song[1]) {
                window.loople_song = {
                    ...song,
                    albumId: album.id,
                    albumTitle: album.title,
                    albumDate: album.date,
                    date_short_int: album.date_short.replace(/-/g, "")
                };
            }
        });
    });
}


function updateSongGame() {
    checkNewDay();

    activateModeButton();

    getRandomLoopleSong();

    if (localStorage.getItem('hideInfoOnStart') === null) {
        toggleLoopleInfo();
    }

    songs_title = [];
    all_albums.forEach(album => {
        album.songs.forEach(song => {
            songs_title.push([song.name, album.title]);
        });
    });

    const input = document.getElementById('loople-song-guess');
    const suggestionsDiv = document.getElementById('loople-suggestions');

    input.addEventListener('input', function () {
        suggestionsDiv.style.border = "1px solid #ccc";
        const query = this.value.toLowerCase();
        suggestionsDiv.innerHTML = '';

        if (!query) return;
        const matches = songs_title.filter(song_info => {
            return song_info[0].toLowerCase().includes(query)
        });

        if (matches.length === 0) {
            const div = document.createElement('div');
            div.innerHTML = `<span class="autocomplete-song-name">No songs found</span>`;
            div.classList.add('autocomplete-item');
            suggestionsDiv.appendChild(div);
        }

        matches.forEach(song_info => {
            const div = document.createElement('div');
            div.innerHTML = `<span class="autocomplete-song-name">${song_info[0]}</span> <span class="autocomplete-album-name"> (from ${song_info[1]})</span>`;
            div.classList.add('autocomplete-item');

            div.addEventListener('click', () => {
                input.value = song_info[0] + " (from " + song_info[1] + ")";
                suggestionsDiv.innerHTML = '';
                makeGuess(song_info);
            });

            suggestionsDiv.appendChild(div);
        });
    });

    // Hide suggestions if clicked outside
    document.addEventListener('click', (e) => {
    if (e.target !== input) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.border = "0px";
    }
    });

    enablePlayButtons();

    if (!isEndlessMode()) {
        const gameStateData = gameState();
        gameStateData.guessedSongs.forEach((song, index) => {
            if (song[0] === "skip" && song[1] === "skip") {
                skipLoopleExtract(onlyDisplay = true, overwriteGuessNumber = index+1);
            } else {
                makeGuess(song, onlyDisplay = true, overwriteGuessNumber = index+1);
            }
        });
    }
}

function enablePlayButtons(win = false) {
    if (win) {
        buttonsToToggle = 5;
    }
    else {
        buttonsToToggle = getGuessCount()
    }
    if (buttonsToToggle > 0) {
        for (let i = 0; i <= buttonsToToggle; i++) {
            const playButton = document.getElementById(`loople-play${i}`);
            if (playButton) {
                clearAllExtractPlayers();

                if (playButton.className === 'loople-play-disabled') {
                    playButton.addEventListener('click', () => {
                        playExtract(playButton, i * 20);
                    });
                }
                playButton.disabled = false;
                playButton.className = 'loople-play';
                playButton.innerHTML = `<img src="svg/ui/play-extract.svg" alt="Settings" class="jukebox-prev-text" id="loople-play-img${i}"></img>`;
                playButton.style.cursor = 'pointer';
                playButton.style.border = '2px solid #fff';
                if (i !== 0) {
                    playButton.classList.add('appears');
                }
            }
            const playButtonText = document.getElementById(`loople-play-text${i}`);
            if (playButtonText) {
                playButtonText.className = 'loople-play-text';
            }
        }
    }
}

function clearAllExtractPlayers() {
    document.querySelectorAll('.loople-clip').forEach(iframe => {
        iframe.remove();
    });
}


let ytApiReady = false;
const ytApiQueue = [];
(function loadYTApi(){
    if (window.YT) { ytApiReady = true; return; }
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
})();
window.onYouTubeIframeAPIReady = () => {
    ytApiReady = true;
    ytApiQueue.forEach(fn => fn());
    ytApiQueue.length = 0;
};

function playExtract(looplePlay, percentFromStart = 0) {

    const videoId  = extractYtVideoId(loople_song.url);
    const startSec = Math.floor(
        parseInt(extractYtTimestamp(loople_song.url)) +
        getYtLength(loople_song.length) * percentFromStart / 100
    );
    const endSec   = startSec + 15;

    const clip = document.createElement('div');
    clip.className = 'loople-clip';
    const computedStyle = window.getComputedStyle(looplePlay);
    clip.style.width = computedStyle.getPropertyValue('width');
    clip.style.height = computedStyle.getPropertyValue('height');
    clip.style.position = 'relative';

    looplePlay.appendChild(clip);

    clip.id = looplePlay.id;
    const idNumber = looplePlay.id.match(/\d+$/)[0];
    looplePlayImg = document.getElementById(`loople-play-img${idNumber}`);
    if (looplePlayImg) {
        looplePlayImg.style.display = 'none';
    }
    looplePlay.style.cursor = 'initial';
    looplePlay.style.border = '0px';
    looplePlay.disabled = true;


    const mountPlayer = () => {
        const holder = document.createElement('div');
        const iframeId = `yt-${videoId}-${Date.now()}`;
        holder.id = iframeId;
        clip.appendChild(holder);

        const player = new YT.Player(iframeId, {
        width: '200%',
        height:'200%',
        videoId: videoId,
        playerVars:{
            start: startSec,
            end:   endSec,
            autoplay: 1,
            playsinline: 1,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            showinfo: 1,
            fs: 0,
            cc_load_policy: 0,
            iv_load_policy: 3,
            autohide: 1,
            playsinline: 1,
            disablekb: 1,
        },
        events:{
            onReady: e => {
            e.target.setVolume(100);
            e.target.playVideo();
            },
            onStateChange: e => {
            if (e.data === YT.PlayerState.ENDED) cleanup();
            }
        }
        });

        /* Fallback – in case onStateChange never fires */
        const safety = setTimeout(cleanup, 17_000);

        function cleanup(){
        clearTimeout(safety);
        player.destroy();
        looplePlay.innerHTML =
            `<img src="svg/ui/play-extract.svg" alt="Settings" class="jukebox-prev-text" id="loople-play-img${idNumber}"></img>`;
        looplePlay.style.cursor = 'pointer';
            looplePlay.style.border = '2px solid #fff';
            looplePlay.disabled = false;
        }
    };

    if (ytApiReady) mountPlayer();
    else ytApiQueue.push(mountPlayer);
}



function playClip(iframe, videoId, songStart, songDuration, percentFromStart = 0, clipLen = 10) {
    songStart = parseInt(songStart);
    const startSec = Math.floor(songStart + (songDuration) * percentFromStart/100);
    const endSec   = startSec + clipLen;
    iframe.src =
      `https://www.youtube.com/embed/${videoId}` +
      `?start=${startSec}&end=${endSec}` +
      `&autoplay=1&controls=1&playsinline=1&rel=0`;
}


function skipLoopleExtract(onlyDisplay = false, overwriteGuessNumber = false) {
    if (!onlyDisplay && !isEndlessMode()) {
        addGuessedSong(["skip", "skip"]);
    }
    if (isEndlessMode()) {
        increaseEndlessModeGuessCount();
    }

    enablePlayButtons();

    if (getGuessCount() >= 4) {
        document.getElementById('loople-skip-button').style.display = 'none';
    }

    const guessedContainer = document.getElementById('loople-guessed');

    if (overwriteGuessNumber !== false) {
        guess_count = overwriteGuessNumber;
    } else {
        guess_count = getGuessCount();
    }

    const songBox = document.createElement('div');
    songBox.className = 'loople-song-box';
    songBox.innerHTML = `
        <div class="loople-song-header-skip" style="cursor: initial;">
        <div class="loople-song-name">Skipped</div>
        <div class="guess-number">Guess #${guess_count}</div>
        </div>`
    guessedContainer.prepend(songBox);
    songBox.classList.add('fade-in');
    songBox.addEventListener('animationend', () => {
        songBox.classList.remove('fade-in');
      });
}


function makeGuess(song, onlyDisplay = false, overwriteGuessNumber = false) {
    win = false;

    if (!onlyDisplay && !isEndlessMode()) {
        addGuessedSong(song);
    }
    if (isEndlessMode()) {
        increaseEndlessModeGuessCount();
    }

    const input = document.getElementById('loople-song-guess');
    input.value = ""

    if (song.length == 0) {
        win = "concede";
        song = [loople_song.name, loople_song.albumTitle];
    }
    else {
        if (song[0] === loople_song.name && song[1] === loople_song.albumTitle) {
            win = "gg";
        }
    }

    if (getGuessCount() > 0) {
        document.getElementById('loople-guessed').style.marginBottom = 0;
    }

    if (getGuessCount() >= 4) {
        document.getElementById('loople-skip-button').style.display = 'none';
    }

    if (overwriteGuessNumber !== false) {
        guess_count = overwriteGuessNumber;
    } else {
        guess_count = getGuessCount();
    }

    displayGuessTable(song, guess_count, win);
    enablePlayButtons(win);

    // if win, lock the input
    if (win === "gg") {
        const input = document.getElementById('loople-song-guess');
        input.disabled = true;
        input.style.backgroundColor = '#d4edda'; // light green background
        input.style.color = '#155724'; // dark green text
        input.placeholder = "You guessed it!";
        recordGame(getGuessCount());
    } else if (win === "concede") {
        const input = document.getElementById('loople-song-guess');
        input.disabled = true;
        input.style.backgroundColor = '#ddd'; // light red background
        input.style.color = '#313338'; // dark red text
        input.placeholder = "Better luck next time!";
        recordGame(getGuessCount(), true);
    } else {
        const input = document.getElementById('loople-song-guess');
        input.disabled = false;
        input.style.backgroundColor = ''; // reset background
        input.style.color = ''; // reset text color
        if (getGuessCount() >= 10) {
            input.placeholder = "You can do it!";
        }
        else if (getGuessCount() >= 5) {
            input.placeholder = "Try again!";
        }
        else {
            input.placeholder = "Listen to the new extract and try again!";
        }
    }

    if (win) {
        document.getElementById('loople-concede-button').style.display = 'none';
        document.getElementById('loople-skip-button').style.display = 'none';

        if (isEndlessMode()) {
            document.getElementById('loople-endless-next-button').style.display = 'flex';
        } else {
            document.getElementById('loople-stats-button').hidden = false;
        }

        const state = gameState();

        if (!state.end || isEndlessMode()) {
            showWinOverlay(win);
        }

        state.end = true;
        saveGameState(state);

        document.getElementById('loople-endless-mode-button').style.display = 'flex';
        intro_text = document.getElementById('loople-intro-text');
        if (intro_text) {
            intro_text.innerHTML = '<span class="bold">Endless Mode</span> unlocked!<br>Click on the <img src="svg/ui/game.svg" class="loople-song-detail-icon-text" alt="Play"> <span class="bold">game mode button</span> to play!';
        }

    }
}

function loopleYoutubePlayerSetTime(time) {
    if (window.loopleYoutubePlayer) {
        window.loopleYoutubePlayer.src = `https://www.youtube.com/embed/${extractYtVideoId(loople_song.url)}?start=${time}&autoplay=1&controls=1&playsinline=1&rel=0`;
    }
}


function showWinOverlay(win) {
    const overlay = document.getElementById('loople-overlay-win');
    const content = document.getElementById('loople-overlay-info-win');
    const videoBox = document.getElementById('loople-overlay-video-win');
    const ctrlBox  = document.getElementById('loople-overlay-controls-win');

    content.innerHTML = '';
    videoBox.innerHTML = '';
    ctrlBox.innerHTML  = '';

    const title = document.createElement('div');
    title.innerHTML = "Today's Loople Song is:";
    content.appendChild(title);

    loople_song_header = "loople-song-header-overlay";
    loople_song_name = "loople-song-name-win";
    guess_number = "guess-number-overlay";

    const songBox = document.createElement('div');
    songBox.className = 'loople-song-box-win';
    songBox.innerHTML = `
        <div class="${loople_song_header}" style="cursor: initial;">
        <div class="${loople_song_name}">${loople_song.name}</div>
        <div class="${guess_number}">From ${loople_song.albumTitle}</div>
        </div>`
    content.appendChild(songBox);

    const iframe = document.createElement('iframe');
    iframe.className = 'loople-youtube-iframe-win';
    iframe.allowFullscreen = true;
    videoBox.appendChild(iframe);
    window.loopleYoutubePlayer = iframe;

    if (win === "gg") {
        percentFromStart = (getGuessCount(true) - 1) * 20;
    } else {
        percentFromStart = getGuessCount(true) * 20;
    }
    const videoId = extractYtVideoId(loople_song.url);
    playClip(
      iframe,
      videoId,
      extractYtTimestamp(loople_song.url),
      getYtLength(loople_song.length),
      percentFromStart,
      getYtLength(loople_song.length)
    );

    buildOverlayControls(ctrlBox);

    overlay.hidden = false;
}


function buildOverlayControls(ctrlContainer) {
    const baseTimestamp = parseInt(extractYtTimestamp(loople_song.url));
    const songLen       = parseInt(getYtLength(loople_song.length));
    const percents      = [0, 20, 40, 60, 80];

    const controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'loople-controls';
    controlsWrapper.id = 'loople-controls';

    percents.forEach((p, idx) => {
        const start = Math.floor(baseTimestamp + (songLen * p) / 100);

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
        <div class="loople-play" onclick="loopleYoutubePlayerSetTime(${start})">
            <img src="svg/ui/play-extract.svg" alt="Play ${p}%" class="jukebox-prev-text">
        </div>
        <div class="loople-play-text">Clip ${p/20 +1}</div>
        `;

        controlsWrapper.appendChild(wrapper);
    });
    ctrlContainer.appendChild(controlsWrapper);
}

function closeLoopleOverlayWin() {
    const overlay   = document.getElementById('loople-overlay-win');
    const videoBox  = document.getElementById('loople-overlay-video-win');

    overlay.hidden = true;

    videoBox.innerHTML = '';
    window.loopleYoutubePlayer = null;
}

function closeLoopleOverlayWinIfOutside(event) {
    const overlay_content = document.getElementById('loople-overlay-content-win');
    if (!overlay_content.contains(event.target)) {
        closeLoopleOverlayWin();
    }
}


function colorStrCorrectOverlap(str, loople_str) {
    str = str.replace(/[.,!?;:()]/g, '');
    loople_str = loople_str.replace(/[.,!?;:()]/g, '');

    const loople_song_str = new Set(loople_str.toLowerCase().split(/\s+/));

    const new_str = str.split(/\s+/)
        .map(word => {
            return loople_song_str.has(word.toLowerCase())
                ? `<span class="green-text">${word}</span>`
                : word;
        })
        .join(' ');

    return new_str;
}


function displayGuessTable(song, guessNumber, win = false) {
    all_albums.forEach(album => {
        album.songs.forEach(s => {
            if (s.name === song[0] && album.title === song[1]) {
                song = s;
                song.albumTitle = album.title;
                song.date = album.date;
                song.albumId = album.id;
                song_date_short_int = parseInt(album.date_short.replace(/-/g, ''));
                return;
            }
        });
    });

    if (win === "gg") {
        loople_song_header = "loople-song-header-win";
        guess_number = "guess-number-win";
        song_name = "loople-song-name-win";
    }
    else if (win === "concede") {
        loople_song_header = "loople-song-header-overlay";
        guess_number = "guess-number-win";
        song_name = "loople-song-name-win";
    } else {
        loople_song_header = "loople-song-header";
        guess_number = "guess-number";
        song_name = "loople-song-name";
    }

    const guessedContainer = document.getElementById('loople-guessed');

    const songBox = document.createElement('div');
    songBox.className = 'loople-song-box';
    songBox.setAttribute('onclick', `showAlbumOverlay(event, '${song.albumId || ''}', "${song.name}")`);

    if (song.albumId.includes('t')) {
        media_str = "Twitch";
    } else {
        media_str = "YouTube";
    }
    if (!win) {
        if (loople_song.albumId.includes('t')) {
            if (media_str === "Twitch") {
                media_str = `<span class='green-text'>${media_str}</span>`;
            }
        } else {
            if (media_str === "YouTube") {
                media_str = `<span class='green-text'>${media_str}</span>`;
            }
        }
    }

    if (song.albumId.includes('l')) {
        public_str = "In public";
    } else {
        public_str = "No public";
    }
    if (!win) {
        if (loople_song.albumId.includes('l')) {
            if (public_str === "In public") {
                public_str = `<span class='green-text'>${public_str}</span>`;
            }
        } else {
            if (public_str === "No public") {
                public_str = `<span class='green-text'>${public_str}</span>`;
            }
        }
    }

    if (loople_song.date_short_int > song_date_short_int) {
        date_str = `<span><span>${song.date}</span><span class='orange-text'> ▲</span></span>`;
    }
    else if ( loople_song.date_short_int < song_date_short_int) {
        date_str = `<span><span>${song.date}</span><span class='orange-text'> ▼</span></span>`;

    }
    else if (!win) {
        date_str = `<span class='green-text'>${song.date}</span>`;
    }
    else {
        date_str = song.date;
    }


    if (getYtLength(loople_song.length) > getYtLength(song.length)) {
        length_str = `<span><span>${song.length}</span><span class='orange-text'> ▲</span></span>`;
    } else if (getYtLength(loople_song.length) < getYtLength(song.length)) {
        length_str = `<span><span>${song.length}</span><span class='orange-text'> ▼</span></span>`;
    }
    else if (!win){
        length_str = `<span class='green-text'>${song.length}</span>`;
    }
    else {
        length_str = song.length;
    }

    if (!win)  {
        genre_str = colorStrCorrectOverlap(song.genre, loople_song.genre);
        tempo_str = colorStrCorrectOverlap(song.tempo, loople_song.tempo);
        choree_str = colorStrCorrectOverlap(song.choree, loople_song.choree);
        albumTitle_str = colorStrCorrectOverlap(song.albumTitle, loople_song.albumTitle);
        name_str = colorStrCorrectOverlap(song.name, loople_song.name);
    }
    else {
        genre_str = song.genre;
        tempo_str = song.tempo;
        choree_str = song.choree;
        albumTitle_str = song.albumTitle;
        name_str = song.name;
    }

    if (win === "concede") {
        guess_txt = "Conceded";
    } else {
        guess_txt = `Guess #${guessNumber}`;
    }

    songBox.innerHTML = `
      <div class="${loople_song_header}">
        <div class="${song_name}"><span>${name_str}</span></div>
        <div class="${guess_number}">${guess_txt}</div>
      </div>

      <div class="loople-song-details-grid">
        <div class="loople-song-line-grid">
        <span class="loople-song-detail"><img src="svg/songinfo/genre.svg" class="loople-song-detail-icon" alt="Genre"><span class="loople-song-detail-text">${genre_str}</span></span>
          <span class="loople-song-detail"><img src="svg/songinfo/length.svg" class="loople-song-detail-icon" alt="Length">${length_str}</span>
        </div>
        <div class="loople-song-line-grid">
        <span class="loople-song-detail"><img src="svg/songinfo/choree.svg" class="loople-song-detail-icon" alt="Choree"><span class="loople-song-detail-text">${choree_str}</span></span>
          <span class="loople-song-detail"><img src="svg/songinfo/tempo.svg" class="loople-song-detail-icon" alt="Tempo"><span>${tempo_str}</span></span>
        </div>

        <div class="loople-album-info-separator"></div>

        <div class="loople-song-line-grid">
          <span class="loople-song-detail">
            <img src="svg/songinfo/stream-title.svg" class="loople-song-detail-icon" alt="Title"><span>
            ${albumTitle_str}</span>
          </span>
          <span class="loople-song-detail">
            <img src="svg/songinfo/media.svg" class="loople-song-detail-icon" alt="Media"><span>${media_str}</span></span>
        </div>

        <div class="loople-song-line-grid">
          <span class="loople-song-detail">
            <img src="svg/songinfo/date.svg" class="loople-song-detail-icon" alt="Date"><span>${date_str}</span></span>
          <span class="loople-song-detail">
            <img src="svg/songinfo/live.svg" class="loople-song-detail-icon" alt="Public"><span>${public_str}</span></span>
        </div>
      </div>
    `;

    songBox.classList.add('fade-in');
    guessedContainer.prepend(songBox);

    songBox.addEventListener('animationend', () => {
      songBox.classList.remove('fade-in');
    });

}

function triggerConcede() {
    makeGuess([]);
    toggleConcedeConfirmation();
}


function toggleLoopleInfo() {
    const overlay = document.getElementById('loople-info-overlay');
    if (overlay.style.display === 'none' || !overlay.style.display) {
        overlay.style.display = 'flex';
        if (localStorage.getItem('hideInfoOnStart') === 'true') {
            document.getElementById('loople-hide-info').style.display = 'none';
        }
        next_song_info = document.getElementById('timer-next-song');
        const currentTime = new Date(getCurrentLocalDate(true));
        const midnight = new Date(currentTime);
        midnight.setHours(24, 0, 0, 0);

        const timeRemaining = midnight - currentTime;
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        if (hours <= 0) {
            next_song_info.innerHTML = `${minutes} minutes`;
        } else {
            next_song_info.innerHTML = `${hours}h ${minutes}m`;
        }
    } else {
        overlay.style.display = 'none';
    }
}

function closeLoopleInfoIfOutside(event) {
    const content = document.getElementById('loople-info-content');
    if (!content.contains(event.target)) {
        toggleLoopleInfo();
    }
}

function toggleHideInfo() {
    toggleLoopleInfo();
    localStorage.setItem('hideInfoOnStart', true);
}


function toggleConcedeConfirmation() {
    const overlay = document.getElementById('loople-concede-overlay');
    if (overlay.style.display === 'none' || !overlay.style.display) {
        overlay.style.display = 'flex';
        }
    else {
        overlay.style.display = 'none';
    }
}

function closeConcedeConfirmationIfOutside(event) {
    const content = document.getElementById('loople-concede-content');
    if (!content.contains(event.target)) {
        toggleConcedeConfirmation();
    }
}



function toggleStats() {
    const overlay = document.getElementById('loople-stats-overlay');
    if (overlay.hidden || overlay.style.display === 'none') {
        overlay.style.display = 'flex';
        overlay.hidden = false;
        const stats = loadStats();
        const statsContent = document.getElementById('loople-stats-overlay-text');
        statsContent.innerHTML = '';

        if (stats.wins > 1) {
            win_s = "s";
        } else {
            win_s = "";
        }
        if (stats.totalGuess > 1) {
            totalGuess_s = "es";
        } else {
            totalGuess_s = "";
        }
        if (stats.totalSkips > 1) {
            totalSkips_s = "s";
        } else {
            totalSkips_s = "";
        }

        statsContent.innerHTML = `
        <div class="loople-stats-item"><span>${stats.played}</span><span>Played</span></div>
        <div class="loople-stats-item"><span>${stats.wins}</span><span>Win${win_s}</span></div>
        `

        if (stats.wins > 0) {
            const winrate = ((stats.wins / stats.played) * 100).toFixed(2);
            statsContent.innerHTML += `<div class="loople-stats-item"><span>${winrate} %</span><span>Winrate</span></div>`;
        } else {
            statsContent.innerHTML += `<div class="loople-stats-item"><span>0 %</span><span>Winrate</span></div>`;
        }

        statsContent.innerHTML += `
        <div class="loople-stats-item"><span>${stats.totalGuess}</span><span>Total Guess${totalGuess_s}</span></div>
        <div class="loople-stats-item"><span>${stats.totalSkips}</span><span>Total Skip${totalSkips_s}</span></div>
        `;

        if (stats.wins > 0) {
            statsContent.innerHTML += `<div class="loople-stats-item"><span>${(stats.winguesses / stats.wins).toFixed(2)}</span><span>Average Guesses + Skips per Win</span></div>`;
        } else {
            statsContent.innerHTML += `<div class="loople-stats-item"><span>0</span><span>Average Guesses + Skips per Win</span></div>`;
        }


    } else {
        overlay.hidden = true;
    }
}

function closeLoopleStatsOverlayIfOutside(event) {
    const content = document.getElementById('loople-stats-overlay-content');
    if (!content.contains(event.target)) {
        const overlay = document.getElementById('loople-stats-overlay');
        overlay.hidden = true;
    }
}


function activateModeButton() {
    const state = gameState();
    if (state.end) {
        document.getElementById('loople-endless-mode-button').style.display = 'flex';
        intro_text = document.getElementById('loople-intro-text');
        if (intro_text) {
            intro_text.innerHTML = 'Click on the <img src="svg/ui/game.svg" class="loople-song-detail-icon-text" alt="Play"> game mode button to go back to the Daily song.';
        }
    }
    const modeButton = document.getElementById('loople-endless-mode-button');
    const endlessModeTxt = document.getElementById('loople-endless-mode-text');
    if (isEndlessMode()) {
        endlessModeTxt.innerHTML = "Endless Mode";
        modeButton.className = 'loople-info-button-gamemode-endless';
    } else {
        endlessModeTxt.innerHTML = "Daily Mode";
        modeButton.className = 'loople-info-button-gamemode-daily';
    }
}

function toggleEndlessMode() {
    if (!isEndlessMode()) {
        localStorage.setItem('loopleEndlessMode', true);
        window.location.reload();
    }
    else {
        localStorage.setItem('loopleEndlessMode', false);
        window.location.reload();
    }

}




// STATS FOR LOOPLE

const STATS_KEY = 'loopleStats';

function loadStats () {
  return JSON.parse(localStorage.getItem(STATS_KEY)) || {
    lastDay   : null,
    played    : 0,
    wins      : 0,
    concede   : 0,
    totalGuess: 0,
    totalSkips: 0,
    winguesses: 0,
  };
}

function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function recordGame(guesses, concede = false) {
  const today = getCurrentLocalDate().replace(/:/g, '-');
  const s = loadStats();

  if (s.lastDay === today) return;

  s.played++;
  if (guesses !== null) {
    if (concede) {
        s.concede++;
    } else {
        s.wins++;
        s.winguesses += guesses;
    }
    state = gameState();
    n_skips = state.guessedSongs.filter(song => song[0] === "skip" && song[1] === "skip").length;
    s.totalSkips += n_skips
    s.totalGuess += state.guessedSongs.length - n_skips
    if (concede) {
        s.totalGuess -= 1;
    }
  }
  s.lastDay = today;
  saveStats(s);
}


function gameState() {
    return JSON.parse(localStorage.getItem('loopleGameState')) || {
        guessedSongs: [],
        guessCount: 0,
        win: false,
        lastDay: getCurrentLocalDate(),
    };
}

function saveGameState(state) {
    localStorage.setItem('loopleGameState', JSON.stringify(state));
}

function addGuessedSong(song) {
    const state = gameState();
    state.guessedSongs.push(song);
    state.guessCount++;
    saveGameState(state);
}

function checkNewDay() {
    const today = getCurrentLocalDate();
    const lastDay = localStorage.getItem('loopleLastDay') || '1970-01-01';

    localStorage.setItem('loopleEndlessModeGuessCount', 0);

    if (lastDay !== today) {
        localStorage.setItem('loopleLastDay', today);
        localStorage.setItem('loopleGameState', JSON.stringify({
            guessedSongs: [],
            guessCount: 0,
            end: false,
            lastDay: today,
        }));
        localStorage.setItem('loopleEndlessMode', false);
    }
}

function getGuessCount(max = false) {
    if (isEndlessMode()) {
        if (max) {
            return Math.min(parseInt(localStorage.getItem('loopleEndlessModeGuessCount') || 0), 4);
        }
        return parseInt(localStorage.getItem('loopleEndlessModeGuessCount') || 0);
    }

    const state = gameState();
    if (max) {
        return Math.min(state.guessCount, 4);
    }
    return state.guessCount;
}


function isEndlessMode() {
    return localStorage.getItem('loopleEndlessMode') === 'true';
}

function increaseEndlessModeGuessCount() {
    let count = parseInt(localStorage.getItem('loopleEndlessModeGuessCount') || 0);
    count++;
    localStorage.setItem('loopleEndlessModeGuessCount', count);
}